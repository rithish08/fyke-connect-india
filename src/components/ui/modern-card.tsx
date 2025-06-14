
import * as React from "react"
import { cn } from "@/lib/utils"

const ModernCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glass' | 'elevated' | 'profile'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-sm",
    glass: "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg",
    elevated: "bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300",
    profile: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
ModernCard.displayName = "ModernCard"

const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
ModernCardHeader.displayName = "ModernCardHeader"

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
ModernCardContent.displayName = "ModernCardContent"

export { ModernCard, ModernCardHeader, ModernCardContent }
