import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-2xl border border-foreground/5 bg-background/50 px-5 py-2 text-base text-foreground transition-all duration-300 outline-none placeholder:text-muted-foreground/60 focus-visible:bg-card focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 disabled:opacity-50 md:text-sm font-bold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export { Input }
