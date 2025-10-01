import axios from 'axios';
import { Note, NoteTag, CreateNoteData, UpdateNoteData } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token ?? ''}`,
    'Content-Type': 'application/json',
  },
});

interface ApiNote {
  id: string;
  title: string;
  content?: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

const mapNote = (apiNote: ApiNote): Note => ({
  ...apiNote,
  tag: apiNote.tag as NoteTag,
  content: apiNote.content ?? '',
});

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  tag,
  search,
}: {
  page?: number;
  perPage?: number;
  tag?: NoteTag;
  search?: string;
} = {}): Promise<{ notes: Note[]; total: number; page: number; perPage: number }> => {
  const params: Record<string, string> = {
    page: page.toString(),
    perPage: perPage.toString(),
  };

  if (tag) params.tag = tag;
  if (search?.trim()) params.search = search;

  const response = await api.get<{
    notes: ApiNote[];
    total: number;
    page: number;
    perPage: number;
  }>('/notes', { params });
  return {
    ...response.data,
    notes: response.data.notes.map(mapNote),
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<ApiNote>(`/notes/${id}`);
  return mapNote(response.data);
};

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post<ApiNote>('/notes', noteData);
  return mapNote(response.data);
};

export const updateNote = async (id: string, noteData: UpdateNoteData): Promise<Note> => {
  const response = await api.patch<ApiNote>(`/notes/${id}`, noteData);
  return mapNote(response.data);
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<ApiNote>(`/notes/${id}`);
  return mapNote(response.data);
};
