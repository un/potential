import { cn } from "../../lib/utils";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div
      className={cn(
        "text-sand-11 text-md w-full overflow-hidden whitespace-nowrap font-mono font-medium",
        className,
      )}
    >
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    </div>
  );
}
