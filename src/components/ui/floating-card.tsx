
import * as React from "react"
import { cn } from "@/lib/utils"

const FloatingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glow' | 'gradient' | 'elevated' | 'minimal'
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const variants = {
    default: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl",
    glow: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl shadow-blue-500/10",
    gradient: "bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm border border-white/30 shadow-xl",
    elevated: "bg-white border border-gray-100 shadow-lg",
    minimal: "bg-white border border-gray-100 shadow-sm"
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
        "transition-all duration-300",
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
