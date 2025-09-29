import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, updateNote, deleteNote } from '@/lib/api';

export const useCreateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content?: string; tags: string[] }) =>
      createNote({
        title: data.title,
        content: data.content || '', // Забезпечуємо, що content завжди рядок
        tags: data.tags,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
};

// Або зробити content обов'язковим
export const useCreateNoteStrict = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string; tags: string[] }) => createNote(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
};

export const useUpdateNote = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; content?: string; tags?: string[] }) =>
      updateNote(id, {
        ...data,
        content: data.content || '', // Забезпечуємо, що content завжди рядок
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] });
      qc.invalidateQueries({ queryKey: ['note', id] });
    },
  });
};

export const useDeleteNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
};
