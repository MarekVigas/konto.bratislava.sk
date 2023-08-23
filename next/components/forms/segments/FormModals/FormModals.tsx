import { useServerSideAuth } from 'frontend/hooks/useServerSideAuth'
import { useTranslation } from 'next-i18next'
import React from 'react'

import { useFormExportImport } from '../../../../frontend/hooks/useFormExportImport'
import Button from '../../simple-components/ButtonNew'
import { useFormModals } from '../../useFormModals'
import { useFormRedirects } from '../../useFormRedirects'
import { useFormState } from '../../useFormState'
import MessageModal, { MessageModalProps } from '../../widget-components/Modals/MessageModal'
import IdentityVerificationModal from '../IdentityVerificationModal/IdentityVerificationModal'
import RegistrationModal from '../RegistrationModal/RegistrationModal'

const FormModals = () => {
  const { t } = useTranslation('forms')
  const { skipModal } = useFormState()

  const {
    oldVersionSchemaModal,
    setOldSchemaVersionModal,
    registrationModal,
    setRegistrationModal,
    identityVerificationModal,
    setIdentityVerificationModal,
    conceptSaveErrorModal,
    setConceptSaveErrorModal,
    sendFilesScanningModal,
    setSendFilesScanningModal,
    sendFilesScanningEidModal,
    setSendFilesScanningEidModal,
    sendFilesScanningNotVerifiedEidModal,
    setSendFilesScanningNotVerifiedEidModal,
    sendIdentityMissingModal,
    setSendIdentityMissingModal,
    sendFilesScanningNonAuthenticatedEidModal,
    setSendFilesScanningNonAuthenticatedEidModal,
    sendFilesUploadingModal,
    setSendFilesUploadingModal,
    sendConfirmationModal,
    setSendConfirmationModal,
    sendConfirmationEidModal,
    setSendConfirmationEidModal,
    sendConfirmationEidLegalModal,
    setSendConfirmationEidLegalModal,
    sendConfirmationNonAuthenticatedEidModal,
    setSendConfirmationNonAuthenticatedEidModal,
    sendLoading,
    eidSendingModal,
    setEidSendingModal,
    eidSendErrorModal,
    setEidSendErrorModal,
    sendEidLoading,
    eidSendConfirmationModalIsLoading,
  } = useFormModals()
  const { saveConcept, saveConceptIsLoading } = useFormExportImport()
  const { register, verifyIdentity } = useFormRedirects()

  const messageModals: (MessageModalProps & { key: string })[] = [
    {
      key: 'oldVersionSchemaModal',
      isOpen: oldVersionSchemaModal,
      onOpenChange: setOldSchemaVersionModal,
      type: 'warning',
      title: t('old_schema_version_modal.title'),
      children: t('old_schema_version_modal.content'),
    },
    {
      key: 'skipStepModal',
      isOpen: skipModal.open,
      onOpenChange: skipModal.onOpenChange,
      title: t('skip_step_modal.title'),
      type: 'error',
      buttons: [
        <Button onPress={() => skipModal.onSkip()}>
          {t('skip_step_modal.button_secondary_title')}
        </Button>,
        <Button variant="category-solid" onPress={() => skipModal.onOpenChange(false)}>
          {t('skip_step_modal.button_primary_title')}
        </Button>,
      ],
      children: t('skip_step_modal.content'),
    },
    {
      key: 'conceptSaveErrorModal',
      isOpen: conceptSaveErrorModal,
      onOpenChange: setConceptSaveErrorModal,
      type: 'error',
      title: t('concept_save_error_modal.title'),
      buttons: [
        <Button onPress={() => setConceptSaveErrorModal(false)}>
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="category-solid"
          onPress={() => saveConcept(true)}
          isLoading={saveConceptIsLoading}
        >
          {t('concept_save_error_modal.button_repeat_text')}
        </Button>,
      ],
      children: t('concept_save_error_modal.content'),
    },
    {
      key: 'sendFilesScanningEidModal',
      isOpen: sendFilesScanningEidModal,
      onOpenChange: setSendFilesScanningEidModal,
      title: t('send_files_scanning_eid_modal.title'),
      type: 'warning',
      buttons: [
        <Button onPress={() => setSendFilesScanningEidModal(false)}>
          {t('modals_back_button_title')}
        </Button>,
        <Button variant="black-solid" onPress={() => skipModal.onSkip()}>
          {t('send_files_scanning_eid_modal.button_title')}
        </Button>,
      ],
      children: t('send_files_scanning_eid_modal.content'),
    },
    {
      key: 'sendFilesScanningNotVerifiedEidModal',
      isOpen: sendFilesScanningNotVerifiedEidModal,
      onOpenChange: setSendFilesScanningNotVerifiedEidModal,
      title: t('send_files_scanning_not_verified_eid_modal.title'),
      type: 'warning',
      buttons: [
        <Button onPress={() => setSendFilesScanningNotVerifiedEidModal(false)}>
          {t('modals_back_button_title')}
        </Button>,
        <Button variant="black-solid" onPress={() => verifyIdentity()}>
          {t('send_files_scanning_not_verified_eid_modal.button_title')}
        </Button>,
      ],
      children: t('send_files_scanning_not_verified_eid_modal.content'),
    },
    {
      key: 'sendIdentityMissingModal',
      isOpen: sendIdentityMissingModal,
      onOpenChange: setSendIdentityMissingModal,
      title: t('send_identity_missing_modal.title'),
      type: 'warning',
      buttons: [
        <Button onPress={() => setSendIdentityMissingModal(false)}>
          {t('modals_back_button_title')}
        </Button>,
        <Button variant="black-solid" onPress={() => verifyIdentity()}>
          {t('send_identity_missing_modal.button_title')}
        </Button>,
      ],
      children: t('send_identity_missing_modal.content'),
    },
    {
      key: 'sendFilesScanningNonAuthenticatedEidModal',
      isOpen: sendFilesScanningNonAuthenticatedEidModal,
      onOpenChange: setSendFilesScanningNonAuthenticatedEidModal,
      title: t('send_files_scanning_non_authenticated_eid_modal.title'),
      type: 'warning',
      buttons: [
        <Button onPress={() => setSendFilesScanningNonAuthenticatedEidModal(false)}>
          {t('modals_back_button_title')}
        </Button>,
        <Button variant="black-solid" onPress={() => register()}>
          {t('send_files_scanning_non_authenticated_eid_modal.button_title')}
        </Button>,
      ],
      children: t('send_files_scanning_non_authenticated_eid_modal.content'),
    },
    {
      key: 'sendFilesUploadingModal',
      isOpen: sendFilesUploadingModal,
      onOpenChange: setSendFilesUploadingModal,
      title: t('send_files_uploading_modal.title'),
      type: 'warning',
      buttons: [
        <Button onPress={() => setSendFilesUploadingModal(false)}>
          {t('modals_back_button_title')}
        </Button>,
      ],
      children: t('send_files_uploading_modal.content'),
    },
    {
      key: 'sendFilesScanningModal',
      isOpen: sendFilesScanningModal.isOpen,
      onOpenChange: (value) => {
        if (!value) {
          setSendFilesScanningModal({ isOpen: false })
        }
      },
      title: t('send_files_scanning_modal.title'),
      type: 'warning',
      buttons: [
        <Button onPress={() => setSendFilesScanningModal({ isOpen: false })}>
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="black-solid"
          onPress={() => sendFilesScanningModal.isOpen && sendFilesScanningModal.sendCallback()}
          isLoading={sendLoading}
        >
          {t('send_files_scanning_modal.button_title')}
        </Button>,
      ],
      children: t('send_files_scanning_modal.content'),
      isDismissable: !sendLoading,
      noCloseButton: sendLoading,
    },
    {
      key: 'sendConfirmationModal',
      isOpen: sendConfirmationModal.isOpen,
      onOpenChange: (value) => {
        if (!value) {
          setSendConfirmationModal({ isOpen: false })
        }
      },
      title: t('send_confirmation_modal.title'),
      type: 'info',
      buttons: [
        <Button
          onPress={() => setSendConfirmationModal({ isOpen: false })}
          isDisabled={sendLoading}
        >
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="black-solid"
          onPress={() => sendConfirmationModal.isOpen && sendConfirmationModal.sendCallback()}
          isLoading={sendLoading}
        >
          {t('send_confirmation_modal.button_title')}
        </Button>,
      ],
      isDismissable: !sendLoading,
      noCloseButton: sendLoading,
      children: t('send_confirmation_modal.content'),
    },
    {
      key: 'sendConfirmationEidModal',
      isOpen: sendConfirmationEidModal.isOpen,
      onOpenChange: (value) => {
        if (!value) {
          setSendConfirmationEidModal({ isOpen: false })
        }
      },
      title: t('send_confirmation_eid_modal.title'),
      type: 'info',
      buttons: [
        <Button
          onPress={() => setSendConfirmationEidModal({ isOpen: false })}
          isDisabled={eidSendConfirmationModalIsLoading}
        >
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="black-solid"
          onPress={() => sendConfirmationEidModal.isOpen && sendConfirmationEidModal.sendCallback()}
          isLoading={eidSendConfirmationModalIsLoading}
        >
          {t('send_confirmation_eid_modal.button_title')}
        </Button>,
      ],
      isDismissable: !eidSendConfirmationModalIsLoading,
      noCloseButton: eidSendConfirmationModalIsLoading,
      children: t('send_confirmation_eid_modal.content'),
    },
    {
      key: 'sendConfirmationEidLegalModal',
      isOpen: sendConfirmationEidLegalModal.isOpen,
      onOpenChange: (value) => {
        if (!value) {
          setSendConfirmationEidLegalModal({ isOpen: false })
        }
      },
      title: t('send_confirmation_eid_legal_modal.title'),
      type: 'info',
      buttons: [
        <Button
          onPress={() => setSendConfirmationEidLegalModal({ isOpen: false })}
          isDisabled={eidSendConfirmationModalIsLoading}
        >
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="black-solid"
          onPress={() =>
            sendConfirmationEidLegalModal.isOpen && sendConfirmationEidLegalModal.sendCallback()
          }
          isLoading={eidSendConfirmationModalIsLoading}
        >
          {t('send_confirmation_eid_legal_modal.button_title')}
        </Button>,
      ],
      isDismissable: !eidSendConfirmationModalIsLoading,
      noCloseButton: eidSendConfirmationModalIsLoading,
      children: t('send_confirmation_eid_legal_modal.content'),
    },
    {
      key: 'sendConfirmationNonAuthenticatedEidModal',
      isOpen: sendConfirmationNonAuthenticatedEidModal.isOpen,
      onOpenChange: (value) => {
        if (!value) {
          setSendConfirmationNonAuthenticatedEidModal({ isOpen: false })
        }
      },
      title: t('send_confirmation_non_authenticated_eid_modal.title'),
      type: 'info',
      buttons: [
        <Button
          onPress={() => setSendConfirmationNonAuthenticatedEidModal({ isOpen: false })}
          isDisabled={eidSendConfirmationModalIsLoading}
        >
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="black-solid"
          onPress={() =>
            sendConfirmationNonAuthenticatedEidModal.isOpen &&
            sendConfirmationNonAuthenticatedEidModal.sendCallback()
          }
          isLoading={eidSendConfirmationModalIsLoading}
        >
          {t('send_confirmation_non_authenticated_eid_modal.button_title')}
        </Button>,
      ],
      isDismissable: !eidSendConfirmationModalIsLoading,
      noCloseButton: eidSendConfirmationModalIsLoading,
      children: t('send_confirmation_non_authenticated_eid_modal.content'),
    },
    {
      key: 'eidSendingModal',
      isOpen: eidSendingModal,
      onOpenChange: setEidSendingModal,
      title: t('eid_sending_modal.title'),
      type: 'info',
      buttons: [
        // Faux button that show only is loading
        <Button isLoading={sendEidLoading} onPress={() => {}} />,
      ],
      isDismissable: false,
      noCloseButton: true,
      children: t('eid_sending_modal.content'),
    },
    {
      key: 'eidSendErrorModal',
      isOpen: eidSendErrorModal.isOpen,
      onOpenChange: (value) => {
        if (!value) {
          setEidSendErrorModal({ isOpen: false })
        }
      },
      title: t('eid_send_error_modal.title'),
      type: 'info',
      buttons: [
        <Button onPress={() => setEidSendErrorModal({ isOpen: false })} isDisabled={sendEidLoading}>
          {t('modals_back_button_title')}
        </Button>,
        <Button
          variant="black-solid"
          onPress={() => eidSendErrorModal.isOpen && eidSendErrorModal.sendCallback()}
          isLoading={sendEidLoading}
        >
          {t('eid_send_error_modal.button_title')}
        </Button>,
      ],
      isDismissable: !sendEidLoading,
      noCloseButton: sendEidLoading,
      children: t('eid_send_error_modal.content'),
    },
  ]

  const { accountType } = useServerSideAuth()

  return (
    <>
      <RegistrationModal
        type={registrationModal}
        isOpen={registrationModal != null}
        onOpenChange={(value) => {
          if (!value) {
            setRegistrationModal(null)
          }
        }}
      />
      <IdentityVerificationModal
        isOpen={identityVerificationModal}
        onOpenChange={setIdentityVerificationModal}
        accountType={accountType}
      />
      {messageModals.map((modalProps) => (
        <MessageModal {...modalProps} />
      ))}
    </>
  )
}

export default FormModals
