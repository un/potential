import type { Message } from "@ai-sdk/react";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetch as expoFetch } from "expo/fetch";
import { useChat } from "@ai-sdk/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text as UIText } from "~/components/ui/text";
import { getAuthHeaders } from "~/utils/api";
import { getApiUrl } from "~/utils/base-url";

interface MessageProps {
  message: Message;
}

function UserMessage({ message }: MessageProps) {
  return (
    <View key={message.id} className="max-w-[80%] self-end">
      <View className="bg-sand-5 flex flex-col items-end gap-1 rounded-xl p-3">
        <UIText className="font-bold">You</UIText>
        <UIText className="">{message.content}</UIText>
      </View>
    </View>
  );
}

function AIMessage({ message }: MessageProps) {
  return (
    <View key={message.id} className="max-w-[80%] self-start">
      <View className="flex flex-col gap-1 rounded-xl p-3">
        <UIText className="font-bold">AI</UIText>
        <UIText className="">{message.content}</UIText>
      </View>
    </View>
  );
}

export default function NewTrackableScreen() {
  const { messages, input, handleSubmit, error, isLoading, setInput } = useChat(
    {
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${getApiUrl()}/ai/chat`,
      headers: getAuthHeaders(),
      onError: (err) => console.error(err, "ERROR_CHAT"),
    },
  );

  const onActualSubmit = () => {
    handleSubmit();
  };

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex flex-1 flex-col p-6">
        <ScrollView
          className="flex flex-1 flex-col gap-4"
          contentContainerClassName="pb-4"
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) =>
            m.role === "user" ? (
              <UserMessage key={m.id} message={m} />
            ) : (
              <AIMessage key={m.id} message={m} />
            ),
          )}
          {isLoading && (
            <View className="items-center">
              <UIText type={"title"}>Thinking...</UIText>
            </View>
          )}
          {error && (
            <View className="items-center">
              <UIText className="text-red-9">Error: {error.message}</UIText>
            </View>
          )}
        </ScrollView>

        <View className="flex flex-row items-center pt-3">
          <Input
            className="flex-1"
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
            <UIText className="font-bold">Send</UIText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
