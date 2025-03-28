import React from "react";

import { Text } from "~/components/ui/text";
import { LogStepWrapper } from "./LogStepWrapper";

export const SymptomsStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Symptoms Log" onBack={onBack}>
    <Text>Symptoms logging content goes here</Text>
    {/* Add your symptoms logging UI here */}
  </LogStepWrapper>
);

export const BloodStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Blood Log" onBack={onBack}>
    <Text>Blood logging content goes here</Text>
    {/* Add your blood logging UI here */}
  </LogStepWrapper>
);

export const BodyStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Body Log" onBack={onBack}>
    <Text>Body logging content goes here</Text>
    {/* Add your body logging UI here */}
  </LogStepWrapper>
);
