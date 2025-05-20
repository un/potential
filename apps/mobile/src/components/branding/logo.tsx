import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={1200}
    height={1200}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#21201C"
        stroke="#F9F9F8"
        strokeWidth={24}
        d="M12 398.4c0-81.747 4.396-146.618 15.828-198.056 11.401-51.303 29.641-88.504 56.826-115.69 27.186-27.185 64.387-45.425 115.69-56.826C251.782 16.396 316.653 12 398.4 12h403.2c81.747 0 146.618 4.396 198.056 15.828 51.304 11.401 88.504 29.641 115.694 56.826 27.18 27.186 45.42 64.387 56.82 115.69C1183.6 251.782 1188 316.653 1188 398.4v403.2c0 81.747-4.4 146.618-15.83 198.056-11.4 51.304-29.64 88.504-56.82 115.694-27.19 27.18-64.39 45.42-115.694 56.82C948.218 1183.6 883.347 1188 801.6 1188H398.4c-81.747 0-146.618-4.4-198.056-15.83-51.303-11.4-88.504-29.64-115.69-56.82-27.185-27.19-45.425-64.39-56.826-115.694C16.396 948.218 12 883.347 12 801.6V398.4Z"
      />
      <G fillRule="evenodd" clipRule="evenodd" filter="url(#b)">
        <Path
          fill="#DD4425"
          d="M438 199h96v48h48v48h48v-48h48v-48h96v48h48v48h48v96h-48v48h-48v48h-48v48h-48v48h-48v48h-48v-48h-48v-48h-48v-48h-48v-48h-48v-48h-48v-96h48v-48h48v-48Z"
        />
        <Path
          fill="#F9F9F8"
          d="M336 616h-48v48h-48v48h48v192h-96v48h240v-48h-96V616ZM528 712h-48v192h48v48h192V712h-48v192H528V712ZM816 712h-48v288h48v-96h144v-48h48v-96h-48v-48h-96v48h-48v-48Zm48 48h96v96H816v-48h48v-48Z"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h1200v1200H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
