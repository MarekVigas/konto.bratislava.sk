import { formsApi } from '@clients/forms'
import { GetFileResponseReducedDto } from '@clients/openapi-forms'
import { Query, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ClientFileInfo,
  FileInfo,
  FileStatus,
  FileStatusType,
} from 'forms-shared/form-files/fileStatus'
import { mergeClientAndServerFiles } from 'forms-shared/form-files/mergeClientAndServerFiles'
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useIsMounted } from 'usehooks-ts'

import { environment } from '../../environment'
import { FormFileUploadConstraints } from '../../frontend/types/formFileUploadTypes'
import {
  getFileInfoForNewFiles,
  shouldPollServerFiles,
  uploadFile,
} from '../../frontend/utils/formFileUpload'
import { useFormContext } from './useFormContext'

const REFETCH_INTERVAL = 5000

/**
 * This service handles the state for file upload. There are two types of files:
 *  - Client files: files that are being uploaded by the user
 *  - Server files: files that have been uploaded to the server
 *
 *  After the user triggers the upload of a file, the id of the file is immediately generated, and it is added to the
 *  client files list. `clientFiles` also holds the state of the upload (queued, uploading, ...) and acts as the queue
 *  of files to be uploaded. On every change the list is checked whether there's a file that needs to be uploaded and if
 *  so, it's uploaded.
 *
 *  One of many reasons that ids are generated by the client are:
 *  - The upload widget is rendered on the particular step, but the service also uploads the file on the background.
 *    as the id is immediately persisted in form data (before the upload even starts), there's no need for update of the
 *    form data when the upload is done by the widget that might not be rendered anymore.
 *
 *                      the upload component wouldn't be able to update the form data ˅
 *    Form file upload component   |---------------| detached |----------------| detached
 *    File upload                        |--------------------------------------------|
 *                                       ^ file id is generated and persisted in form data
 *
 *  - The form can be saved as a concept while the file is uploading.
 *
 *  At the end, the client and server files are merged and returned to the consumer.
 */
export const useGetContext = () => {
  const { formId, initialServerFiles, initialClientFiles } = useFormContext()
  const queryClient = useQueryClient()
  const isMounted = useIsMounted()

  // The client files are both stored in the state and in the ref. The state is used to trigger re-rendering of the
  // component, while the ref is used to get the current value of the client files. The ref is used in the functions
  // that need the immediate access to the current value of the client files. (As opposed to the state, which is
  // updated asynchronously.) For example, when triggering `uploadFiles` and `removeFile` functions right after each other,
  // the current value of the client files is needed immediately. Also, the `uploadFile` callback would not have access
  // to the current value of the client files if it was stored only in the state.
  // The state should be only modified by the `updateClientFiles` function.
  const [clientFiles, setClientFiles] = useState<ClientFileInfo[]>(initialClientFiles ?? [])
  const clientFilesRef = useRef(clientFiles)
  const getClientFiles = useCallback(() => clientFilesRef.current, [])

  const refetchInterval = useMemo(() => {
    return (query: Query<GetFileResponseReducedDto[]>) =>
      shouldPollServerFiles(query.state.data, clientFiles) ? REFETCH_INTERVAL : false
  }, [clientFiles])

  const serverFilesQueryKey = ['serverFiles', formId]
  const serverFilesQuery = useQuery({
    queryKey: serverFilesQueryKey,
    queryFn: async () => {
      const response = await formsApi.filesControllerGetFilesStatusByForm(formId, {
        accessToken: 'onlyAuthenticated',
      })
      return response.data
    },
    retry: Infinity, // Retry infinitely
    retryDelay: 5000, // Retry every 5 seconds
    staleTime: Infinity,
    refetchInterval,
    initialData: initialServerFiles,
    initialDataUpdatedAt: Date.now(),
  })

  /**
   * Updates client files and handles side effects of the change if needed. This is the only place that should trigger
   * `setClientFiles` and/or modify `clientFilesRef.current`.
   */
  const updateClientFiles = (newClientFiles: ClientFileInfo[]) => {
    if (!isMounted()) {
      return
    }

    clientFilesRef.current = newClientFiles
    setClientFiles(newClientFiles)

    /**
     * Verifies if there's a file that needs to be uploaded and schedules it if needed.
     */
    const scheduleUploadIfNeeded = async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const isAlreadyUploadingFile = newClientFiles.some(
        (item) => item.status.type === FileStatusType.Uploading,
      )
      const firstQueuedFile = newClientFiles.find(
        (file) => file.status.type === FileStatusType.UploadQueued,
      )

      if (isAlreadyUploadingFile || !firstQueuedFile) {
        return
      }

      const updateFileStatus = (status: FileStatus) => {
        const clientFilesWithUpdatedStatus = clientFilesRef.current.map((file) => {
          if (file.id === firstQueuedFile.id) {
            return { ...file, status }
          }
          return file
        })

        updateClientFiles(clientFilesWithUpdatedStatus)
      }

      const abortController = new AbortController()

      updateFileStatus({
        type: FileStatusType.Uploading,
        progress: 0,
        abortController,
      })

      await uploadFile({
        formId,
        file: firstQueuedFile.file,
        id: firstQueuedFile.id,
        abortController,
        onSuccess: () => {
          updateFileStatus({ type: FileStatusType.WaitingForScan })

          // This forces server files to be refetched and get scanning status for the uploaded file.
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          serverFilesQuery.refetch()
        },
        onError: (error) => {
          updateFileStatus({
            type: FileStatusType.UploadServerError,
            error,
            canRetry: true,
          })
        },
        onProgress: (progress) => {
          updateFileStatus({
            type: FileStatusType.Uploading,
            progress,
            abortController,
          })
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    scheduleUploadIfNeeded()
  }

  const uploadFiles = (files: File[], constraints: FormFileUploadConstraints) => {
    const newFiles = getFileInfoForNewFiles(files, constraints)

    updateClientFiles([...getClientFiles(), ...newFiles])

    return newFiles.map((file) => file.id)
  }

  const removeFiles = (ids: string[]) => {
    // Abort uploading files that are being removed.
    getClientFiles()
      .filter((file) => ids.includes(file.id))
      .forEach((file) => {
        if (file.status.type === FileStatusType.Uploading) {
          file.status.abortController.abort()
        }
      })

    updateClientFiles(getClientFiles().filter((file) => !ids.includes(file.id)))
  }

  /**
   * This function is called after every form data change. This assures only files that are still in the form data are
   * kept. E.g. if a conditional field containing a file is removed, the X button is not clicked, so we need to parse
   * the form data and remove files that are not there anymore.
   * @param ids
   */
  const keepFiles = (ids: string[]) => {
    const filesToRemove = getClientFiles().filter((file) => !ids.includes(file.id))
    removeFiles(filesToRemove.map((file) => file.id))
  }

  /**
   * Files are retried in a way that the same File object is reused, but a new id is generated for it.
   * It wouldn't be possible to reuse the same id as the server might flag it as used.
   */
  const retryFile = (id: string, constraints: FormFileUploadConstraints) => {
    const fileToRetry = getClientFiles().find((file) => file.id === id)
    if (!fileToRetry) {
      return null
    }

    const canRetry = 'canRetry' in fileToRetry.status && fileToRetry.status.canRetry
    if (!canRetry) {
      return null
    }

    const newFiles = getFileInfoForNewFiles([fileToRetry.file], constraints)
    updateClientFiles([...getClientFiles().filter((file) => file.id !== id), ...newFiles])

    return newFiles[0].id
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const downloadFile = async (id: string) => {
    try {
      const response = await formsApi.filesControllerDownloadToken(id, {
        accessToken: 'onlyAuthenticated',
      })
      const { jwt } = response.data
      window.open(`${environment.formsUrl}/files/download/file/${jwt}`, '_blank')
    } catch (error) {
      // TODO handle error
    }
  }

  /**
   *
   * @param ids
   */
  const refetchAfterImportIfNeeded = async (ids: string[]) => {
    if (ids.length === 0) {
      return
    }

    const fileNotInServerFiles =
      !serverFilesQuery.data || ids.some((id) => !serverFilesQuery.data?.[id])
    if (!serverFilesQuery.isFetched || fileNotInServerFiles) {
      await serverFilesQuery.refetch()
    }
  }

  const mergedFiles = useMemo(() => {
    return mergeClientAndServerFiles(clientFiles, serverFilesQuery.data)
  }, [clientFiles, serverFilesQuery.data])

  const getFileInfoById = useCallback(
    (fileId: string) => {
      const file = mergedFiles[fileId]

      if (!file) {
        return {
          status:
            !serverFilesQuery.isFetched && serverFilesQuery.isFetching
              ? // The special case when info about the file is not available yet, e.g. when the user imports the data and
                // the server files are not fetched yet, or when they are being fetched.
                {
                  type: FileStatusType.UnknownStatus as const,
                  offline: serverFilesQuery.fetchStatus === 'paused',
                }
              : // The special case when the file is stored in the form data, but not in client nor server files, it can happen
                // when the form concept was saved, but the file upload hasn't finished yet and the user navigates away.
                { type: FileStatusType.UnknownFile as const },
          fileName: fileId,
          fileSize: null,
        } satisfies FileInfo
      }

      return file
    },
    [
      mergedFiles,
      serverFilesQuery.isFetched,
      serverFilesQuery.isFetching,
      serverFilesQuery.fetchStatus,
    ],
  )

  // Cleanup
  useEffect(() => {
    return () => {
      clientFilesRef.current.forEach((file) => {
        if (file.status.type === FileStatusType.Uploading) {
          file.status.abortController.abort()
        }
      })
      // Don't persist the data between page navigations.
      queryClient.removeQueries({ queryKey: serverFilesQueryKey })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    clientFiles,
    serverFiles: serverFilesQuery.data,
    uploadFiles,
    removeFiles,
    keepFiles,
    retryFile,
    downloadFile,
    refetchAfterImportIfNeeded,
    getFileInfoById,
  }
}

const FormFileUploadContext = createContext<ReturnType<typeof useGetContext> | undefined>(undefined)

export const FormFileUploadProvider = ({ children }: PropsWithChildren) => {
  const context = useGetContext()

  return <FormFileUploadContext.Provider value={context}>{children}</FormFileUploadContext.Provider>
}

export const useFormFileUpload = () => {
  const context = useContext(FormFileUploadContext)
  if (!context) {
    throw new Error('useFormFileUpload must be used within a FormFileUploadProvider')
  }

  return context
}
