import { serverEnv } from "@1up/env";
import { getSignedUrl, PutObjectCommand, s3Client } from "@1up/storage";
import { cloudTypeIdGenerator } from "@1up/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const storageRouter = createTRPCRouter({
  getUploadPresignedUrl: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const uploadId = cloudTypeIdGenerator("userUpload");
    const command = new PutObjectCommand({
      Bucket: serverEnv.storage.STORAGE_S3_BUCKET_UPLOADS,
      Key: `${userId}/${uploadId}`,
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    console.log("🔥 trpc storage getUploadPresignedUrls", { signedUrl });

    return {
      id: uploadId,
      url: signedUrl,
    };
  }),
});
