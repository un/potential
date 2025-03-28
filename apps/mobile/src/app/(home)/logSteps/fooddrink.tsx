import React from "react";

import AudioRecorderComponent from "~/components/app/audioRecorder";
import { CameraComponent } from "~/components/app/camera";
import { Text } from "~/components/ui/text";
import { LogStepWrapper } from "./LogStepWrapper";

// Step components for each button
export const PhotoStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Photo Log" onBack={onBack} zeroPadding noSafeArea>
    <CameraComponent />
    {/* Add your photo logging UI here */}
  </LogStepWrapper>
);

// Create similar components for each step
export const AudioStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Audio Log" onBack={onBack}>
    <Text>Audio logging content goes here</Text>
    <AudioRecorderComponent />
  </LogStepWrapper>
);

// Add new text step
export const TextStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Text Log" onBack={onBack}>
    <Text>Text logging content goes here</Text>
    {/* Add your text logging UI here */}
  </LogStepWrapper>
);

// Add scan step
export const ScanStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Scan Log" onBack={onBack}>
    <Text>Scan logging content goes here</Text>
    {/* Add your scan logging UI here */}
  </LogStepWrapper>
);

// Add search step
export const SearchStep = ({ onBack }: { onBack: () => void }) => (
  <LogStepWrapper title="Search Food" onBack={onBack}>
    <Text>Food search content goes here</Text>
    {/* Add your food search UI here */}
  </LogStepWrapper>
);
