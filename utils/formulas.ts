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
/**
 * @formula ((revenue - cost) / revenue) * 100
 */
const calcProfitMargin = (data: { revenue: number; cost: number }) => {
  const { revenue, cost } = data
  return revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0
}

export { calcGrowth, calcProfitMargin }
