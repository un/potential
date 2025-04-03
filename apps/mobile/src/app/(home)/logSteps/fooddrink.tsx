import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
import { Button } from "~/components/ui/button";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/utils/api";
import { LogStepWrapper } from "./LogStepWrapper";

export const FoodDrinkStep = ({ onBack }: { onBack: () => void }) => {
  // Text related
  const textAreaPlaceholders = [
    "Ate a BrandName protein bar",
    "Tall frappeCaraMatcha coffee",
    "Large bowl of Katsu curry",
    "I'll just have the salad",
    "Drank a tall glass of water",
  ];

  const [placeholder] = useState(textAreaPlaceholders[0]);
  const [imageState, setImageState] = useState<{
    pendingUpload: boolean;
    imageIds: string[];
  }>({
    pendingUpload: false,
    imageIds: [],
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [_isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const { mutateAsync } = useMutation(
    trpc.log.createFoodDrinkLog.mutationOptions({
      onError: (err) => {
        console.error("Mutation error:", err);
        toast.error(err.message || "Failed to save food/drink log");
        setIsFormSubmitting(false);
      },
    }),
  );

  //  const postQuery = useQuery(trpc.post.all.queryOptions());

  const form = useForm({
    defaultValues: {
      text: "",
    },
  });

  // Image related
  const imagePickerRef = useRef<ImagePickerUploaderRef>(null);

  const handleUpload = async () => {
    if (imagePickerRef.current) {
      const result = await imagePickerRef.current.uploadPendingImages();
      if (result.success) {
        setImageState((prev) => ({
          ...prev,
          pendingUpload: false,
          imageIds: result.imageIds,
        }));
        return result.imageIds;
      } else {
        console.error("Upload failed:", result.error);
        toast.error("Failed to upload image. Please try again.");
        setIsFormSubmitting(false);
        return undefined;
      }
    }
  };

  async function handleSubmit() {
    setIsFormSubmitting(true);

    const textValue = form.getFieldValue("text");
    if (
      !textValue &&
      imageState.imageIds.length === 0 &&
      !imageState.pendingUpload
    ) {
      toast.error("Please add text or an image to continue");
      setIsFormSubmitting(false);
      return;
    }

    console.log("imageState", imageState);
    const imageIds: string[] = [];
    imageIds.push(...imageState.imageIds);

    if (imageState.pendingUpload) {
      const uploadedImageIds = await handleUpload();
      if (uploadedImageIds) {
        imageIds.push(...uploadedImageIds);
      }
    }

    // Send both text and imageIds to match the API requirements
    await mutateAsync({
      text: textValue,
      imageIds,
    });
    toast.success("Food/drink logged successfully");
    router.back();
    setIsFormSubmitting(false);
  }

  return (
    <LogStepWrapper title="Photo Log" onBack={onBack}>
      <View className="flex flex-col gap-4">
        <form.Field
          name="text"
          children={(field) => {
            return (
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={
                  field.state.meta.errors.length
                    ? [{ message: JSON.stringify(field.state.meta.errors) }]
                    : undefined
                }
                label="What did you eat or drink?"
                placeholder={placeholder}
                editable={!form.state.isSubmitting}
              />
            );
          }}
        />

        <Text className="text-sand-11 text-sm">
          Tips: Be as detailed as possible about the components and size of this
          meal/drink.
        </Text>

        <Button
          onPress={() => handleSubmit()}
          loading={isFormSubmitting}
          disabled={isFormSubmitting}
          className="mt-6"
        >
          <Text>Log it</Text>
        </Button>
        <ImagePickerUploader
          ref={imagePickerRef}
          onImagesChanged={setImageState}
          onUploadStateChange={setIsUploading}
        />

        {/* <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
          )}
        /> */}
      </View>
    </LogStepWrapper>
  );
};
