import React from "react";

import { Text } from "~/components/ui/text";
import { LogStepWrapper } from "./LogStepWrapper";

export const ActivitiesStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Activities Log" onBack={onBack}>
    <Text>Activities logging content goes here</Text>
    {/* Add your activities logging UI here */}
  </LogStepWrapper>
);

export const EnergyStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Energy Log" onBack={onBack}>
    <Text>Energy logging content goes here</Text>
    {/* Add your energy logging UI here */}
  </LogStepWrapper>
);

export const SleepStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Sleep Log" onBack={onBack}>
    <Text>Sleep logging content goes here</Text>
    {/* Add your sleep logging UI here */}
  </LogStepWrapper>
);
