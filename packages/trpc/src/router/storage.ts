import { z } from "zod";

import { serverEnv } from "@1up/env";
import { getSignedUrl, PutObjectCommand, s3Client } from "@1up/storage";
import { cloudTypeIdGenerator } from "@1up/utils";

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
        Bucket: serverEnv.storage.STORAGE_S3_BUCKET_AVATARS,
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
