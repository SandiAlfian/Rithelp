import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-black whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-4 focus-visible:ring-primary/10 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:bg-primary/90",
        outline:
          "border-foreground/10 bg-card/30 backdrop-blur-md text-foreground hover:bg-card/60 hover:border-primary/50 hover:text-primary shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-foreground/5 shadow-md shadow-secondary/10",
        ghost:
          "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-premium-gradient text-white hover:opacity-90 shadow-xl shadow-primary/20 border border-white/10"
      },
      size: {
        default: "h-11 px-6 rounded-2xl",
        xs: "h-7 px-3 text-xs rounded-xl",
        sm: "h-9 px-4 text-xs rounded-xl",
        lg: "h-14 px-10 text-base rounded-[1.5rem]",
        icon: "size-11 rounded-2xl",
        "icon-xs": "size-7 rounded-xl",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-14 rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
