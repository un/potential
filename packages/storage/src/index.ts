import { S3Client } from "@aws-sdk/client-s3";

import { serverEnv } from "@1up/env";

export const s3Client = new S3Client({
  region: serverEnv.storage.STORAGE_S3_REGION,
  endpoint: serverEnv.storage.STORAGE_S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: serverEnv.storage.STORAGE_S3_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.storage.STORAGE_S3_SECRET_ACCESS_KEY,
  },
});

export { PutObjectCommand } from "@aws-sdk/client-s3";
export { getSignedUrl } from "@aws-sdk/s3-request-presigner";
