import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import { getQueryClient } from '../../../../lib/getQueryClient';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const resolvedParams = await params;
  const queryClient = getQueryClient();

  // Отримуємо тег з параметрів маршруту
  const tag = resolvedParams.slug?.[0] || 'All';

  // Для "All" не передаємо жодного тегу, для інших - передаємо конкретний тег
  const apiTag = tag === 'All' ? undefined : tag;

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, apiTag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag: apiTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
