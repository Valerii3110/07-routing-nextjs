import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token ?? ''}`,
    'Content-Type': 'application/json',
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

interface NotesApiResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<NotesApiResponse> = await api.get('/notes', {
    params: { page, perPage, search },
  });

  return {
    notes: res.data.notes ?? [],
    totalPages: res.data.totalPages ?? 1,
    page,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: {
  title: string;
  content?: string;
  tag: NoteTag;
}): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.post('/notes', payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};
