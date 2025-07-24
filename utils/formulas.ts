/**
 * @formula ((current - previous) / previous) * 100
 */
const calcGrowth = ({
  current,
  previous,
}: {
  current: number
  previous: number
}): GrowthT => {
  const diff = current - previous
  // Avoid division by zero
  const diffPercent = (diff / (previous || 1)) * 100
  return {
    diff,
    diffPercent,
    status: diffPercent === 0 ? "equal" : diffPercent > 0 ? "up" : "down",
  }
}

export { calcGrowth }
