'use client';

import css from './NotePreview.module.css';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleNote } from '@/lib/api';
import Loader from '@/app/loading';
import Modal from '@/components/Modal/Modal';

const NotePreview = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const close = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchSingleNote(id!),
    refetchOnMount: false,
    enabled: !!id,
  });

  if (isLoading) return <Loader />;

  if (error || !note) return <p>Something went wrong.</p>;

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <Modal onClose={close}>
      <button onClick={close} className={css.backBtn} type="button">
        ← Go Back
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>

          {/* Виправлено для масиву тегів */}
          {note.tags && note.tags.length > 0 && (
            <div className={css.tags}>
              {note.tags.map((tag: string) => (
                <span key={tag} className={css.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className={css.date}>{formattedDate}</p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreview;
