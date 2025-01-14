import dayjs from "dayjs"

export const DateCell = ({ date }: { date: string }) => {
  const formattedDate = dayjs(date).format("DD/MM/YYYY:HH:mm")
  return <span>{formattedDate}</span>
}
