type Props = {
  params: Promise<{ unitId: string }>
}

const Page = async ({ params }: Props) => {
  const { unitId } = await params
  console.log("unitId", unitId)
  return <div>Product List</div>
}

export default Page
