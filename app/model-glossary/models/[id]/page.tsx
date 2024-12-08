import { models } from '@/lib/models';
import ModelDetails from '@/components/features/model-glossary/ModelDetails';

export function generateStaticParams() {
  return models.map((model) => ({
    id: model.id,
  }));
}

export default function ModelPage({ params }: { params: { id: string } }) {
  const model = models.find((m) => m.id === params.id);
  return <ModelDetails model={model} />;
}