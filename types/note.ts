export enum NoteTag {
  Todo = 'Todo',
  Work = 'Work',
  Personal = 'Personal',
  Meeting = 'Meeting',
  Shopping = 'Shopping',
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  tag: NoteTag; // суворий enum
  createdAt: string;
  updatedAt: string;
}

// DTO для створення
export type CreateNoteData = Pick<Note, 'title' | 'content' | 'tag'>;

// DTO для оновлення
export type UpdateNoteData = Partial<CreateNoteData>;
