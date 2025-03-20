import configureMeasurements from "convert-units";
import length from "convert-units/definitions/length";
import mass from "convert-units/definitions/mass";
import volume from "convert-units/definitions/volume";

/*
  `configureMeasurements` is a closure that accepts a directory
  of measures and returns a factory function (`convert`) that uses
  only those measures.
*/

/*
convert(1).from('l').to('ml');
convert(1).from('lb').to('kg');
convert(1).from('oz').to('g');
*/
export const convert = configureMeasurements({
  volume,
  // @ts-expect-error beta version type issues - check in or after beta 8
  mass,
  // @ts-expect-error beta version type issues - check in or after beta 8
  length,
});
