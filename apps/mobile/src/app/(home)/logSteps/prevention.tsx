import React from "react";

import { Text } from "~/components/ui/text";
import { LogStepWrapper } from "./LogStepWrapper";

export const SupplementsStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Supplements Log" onBack={onBack}>
    <Text>Supplements logging content goes here</Text>
    {/* Add your supplements logging UI here */}
  </LogStepWrapper>
);

export const CyclesStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Cycles Log" onBack={onBack}>
    <Text>Cycles logging content goes here</Text>
    {/* Add your cycles logging UI here */}
  </LogStepWrapper>
);

export const MindStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Mind Log" onBack={onBack}>
    <Text>Mind logging content goes here</Text>
    {/* Add your mind logging UI here */}
  </LogStepWrapper>
);
