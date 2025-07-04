import EditPitPage from "./EditPitPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditPitPage id={id} />;
}
