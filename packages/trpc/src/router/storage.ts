import { z } from "zod";

import type { CloudTypeId } from "@1up/utils";
import { serverEnv } from "@1up/env";
import { getSignedUrl, PutObjectCommand, s3Client } from "@1up/storage";
import { cloudTypeIdGenerator } from "@1up/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const storageRouter = createTRPCRouter({
  getUploadPresignedUrls: protectedProcedure
    .input(
      z.object({
        count: z.number().min(1).max(10).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { count } = input;
      const userId = ctx.auth.user.id;

      const uploads: {
        id: CloudTypeId<"userUpload">;
        url: string;
      }[] = [];

      for (let i = 0; i < count; i++) {
        const uploadId = cloudTypeIdGenerator("userUpload");

        const command = new PutObjectCommand({
          Bucket: serverEnv.storage.STORAGE_S3_BUCKET_UPLOADS,
          Key: `${userId}/${uploadId}`,
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        uploads.push({
          id: uploadId,
          url: signedUrl,
        });
      }

      return uploads;
    }),
});
