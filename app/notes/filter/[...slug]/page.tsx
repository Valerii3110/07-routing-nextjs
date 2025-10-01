import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import { getQueryClient } from '../../../../lib/getQueryClient';
import { NoteTag } from '../../../../types/note';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const resolvedParams = await params;
  const queryClient = getQueryClient();

  const tagParam = resolvedParams.slug?.[0] || 'All';

  // Конвертація рядка у NoteTag або undefined
  const apiTag: NoteTag | undefined =
    tagParam === 'All'
      ? undefined
      : (Object.values(NoteTag).find((t) => t === tagParam) as NoteTag | undefined);

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, apiTag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag: apiTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tagParam} />
    </HydrationBoundary>
  );
}
