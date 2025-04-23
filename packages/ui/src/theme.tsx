"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { ThemeProvider, useTheme } from "next-themes";

import { Button } from "./button";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <MoonIcon className="size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      {/* <span className="sr-only">Toggle theme</span> */}
    </Button>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
    //       {theme === "light" ? (
    //         <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       ) : (
    //         <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       )}
    //       {/* <span className="sr-only">Toggle theme</span> */}
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="start" >
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}

export { ThemeProvider, ThemeToggle };
