import type { Message } from "@ai-sdk/react";
import type { ToolInvocation } from "@ai-sdk/ui-utils";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetch as expoFetch } from "expo/fetch";
import { useChat } from "@ai-sdk/react";
import {
  Database,
  ForkKnife,
  Gear,
  PaperPlane,
  Sparkle,
} from "phosphor-react-native";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LongText } from "~/components/ui/long-text";
import { Text as UIText } from "~/components/ui/text";
import { getAuthHeaders, queryClient, trpc } from "~/utils/api";
import { getApiUrl } from "~/utils/base-url";
import { iconColor } from "~/utils/ui";

interface MessageProps {
  message: Message;
}

function UserMessage({ message }: MessageProps) {
  return (
    <View key={message.id} className="max-w-[80%] self-end">
      <View className="bg-sand-5 flex flex-col items-end gap-1 rounded-xl rounded-br-none p-3">
        <UIText className="font-bold">You</UIText>
        {message.parts?.map((part, index) => {
          switch (part.type) {
            case "text":
              return (
                <UIText key={index} className="">
                  {part.text}
                </UIText>
              );
            default:
              return null;
          }
        }) ?? <UIText className="">{message.content}</UIText>}
      </View>
    </View>
  );
}

function ToolInvocationComponent({
  toolInvocation,
  callId,
}: {
  toolInvocation: ToolInvocation;
  callId: string;
}) {
  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case "getUserExistingTrackers":
        return <Database size={16} color={iconColor()} />;
      case "generateNewNonConsumptionTracker":
        return <Sparkle size={16} color={iconColor()} />;
      case "generateConsumptionTrackers":
        return <ForkKnife size={16} color={iconColor()} />;
      default:
        return <Gear size={16} color={iconColor()} />;
    }
  };

  const getToolDisplayName = (toolName: string) => {
    switch (toolName) {
      case "getUserExistingTrackers":
        return "Checking existing trackers";
      case "generateNewNonConsumptionTracker":
        return "Designing new tracker";
      case "generateConsumptionTrackers":
        return "Preparing food & drink trackers";
      default:
        return toolName;
    }
  };

  switch (toolInvocation.toolName) {
    case "getUserExistingTrackers": {
      switch (toolInvocation.state) {
        case "partial-call":
          return (
            <Card key={callId} className="bg-blue-2 border-blue-6 p-3">
              <View className="flex flex-row items-center gap-2">
                {getToolIcon(toolInvocation.toolName)}
                <UIText className="text-blue-11 font-medium">
                  {getToolDisplayName(toolInvocation.toolName)}...
                </UIText>
              </View>
            </Card>
          );
        case "call":
          return (
            <Card key={callId} className="bg-blue-2 border-blue-6 p-3">
              <View className="flex flex-row items-center gap-2">
                {getToolIcon(toolInvocation.toolName)}
                <UIText className="text-blue-11 font-medium">
                  {getToolDisplayName(toolInvocation.toolName)}...
                </UIText>
              </View>
            </Card>
          );
        case "result": {
          const result = toolInvocation.result as
            | {
                trackers?: { name: string; logs?: { createdAt: string }[] }[];
              }
            | undefined;
          const trackers = result?.trackers ?? [];
          return (
            <Card key={callId} className="bg-green-2 border-green-6 p-3">
              <View className="flex flex-col gap-2">
                <View className="flex flex-row items-center gap-2">
                  {getToolIcon(toolInvocation.toolName)}
                  <UIText className="text-green-11 font-medium">
                    Found {trackers.length} existing trackers
                  </UIText>
                </View>
                {trackers.length > 0 && (
                  <View className="flex flex-col gap-1">
                    {trackers.slice(0, 3).map((tracker, index: number) => (
                      <UIText key={index} className="text-green-11 text-sm">
                        • {tracker.name}
                        {tracker.logs?.[0]?.createdAt &&
                          ` (last: ${new Date(tracker.logs[0].createdAt).toLocaleDateString()})`}
                      </UIText>
                    ))}
                    {trackers.length > 3 && (
                      <UIText className="text-green-11 text-sm">
                        ... and {trackers.length - 3} more
                      </UIText>
                    )}
                  </View>
                )}
              </View>
            </Card>
          );
        }
        default:
          return (
            <Card key={callId} className="bg-gray-2 border-gray-6 p-3">
              <View className="flex flex-row items-center gap-2">
                <Gear size={16} color={iconColor()} />
                <UIText className="text-gray-11 font-medium">
                  Processing tool call...
                </UIText>
              </View>
            </Card>
          );
      }
    }

    case "generateNewNonConsumptionTracker": {
      switch (toolInvocation.state) {
        case "partial-call":
          return (
            <Card key={callId} className="bg-purple-2 border-purple-6 p-3">
              <View className="flex flex-row items-center gap-2">
                {getToolIcon(toolInvocation.toolName)}
                <UIText className="text-purple-11 font-medium">
                  {getToolDisplayName(toolInvocation.toolName)}...
                </UIText>
              </View>
            </Card>
          );
        case "call": {
          const args = toolInvocation.args as
            | { description?: string }
            | undefined;
          return (
            <Card key={callId} className="bg-purple-2 border-purple-6 p-3">
              <View className="flex flex-row items-center gap-2">
                {getToolIcon(toolInvocation.toolName)}
                <UIText className="text-purple-11 font-medium">
                  {getToolDisplayName(toolInvocation.toolName)}...
                </UIText>
              </View>
              {args?.description && (
                <UIText className="text-purple-11 mt-1 text-sm">
                  For: {args.description}
                </UIText>
              )}
            </Card>
          );
        }
        case "result": {
          const result = toolInvocation.result as
            | { tracker?: { name: string; description: string }[] }
            | undefined;
          const newTrackers = result?.tracker ?? [];
          return (
            <Card key={callId} className="bg-green-2 border-green-6 p-3">
              <View className="flex flex-col gap-2">
                <View className="flex flex-row items-center gap-2">
                  {getToolIcon(toolInvocation.toolName)}
                  <UIText className="text-green-11 font-medium">
                    Designed {newTrackers.length} new tracker
                    {newTrackers.length !== 1 ? "s" : ""}
                  </UIText>
                </View>
                {newTrackers.length > 0 && (
                  <View className="flex flex-col gap-1">
                    {newTrackers.map((tracker, index: number) => (
                      <UIText key={index} className="text-green-11 text-sm">
                        • {tracker.name}: {tracker.description}
                      </UIText>
                    ))}
                  </View>
                )}
              </View>
            </Card>
          );
        }
        default:
          return (
            <Card key={callId} className="bg-gray-2 border-gray-6 p-3">
              <View className="flex flex-row items-center gap-2">
                <Gear size={16} color={iconColor()} />
                <UIText className="text-gray-11 font-medium">
                  Processing tool call...
                </UIText>
              </View>
            </Card>
          );
      }
    }
    case "generateConsumptionTrackers": {
      switch (toolInvocation.state) {
        case "partial-call":
          return (
            <Card key={callId} className="bg-purple-2 border-purple-6 p-3">
              <View className="flex flex-row items-center gap-2">
                {getToolIcon(toolInvocation.toolName)}
                <UIText className="text-purple-11 font-medium">
                  {getToolDisplayName(toolInvocation.toolName)}...
                </UIText>
              </View>
            </Card>
          );
        case "call": {
          const _args = toolInvocation.args as
            | { description?: string }
            | undefined;
          return (
            <Card key={callId} className="bg-purple-2 border-purple-6 p-3">
              <View className="flex flex-row items-center gap-2">
                {getToolIcon(toolInvocation.toolName)}
                <UIText className="text-purple-11 font-medium">
                  {getToolDisplayName(toolInvocation.toolName)}...
                </UIText>
              </View>
            </Card>
          );
        }
        case "result": {
          return (
            <Card key={callId} className="bg-green-2 border-green-6 p-3">
              <View className="flex flex-col gap-2">
                <View className="flex flex-row items-center gap-2">
                  {getToolIcon(toolInvocation.toolName)}
                  <UIText className="text-green-11 font-medium">
                    Prepared food & drink trackers
                  </UIText>
                </View>
              </View>
            </Card>
          );
        }
        default:
          return (
            <Card key={callId} className="bg-gray-2 border-gray-6 p-3">
              <View className="flex flex-row items-center gap-2">
                <Gear size={16} color={iconColor()} />
                <UIText className="text-gray-11 font-medium">
                  Processing tool call...
                </UIText>
              </View>
            </Card>
          );
      }
    }

    default:
      return (
        <Card key={callId} className="bg-gray-2 border-gray-6 p-3">
          <View className="flex flex-row items-center gap-2">
            {getToolIcon(toolInvocation.toolName)}
            <UIText className="text-gray-11 font-medium">
              {toolInvocation.toolName} ({toolInvocation.state})
            </UIText>
          </View>
        </Card>
      );
  }
}

function AIMessage({ message }: MessageProps) {
  return (
    <View key={message.id} className="max-w-[80%] self-start">
      <View className="flex flex-col gap-2 rounded-xl p-3">
        <UIText className="font-bold">AI</UIText>
        {message.parts?.map((part, index) => {
          switch (part.type) {
            case "step-start":
              // Show step boundaries as horizontal lines (skip for first step)
              return index > 0 ? (
                <View key={index} className="my-2">
                  <View className="bg-gray-6 h-px" />
                </View>
              ) : null;

            case "text":
              return (
                <UIText key={index} className="">
                  {part.text}
                </UIText>
              );

            case "tool-invocation": {
              const callId = part.toolInvocation.toolCallId;
              return (
                <ToolInvocationComponent
                  key={callId}
                  toolInvocation={part.toolInvocation}
                  callId={callId}
                />
              );
            }

            default:
              return null;
          }
        }) ?? <UIText className="">{message.content}</UIText>}
      </View>
    </View>
  );
}

export default function NewTrackerScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, input, handleSubmit, error, isLoading, setInput } = useChat(
    {
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${getApiUrl()}/ai/chat`,
      headers: getAuthHeaders(),
      maxSteps: 5, // Enable multi-step tool calls
      onError: (err) => console.error(err, "ERROR_CHAT"),
    },
  );

  const processedToolCallIds = useRef(new Set<string>());

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      for (const part of lastMessage.parts) {
        if (
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "generateConsumptionTrackers" &&
          part.toolInvocation.state === "result" &&
          !processedToolCallIds.current.has(part.toolInvocation.toolCallId)
        ) {
          queryClient
            .invalidateQueries({
              queryKey: trpc.tracker.getTrackersForParentType.queryKey({
                trackerParentType: "consumption",
              }),
            })
            .then(() => {
              processedToolCallIds.current.add(part.toolInvocation.toolCallId);
            })
            .catch((error: Error) => {
              console.error(
                "Failed to invalidate consumption trackers queries:",
                error,
              );
            });
        }
      }
    }
  }, [messages]);

  const onActualSubmit = () => {
    handleSubmit();
  };

  const getAllGeneratedTrackers = (): {
    name: string;
    description: string;
  }[] => {
    const allTrackers: { name: string; description: string }[] = [];
    for (const message of messages) {
      if (message.role === "assistant") {
        for (const part of message.parts) {
          if (
            part.type === "tool-invocation" &&
            part.toolInvocation.toolName ===
              "generateNewNonConsumptionTracker" &&
            part.toolInvocation.state === "result"
          ) {
            const result = part.toolInvocation.result as
              | { tracker?: { name: string; description: string }[] }
              | undefined;
            if (result?.tracker) {
              allTrackers.push(...result.tracker);
            }
          }
        }
      }
    }
    return allTrackers;
  };

  const latestTrackers = getAllGeneratedTrackers();

  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <View className="flex flex-1 flex-col gap-4 p-6">
        <ScrollView
          ref={scrollViewRef}
          className="flex flex-1 flex-col gap-4"
          contentContainerClassName="pb-4"
          keyboardShouldPersistTaps="handled"
          scrollToOverflowEnabled
        >
          <View className="flex flex-col gap-4">
            {messages.map((m) =>
              m.role === "user" ? (
                <UserMessage key={m.id} message={m} />
              ) : (
                <AIMessage key={m.id} message={m} />
              ),
            )}
            {isLoading && (
              <View className="items-center">
                <UIText type={"title"} className="text-sand-11 text-sm">
                  Thinking...
                </UIText>
              </View>
            )}
            {error && (
              <View className="items-center">
                <UIText className="text-red-9">Error: {error.message}</UIText>
              </View>
            )}
          </View>
        </ScrollView>
        {latestTrackers.length > 0 && (
          <View className="flex flex-row flex-wrap gap-4">
            {latestTrackers.map((tracker, index) => (
              <Button key={index} variant={"secondary"} size={"sm"}>
                <UIText className="text-sm">Add {tracker.name}</UIText>
              </Button>
            ))}
          </View>
        )}

        <View className="flex w-full flex-row items-end gap-4">
          <View className="flex-1">
            <LongText
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              editable={!isLoading}
            />
          </View>
          <Button
            onPress={onActualSubmit}
            disabled={isLoading || !input.trim()}
            className=""
          >
            <PaperPlane size={24} color={iconColor({ lightColor: true })} />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
