import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetch as expoFetch } from "expo/fetch";
import { useChat } from "@ai-sdk/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text as UIText } from "~/components/ui/text";
import { getApiUrl } from "~/utils/base-url";

export default function NewTrackableScreen() {
  const { messages, input, handleSubmit, error, isLoading, setInput } = useChat(
    {
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${getApiUrl()}/ai/chat`,
      onError: (err) => console.error(err, "ERROR_CHAT"),
    },
  );

  const onActualSubmit = () => {
    handleSubmit();
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex flex-1 flex-col px-4 pb-4">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-4"
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <View
              key={m.id}
              className={`my-2 max-w-[80%] ${
                m.role === "user" ? "self-end" : "self-start"
              }`}
            >
              <View
                className={`rounded-xl p-3 ${
                  m.role === "user" ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <UIText
                  className={`mb-1 font-bold ${
                    m.role === "user" ? "text-white" : "text-black"
                  }`}
                >
                  {m.role === "user" ? "You" : "AI"}
                </UIText>
                <UIText
                  className={m.role === "user" ? "text-white" : "text-black"}
                >
                  {m.content}
                </UIText>
              </View>
            </View>
          ))}
          {isLoading && (
            <View className="my-2 items-center">
              <UIText>Thinking...</UIText>
            </View>
          )}
          {error && (
            <View className="my-2 items-center">
              <UIText className="text-red-500">Error: {error.message}</UIText>
            </View>
          )}
        </ScrollView>

        <View className="mt-3 flex flex-row items-center border-t border-gray-200 pt-3">
          <Input
            className="mr-3 flex-1 rounded-[20px] border border-gray-300 bg-white px-4 py-3 text-black"
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#8E8E93"
            editable={!isLoading}
            multiline
          />
          <Button
            onPress={onActualSubmit}
            disabled={isLoading || !input.trim()}
            className="rounded-[20px] px-4"
          >
            <UIText className="font-bold text-white">Send</UIText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
