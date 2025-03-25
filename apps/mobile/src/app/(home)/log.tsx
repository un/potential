import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { trpc } from "~/utils/api";

const logTextSchema = z.object({
  text: z
    .string()
    .min(4, { message: "Keep writing!" })
    .max(1024, { message: "Sorry, we can't log that much text... Yet!" }),
});

export default function Logger() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const textAreaPlaceholders = [
    "Ate a BrandName protein bar",
    "Went for a 45 minute walk",
    "Drank 2 cups of coffee",
    "Took my daily supplements",
    "Finished a 30 min mediation",
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
      onChange: logTextSchema,
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
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex flex-col gap-6 p-6">
        <form.Field
          name="text"
          validators={{
            onChangeAsyncDebounceMs: 1500,
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                error={field.state.meta.errors as object[]}
                label="What do you want to log?"
                placeholder={placeholder}
                editable={!form.state.isSubmitting}
              />
            );
          }}
        />
        <Text className="text-sand-11 text-sm">
          Tips: Be as detailed as possible. We'll automagically detect if you're
          already tracking this item, and create a new tracking category if
          you're not.
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
    </SafeAreaView>
  );
}
