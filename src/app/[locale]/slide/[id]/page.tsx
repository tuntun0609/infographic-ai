export default async function SlideIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <div>slide {id}</div>
}
