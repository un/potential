import React from "react";
import { View } from "react-native";

import { Text } from "~/components/ui/text";
import { Card } from "../ui/card";

export function ExperimentsDemo() {
  // Get all tracker parent types

  const experiments = [
    { name: "Vo2MAX", step1: 100, step2: 33, step3: 0 },
    { name: "Experiment 2", step1: 78, step2: 0, step3: 0 },
    { name: "Experiment 3", step1: 100, step2: 100, step3: 64 },
  ];

  return (
    <View className="flex-1 flex-col gap-2">
      <Text className="text-2xl" type={"title"}>
        Experiments
      </Text>
      <Card>
        {experiments.map((experiment) => (
          <ExperimentDetails key={experiment.name} {...experiment} />
        ))}
      </Card>
    </View>
  );
}

function ExperimentDetails({
  name,
  step1,
  step2,
  step3,
}: {
  name: string;
  step1: number;
  step2: number;
  step3: number;
}) {
  const step1bar1Width = step1;
  const step1bar2Width = 100 - step1;

  const step2bar1Width = step2;
  const step2bar2Width = 100 - step2;

  const step3bar1Width = step3;
  const step3bar2Width = 100 - step3;

  return (
    <View className={"flex flex-row items-center justify-between gap-2 py-2"}>
      <Text className="">{name}</Text>

      <View className={"flex w-[100px] flex-row gap-1"}>
        <View className={"flex w-[30px] flex-col items-center gap-0"}>
          <View className={"flex flex-row items-center gap-0"}>
            <View
              className="bg-tomato-10 h-1 rounded-bl-full rounded-tl-full"
              style={{ width: `${step1bar1Width}%` }}
            />
            <View
              className="bg-sand-9 h-1"
              style={{ width: `${step1bar2Width}%` }}
            />
          </View>
        </View>
        <View className={"flex w-[30px] flex-col items-center gap-0"}>
          <View className={"flex flex-row items-center gap-0"}>
            <View
              className="bg-tomato-10 h-1"
              style={{ width: `${step2bar1Width}%` }}
            />
            <View
              className="bg-sand-9 h-1"
              style={{ width: `${step2bar2Width}%` }}
            />
          </View>
        </View>
        <View className={"flex w-[30px] flex-col items-center gap-0"}>
          <View className={"flex flex-row items-center gap-0"}>
            <View
              className="bg-tomato-10 h-1"
              style={{ width: `${step3bar1Width}%` }}
            />
            <View
              className="bg-sand-9 h-1 rounded-br-full rounded-tr-full"
              style={{ width: `${step3bar2Width}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
