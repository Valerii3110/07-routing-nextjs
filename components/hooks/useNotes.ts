import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, updateNote, deleteNote } from '@/lib/api';
import { NoteTag } from '@/types/note';

export const useCreateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content?: string; tag: NoteTag }) =>
      createNote({
        title: data.title,
        content: data.content || '', // content завжди рядок
        tag: data.tag,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
};

export const useUpdateNote = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; content?: string; tag?: NoteTag }) =>
      updateNote(id, {
        ...data,
        content: data.content || '',
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
