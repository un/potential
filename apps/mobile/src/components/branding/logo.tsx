import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { View } from "react-native";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/ui";

const logoVariants = cva("flex-1 items-center justify-center", {
  variants: {
    size: {
      tiny: "size-3 max-h-3 min-h-3 min-w-3 max-w-3",
      sm: "size-4 max-h-4 min-h-4 min-w-4 max-w-4",
      md: "size-6 max-h-6 min-h-6 min-w-6 max-w-6",
      lg: "size-9 max-h-9 min-h-9 min-w-9 max-w-9",
      xl: "size-12 max-h-12 min-h-12 min-w-12 max-w-12",
      "2xl": "size-16 max-h-16 min-h-16 min-w-16 max-w-16",
      "3xl": "size-32 max-h-32 min-h-32 min-w-32 max-w-32",
      mega: "size-64 max-h-64 min-h-64 min-w-64 max-w-64",
    },
  },
  defaultVariants: {
    size: "3xl",
  },
});

export const Logo: React.FC<VariantProps<typeof logoVariants>> = ({ size }) => (
  <View className={cn(logoVariants({ size }))}>
    <Svg width="100%" height="100%" viewBox="0 0 1200 1200" fill="none">
      <G clipPath="url(#a)">
        <Path
          fill="#21201C"
          stroke="#F9F9F8"
          strokeWidth={24}
          d="M398.4 12h403.2c81.746 0 146.618 4.395 198.056 15.827 51.304 11.402 88.504 29.642 115.694 56.827 27.18 27.186 45.42 64.388 56.82 115.69C1183.6 251.782 1188 316.654 1188 398.4v403.2c0 81.746-4.4 146.618-15.83 198.056-11.4 51.304-29.64 88.504-56.82 115.694-27.19 27.18-64.39 45.42-115.694 56.82C948.218 1183.6 883.346 1188 801.6 1188H398.4c-81.746 0-146.618-4.4-198.056-15.83-51.302-11.4-88.504-29.64-115.69-56.82-27.185-27.19-45.425-64.39-56.827-115.694C16.395 948.218 12 883.346 12 801.6V398.4c0-81.746 4.395-146.618 15.827-198.056C39.23 149.042 57.47 111.84 84.654 84.654c27.186-27.185 64.388-45.425 115.69-56.827C251.782 16.395 316.654 12 398.4 12Z"
        />
        <G filter="url(#b)">
          <Path
            fill="#DD4425"
            d="M638.181 381.637h-25.453v25.454h-25.455V228.909h25.454v-25.455h25.454v178.183Zm-76.363-178.183h25.454v178.183h-25.454v-25.454h-25.454V178h25.454v25.454Zm101.819 152.729h-25.454V178h50.908v25.454h25.455v25.455H740v50.909h-25.454v25.454h-25.455v25.456h-25.454v25.455Zm-127.274-25.455h-25.455v-25.456h-25.454v-25.454H460v-50.909h25.454v-25.455h25.454V178h25.455v152.728Z"
          />
          <G fill="#fff" filter="url(#c)">
            <Path d="M874.671 894.316c-27.219 0-40.828-18.372-40.828-39.467 0-9.526 2.041-21.775 4.763-30.62L898.487 605.8c1.361-6.124 2.041-11.567 2.041-15.65 0-13.609-6.804-19.733-19.053-19.733-48.313 0-132.69 104.791-159.908 212.984l-25.858 102.75h-54.437l117.04-467.477H697.07l5.444-23.816L824.997 369l-76.892 298.042 5.444 2.041c38.786-70.087 79.613-142.216 145.618-142.216 38.786 0 55.798 23.816 55.798 56.478 0 10.888-2.041 22.455-5.444 34.704l-62.602 232.037 12.248 5.444 78.253-78.253 16.331 12.928-48.312 56.479c-31.982 38.106-51.715 47.632-70.768 47.632ZM207 1022.24l6.805-27.896h48.993l104.11-417.803h-61.241l5.444-23.816 121.802-25.858-34.703 136.092 5.443 2.042c36.745-78.934 72.81-138.134 129.968-138.134 46.272 0 66.686 35.384 66.686 98.667 0 110.915-66.005 268.782-175.559 268.782-36.065 0-56.479-13.609-66.686-46.952h-6.124l-34.023 146.98h62.603l-6.805 27.896H207Zm203.458-162.627c48.313 0 92.543-44.911 114.998-127.927 7.485-28.579 17.692-80.975 17.692-106.152 0-35.384-5.444-55.117-27.219-55.117-61.241 0-130.648 157.867-144.257 204.138l-2.722 9.526c-12.249 43.55 2.041 75.532 41.508 75.532Z" />
          </G>
        </G>
      </G>
      <Path stroke="#000" d="M.5.5h1199v1199H.5z" />
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h1200v1200H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  </View>
);
