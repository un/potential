import type { TrackableConfigWithMeta } from "@1up/templates";

import { CheckboxInput } from "./CheckboxInput";
import { MeasureInput } from "./MeasureInput";
import { NoteInput } from "./NoteInput";
import { RangeInput } from "./RangeInput";
import { RatingInput } from "./RatingInput";

interface ConfigInputsProps {
  config: TrackableConfigWithMeta;
  onChange: (config: TrackableConfigWithMeta) => void;
}

export function ConfigInputs({ config, onChange }: ConfigInputsProps) {
  switch (config.type) {
    case "measure":
      return <MeasureInput config={config} onChange={onChange} />;
    case "checkbox":
      return <CheckboxInput config={config} onChange={onChange} />;
    case "range":
      return <RangeInput config={config} onChange={onChange} />;
    case "rating":
      return <RatingInput config={config} onChange={onChange} />;
    case "note":
      return <NoteInput config={config} onChange={onChange} />;
    default:
      return null;
  }
}
