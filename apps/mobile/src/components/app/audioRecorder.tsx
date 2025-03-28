import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { Text } from "~/components/ui/text";
import { TouchableOpacity } from "~/components/ui/touchable-opacity";
import { usePermission } from "~/lib/hooks/usePermission";

// Update the Recording interface to match the actual return types
interface RecordingStatus {
  canRecord: boolean;
  isRecording: boolean;
  isDoneRecording: boolean;
  durationMillis: number;
  metering?: number;
}

interface Recording {
  stopAndUnloadAsync: () => Promise<RecordingStatus>;
  getURI: () => string | null;
}

const BAR_COUNT = 30;
const BAR_WIDTH = 4;
const BAR_GAP = 2;

// Create simple bar visualization component to avoid hook rules violations
function AudioVisualizer({
  isRecording,
  barCount = BAR_COUNT,
  barWidth = BAR_WIDTH,
  barGap = BAR_GAP,
}: {
  isRecording: boolean;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
}) {
  // Generate static bars for visualization
  const { colorScheme } = useColorScheme();
  const recordingLiveColor = colorScheme === "dark" ? "#E54D2E" : "#E54D2E";
  const recordingStoppedColor = colorScheme === "dark" ? "#6F6D66" : "#8D8D86";

  return (
    <View className="mb-5 h-[60px] w-full flex-row items-end justify-center rounded-lg p-2.5">
      {Array(barCount)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={{
              width: barWidth,
              height: Math.max(5, Math.random() * 30), // Simple random height
              marginHorizontal: barGap / 2,
              borderRadius: 2,
              backgroundColor: isRecording
                ? recordingLiveColor
                : recordingStoppedColor,
            }}
          />
        ))}
    </View>
  );
}

export default function AudioRecorderComponent() {
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isGranted, requestPermission } = usePermission("audio");

  // Refresh audio bars
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isRecording) {
      // Refresh visualization bars every 100ms
      const visualizerTimer = setInterval(() => {
        setRefreshKey((prev) => prev + 1);
      }, 100);

      return () => {
        clearInterval(visualizerTimer);
      };
    }
  }, [isRecording]);

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request permissions if not already granted
      if (!isGranted) {
        const granted = await requestPermission();
        if (!granted) {
          console.error("Audio recording permission not granted");
          return;
        }
      }

      try {
        // Configure audio mode for recording
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Create and start recording
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const { recording: newRecording } = await Audio.Recording.createAsync(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        );

        if (newRecording) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setRecording(newRecording);
          setIsRecording(true);
          setRecordingDuration(0);

          // Start timer for duration
          timerRef.current = setInterval(() => {
            setRecordingDuration((prev) => prev + 1);
          }, 1000);
        } else {
          console.error("Recording object is invalid");
        }
      } catch (error) {
        console.error("Failed to create recording", error);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);

      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      try {
        // Stop recording
        await recording.stopAndUnloadAsync();

        // Get recording info
        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);
      } catch (error) {
        console.error("Failed to stop recording", error);
      }

      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className="w-full items-center rounded-xl bg-gray-100 p-5 shadow">
      <AudioVisualizer key={refreshKey} isRecording={isRecording} />

      <Text className="mb-5 text-2xl font-bold text-gray-800">
        {formatDuration(recordingDuration)}
      </Text>

      <View className="flex-row justify-center">
        <TouchableOpacity
          className={`min-w-[120px] flex-row items-center justify-center rounded-full px-6 py-3 ${isRecording ? "bg-red-500" : "bg-blue-500"}`}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <FontAwesome
            name={isRecording ? "stop-circle" : "microphone"}
            size={24}
            color="white"
          />
          <Text className="ml-2 font-bold text-white">
            {isRecording ? "Stop" : "Record"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
