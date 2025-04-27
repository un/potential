import { z } from "zod";

import { serverEnv } from "@potential/env";
import { getSignedUrl, PutObjectCommand, s3Client } from "@potential/storage";
import { cloudTypeIdGenerator } from "@potential/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const storageRouter = createTRPCRouter({
  getUploadPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const { fileType } = input;

      const uploadId = cloudTypeIdGenerator("userUpload");
      const command = new PutObjectCommand({
        Bucket: serverEnv.storage.STORAGE_S3_BUCKET_UPLOADS,
        Key: `${userId}/${uploadId}`,
        ContentType: fileType,
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
