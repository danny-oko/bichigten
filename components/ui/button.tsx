import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap shadow-sm transition-[transform,box-shadow] duration-150 ease-out outline-none select-none hover:-translate-y-0.5 active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.975] active:not-aria-[haspopup]:shadow-none active:not-aria-[haspopup]:duration-75 disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        sortbutton:
          "h-auto min-h-0 gap-0 rounded-full border-3 px-5 py-2 font-balsamiq font-bold shadow-none transition hover:translate-y-0 hover:shadow-none active:translate-y-0 active:scale-100 border-[#ead9bb] bg-transparent text-[#3b2f2f] hover:border-[#e8920a] hover:text-[#c97806] focus-visible:border-[#e8920a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8920a] focus-visible:ring-offset-2 aria-pressed:border-[#e8920a] aria-pressed:bg-[#e8920a] aria-pressed:text-white aria-pressed:shadow-[0_10px_24px_rgba(232,146,10,0.25)] aria-pressed:hover:bg-[#c97806] dark:border-[#37464f] dark:not-aria-pressed:bg-transparent dark:text-[#94a3b8] dark:hover:border-[#84d8ff] dark:hover:bg-[#84d8ff]/15 dark:hover:text-white dark:focus-visible:border-[#84d8ff] dark:focus-visible:ring-[#84d8ff] dark:aria-pressed:border-[#84d8ff] dark:aria-pressed:bg-[#84d8ff]/15 dark:aria-pressed:text-white dark:aria-pressed:shadow-none dark:aria-pressed:hover:border-[#84d8ff] dark:aria-pressed:hover:bg-[#84d8ff]/15 dark:aria-pressed:hover:text-white",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        sort: "h-auto min-h-0 gap-1.5 rounded-full px-5 py-2 text-sm [&_svg:not([class*='size-'])]:size-3",
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
