
import * as React from "react"
import { cn } from "@/lib/utils"

const AestheticCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'glass' | 'gradient'
    hover?: boolean
  }
>(({ className, variant = 'default', hover = true, ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-sm",
    elevated: "bg-white border-0 shadow-lg hover:shadow-xl",
    glass: "bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variants[variant],
        hover && "hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      {...props}
    />
  )
})
AestheticCard.displayName = "AestheticCard"

export { AestheticCard }
