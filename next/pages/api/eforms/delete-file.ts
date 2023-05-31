import { NextApiRequest, NextApiResponse } from 'next'

import minioClient, {
  infectedBucketName,
  safeBucketName,
  unscannedBucketName,
} from '../../../backend/utils/minio-client'
import logger from '../../../frontend/utils/logger'

const handleDeleteRequest = async (req: NextApiRequest) => {
  const {
    query: { fileName, fileScanStatus },
  } = req

  if (!fileScanStatus && Array.isArray(fileScanStatus)) throw new Error('Wrong fileScanStatus')
  let bucketName = unscannedBucketName
  if (["SAFE"].includes(fileScanStatus as string)){
    bucketName = safeBucketName
  } else if (["INFECTED"].includes(fileScanStatus as string)) {
    bucketName = infectedBucketName
  } else if (fileScanStatus === 'NOT FOUND') return

  const isBucketExisting = await minioClient.bucketExists(bucketName)
  if (!isBucketExisting) throw new Error('S3 Bucket does not exists')
  if (!fileName || Array.isArray(fileName)) throw new Error('Wrong query params')
  await minioClient.removeObject(bucketName, fileName)
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    await handleDeleteRequest(req)
      .then((response) => res.status(200).json({ data: 'success', response }))
      .catch((error) => {
        logger.error(error)
        res.status(500).json({ error })
      })
    return res
  }
  return res.status(405).json({ error: `Method '${String(req.method)}' Not Allowed` })
}

export default handler
