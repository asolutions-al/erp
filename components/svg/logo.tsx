export function AnimatedLogoSvg() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20,180 L100,20 L150,140 L95,140"
        stroke="black"
        strokeWidth="40"
        fill="none"
        strokeDasharray="600"
        strokeDashoffset="600"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="600"
          to="0"
          dur="1s"
          fill="freeze"
          repeatCount="indefinite"
        />
      </path>

      <path
        d="m 150 200 l -15 -30 l 50 0 l 15 30 h -50 "
        fill="#2e6f40"
        opacity="0"
      >
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.5s"
          begin="0.5s"
          fill="freeze"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}
