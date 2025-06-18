
import * as React from "react"
import { cn } from "@/lib/utils"

const FloatingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'glow' | 'minimal'
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const variants = {
    default: "bg-white/95 backdrop-blur-md border border-white/20 shadow-xl",
    elevated: "bg-white shadow-2xl border-0 hover:shadow-3xl",
    glow: "bg-white/90 backdrop-blur-sm shadow-2xl border border-blue-100/50 ring-1 ring-blue-500/10",
    minimal: "bg-white/80 backdrop-blur-lg border border-gray-100/50 shadow-lg"
  }

  const sizes = {
    sm: "p-4 rounded-xl",
    md: "p-6 rounded-2xl",
    lg: "p-8 rounded-3xl"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
FloatingCard.displayName = "FloatingCard"

export { FloatingCard }
