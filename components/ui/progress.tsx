"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: ProgressPrimitive.Root.Props & { className?: string }) {
  return (
    <ProgressPrimitive.Root value={value} className="w-full" {...props}>
      <ProgressPrimitive.Track
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className,
        )}
      >
        <ProgressPrimitive.Indicator className="h-full bg-green-500 transition-all" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
