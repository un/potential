import React, { useRef, useState } from "react";
import { View } from "react-native";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import type { ImagePickerUploaderRef } from "~/components/ui/image-picker-uploader";
import AudioRecorderComponent from "~/components/app/audioRecorder";
import { Button } from "~/components/ui/button";
import { ImagePickerUploader } from "~/components/ui/image-picker-uploader";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/utils/api";
import { LogStepWrapper } from "./LogStepWrapper";

// Step components for each button
export const PhotoStep = ({ onBack }: { onBack: () => void }) => {
  const [imageState, setImageState] = useState<{
    pendingUpload: boolean;
    imageIds: string[];
  }>({
    pendingUpload: false,
    imageIds: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const imagePickerRef = useRef<ImagePickerUploaderRef>(null);

  const handleUpload = async () => {
    if (imagePickerRef.current) {
      const result = await imagePickerRef.current.uploadPendingImages();
      if (result.success) {
        console.log("Images uploaded successfully:", result.imageIds);
      } else {
        console.error("Upload failed:", result.error);
      }
    }
  };

  return (
    <LogStepWrapper title="Photo Log" onBack={onBack} zeroPadding noSafeArea>
      <ImagePickerUploader
        ref={imagePickerRef}
        onImagesChanged={setImageState}
        onUploadStateChange={setIsUploading}
      />
      {imageState.pendingUpload && (
        <View className="px-6 pb-6">
          <Button
            onPress={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            <Text>{isUploading ? "Uploading..." : "Upload Images"}</Text>
          </Button>
        </View>
      )}
      {imageState.imageIds.map((imageId) => (
        <Text key={imageId}>{imageId}</Text>
      ))}
    </LogStepWrapper>
  );
};

// Create similar components for each step
export const AudioStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Audio Log" onBack={onBack}>
    <Text>Audio logging content goes here</Text>
    <AudioRecorderComponent />
  </LogStepWrapper>
);

const foodDrinkTextSchema = z.object({
  text: z
    .string()
    .min(4, { message: "Keep writing!" })
    .max(1024, { message: "Sorry, we can't log that much text... Yet!" }),
});

// Add new text step
export const TextStep = ({ onBack }: { onBack: () => void }) => {
  const queryClient = useQueryClient();

  const textAreaPlaceholders = [
    "Ate a BrandName protein bar",
    "Tall frappeCaraMatcha coffee",
    "Large bowl of Katsu curry",
    "I'll just have the salad",
    "Drank a tall glass of water",
  ];

  const [placeholder, setPlaceholder] = React.useState(textAreaPlaceholders[0]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(
        Math.random() * textAreaPlaceholders.length,
      );
      setPlaceholder(textAreaPlaceholders[randomIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [textAreaPlaceholders]);

  const { mutateAsync, error } = useMutation(
    trpc.log.createTextLog.mutationOptions({
      async onSuccess() {
        // setTitle("");
        // setContent("");
        // await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    }),
  );

  //  const postQuery = useQuery(trpc.post.all.queryOptions());

  const form = useForm({
    defaultValues: {
      text: "",
    },
    validators: {
      onChange: foodDrinkTextSchema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        text: value.text,
      });
      if (error) {
        console.error(error);
      }
      // router.back();
    },
  });
  return (
    <LogStepWrapper title="Text Log" onBack={onBack}>
      <View className="flex flex-col gap-6">
        <form.Field
          name="text"
          validators={{
            onChangeAsyncDebounceMs: 1500,
          }}
          children={(field) => {
            return (
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={field.state.meta.errors as object[]}
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

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              onPress={() => form.handleSubmit()}
              loading={isSubmitting}
              disabled={!canSubmit}
              className="mt-6"
            >
              <Text>Log it</Text>
            </Button>
          )}
        />
      </View>
    </LogStepWrapper>
  );
};

// Add scan step
export const ScanStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Scan Log" onBack={onBack}>
    <Text>Scan logging content goes here</Text>
    {/* Add your scan logging UI here */}
  </LogStepWrapper>
);

// Add search step
export const SearchStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Search Food" onBack={onBack}>
    <Text>Food search content goes here</Text>
    {/* Add your food search UI here */}
  </LogStepWrapper>
);
