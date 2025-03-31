import { TRPCError } from "@trpc/server";

import {
  createDirectUpload,
  createDirectUploadSchema,
  createSignedImageUrl,
  doesUserOwnImage,
  getImageUrlForAI,
  getImageUrlForAISchema,
  getSignedImageUrlSchema,
} from "@1up/storage";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const storageRouter = createTRPCRouter({
  /**
   * Create direct upload URLs for Cloudflare Images
   */
  createDirectUpload: protectedProcedure
    .input(createDirectUploadSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { metadata = {}, count = 1 } = input;
        const userId = ctx.auth.user.id;

        // Generate multiple upload URLs if requested
        if (count > 1) {
          const uploads = await Promise.all(
            Array.from({ length: count }).map(() =>
              createDirectUpload(userId, metadata),
            ),
          );

          return { uploads };
        }

        // Generate a single upload URL
        const upload = await createDirectUpload(userId, metadata);
        return { upload };
      } catch (error) {
        console.error("Failed to create direct upload URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create direct upload URL",
        });
      }
    }),

  /**
   * Get a signed URL for a Cloudflare image
   */
  getSignedImageUrl: protectedProcedure
    .input(getSignedImageUrlSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { imageId, variant, isSystemRequest } = input;

        // For system requests (e.g., AI image analysis), we skip owner check
        if (isSystemRequest) {
          const url = await createSignedImageUrl(imageId, variant);
          return { url };
        }

        // For user requests, verify authentication and ownership
        if (!ctx.auth.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        // Check if user owns the image
        const isOwner = await doesUserOwnImage(imageId, ctx.auth.user.id);
        if (!isOwner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this image",
          });
        }

        // Generate signed URL for the image
        const url = await createSignedImageUrl(imageId, variant);

        return { url };
      } catch (error) {
        console.error("Failed to get signed image URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get signed image URL",
        });
      }
    }),

  /**
   * Get a URL for using an image in AI prompts
   */
  getImageUrlForAI: protectedProcedure
    .input(getImageUrlForAISchema)
    .query(async ({ ctx, input }) => {
      try {
        // Ensure user is authenticated
        if (!ctx.auth.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const { imageId, variant } = input;

        // Check if user owns the image
        const isOwner = await doesUserOwnImage(imageId, ctx.auth.user.id);
        if (!isOwner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have access to this image",
          });
        }

        // Generate URL for AI prompts (short-lived URL)
        const url = await getImageUrlForAI(imageId, variant);

        return { url };
      } catch (error) {
        console.error("Failed to get image URL for AI:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get image URL for AI",
        });
      }
    }),
});
