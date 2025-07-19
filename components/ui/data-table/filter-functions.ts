import { FilterFn } from "@tanstack/react-table"

const numberRangeFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value || !Array.isArray(value)) return true
  const [min, max] = value
  if (min === 0 && max === 0) return true

  const cellValue = row.getValue(columnId)
  if (cellValue == null) return false

  const numValue = Number(cellValue)
  if (isNaN(numValue)) return false

  if (min > 0 && max > 0) {
    return numValue >= min && numValue <= max
  } else if (min > 0) {
    return numValue >= min
  } else if (max > 0) {
    return numValue <= max
  }

  return true
}

const dateRangeFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value || !Array.isArray(value)) return true
  const [from, to] = value
  if (!from && !to) return true

  const cellValue = row.getValue(columnId)
  if (cellValue == null) return false

  const cellDate = new Date(String(cellValue))
  if (isNaN(cellDate.getTime())) return false

  if (from && to) {
    return cellDate >= from && cellDate <= to
  } else if (from) {
    return cellDate >= from
  } else if (to) {
    return cellDate <= to
  }

  return true
}

export { dateRangeFilter, numberRangeFilter }
