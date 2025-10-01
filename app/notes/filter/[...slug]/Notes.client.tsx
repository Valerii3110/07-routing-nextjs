'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { NoteTag } from '@/types/note';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';

interface NotesClientProps {
  initialTag: string;
}

export default function NotesClient({ initialTag }: NotesClientProps) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Скидаємо на першу сторінку при зміні пошуку
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Визначаємо тег для API: приводимо рядок до NoteTag або undefined
  const apiTag: NoteTag | undefined =
    initialTag === 'All'
      ? undefined
      : Object.values(NoteTag).includes(initialTag as NoteTag)
        ? (initialTag as NoteTag)
        : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, apiTag, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        tag: apiTag,
        search: debouncedSearch.trim() === '' ? undefined : debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={setSearch} />
        {data && Math.ceil(data.total / data.perPage) > 1 && (
          <Pagination
            page={page}
            pageCount={Math.ceil(data.total / data.perPage)}
            onChangePage={setPage}
          />
        )}

        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes</p>}
        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        {data && data.notes.length === 0 && <p>No notes found.</p>}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onSuccess={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
