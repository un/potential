import { View } from "react-native";

import type { TrackableConfigWithMeta } from "@1up/templates";

import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Text } from "~/components/ui/text";

interface MeasureInputProps {
  config: TrackableConfigWithMeta & { type: "measure" };
  onChange: (config: TrackableConfigWithMeta) => void;
}

export function MeasureInput({ config, onChange }: MeasureInputProps) {
  return (
    <View className="gap-4">
      <View>
        <Text className="mb-1 text-sm text-gray-600">Unit</Text>
        <Input
          value={config.measureUnit}
          onChangeText={(text) => onChange({ ...config, measureUnit: text })}
          className="rounded-lg border border-gray-200 p-2"
        />
      </View>

      <View>
        <Text className="mb-1 text-sm text-gray-600">
          Range ({config.measureMin} - {config.measureMax})
        </Text>
        <View className="px-2">
          <Slider
            minimumValue={config.measureMin}
            maximumValue={config.measureMax}
            value={config.measureTarget ?? config.measureMin}
            onValueChange={(value) =>
              onChange({ ...config, measureTarget: value })
            }
          />
        </View>
      </View>

      <View>
        <Text className="mb-1 text-sm text-gray-600">Target (Optional)</Text>
        <Input
          value={config.measureTarget?.toString()}
          onChangeText={(text) =>
            onChange({ ...config, measureTarget: Number(text) || null })
          }
          keyboardType="numeric"
          className="rounded-lg border border-gray-200 p-2"
        />
      </View>
    </View>
  );
}
