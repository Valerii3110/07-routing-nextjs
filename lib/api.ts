import axios from 'axios';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token ?? ''}`,
    'Content-Type': 'application/json',
  },
});

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  tag,
  search,
}: {
  page?: number;
  perPage?: number;
  tag?: string;
  search?: string;
} = {}) => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      perPage: perPage.toString(),
    };

    // Додаємо tag тільки якщо він переданий
    if (tag) {
      params.tag = tag;
    }

    // Додаємо search тільки якщо він переданий і не пустий
    if (search && search.trim() !== '') {
      params.search = search;
    }

    const response = await api.get('/notes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Додаємо функцію для отримання однієї нотатки
export const fetchSingleNote = async (id: string) => {
  try {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching note ${id}:`, error);
    throw error;
  }
};

export { fetchSingleNote as fetchNoteById } from './api';

// Інші API функції (createNote, updateNote, deleteNote тощо)
export const createNote = async (noteData: { title: string; content: string; tags: string[] }) => {
  try {
    const response = await api.post('/notes', noteData);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (
  id: string,
  noteData: {
    title?: string;
    content?: string;
    tags?: string[];
  },
) => {
  try {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
