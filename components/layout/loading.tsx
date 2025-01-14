import { AnimatedLogoSvg } from "@/components/svg"

const Loading = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-24 sm:w-32">
        <AnimatedLogoSvg />
      </div>
    </div>
  )
}

export { Loading }
