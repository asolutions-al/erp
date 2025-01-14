import { AnimatedLogoSvg } from "../svg"

export function PageLoadingSkeleton() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-24 sm:w-32">
        <AnimatedLogoSvg />
      </div>
    </div>
  )
}
