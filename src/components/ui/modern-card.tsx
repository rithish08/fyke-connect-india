
import * as React from "react"
import { cn } from "@/lib/utils"

const ModernCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'selection' | 'active'
    hover?: boolean
  }
>(({ className, variant = 'default', hover = true, ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-sm",
    elevated: "bg-white border-0 shadow-lg",
    selection: "bg-white border-2 border-gray-200 shadow-md hover:border-blue-400",
    active: "bg-blue-50 border-2 border-blue-500 shadow-md"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      {...props}
    />
  )
})
ModernCard.displayName = "ModernCard"

export { ModernCard }
