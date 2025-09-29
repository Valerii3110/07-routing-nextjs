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
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  tag: NoteTag;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tag?: NoteTag;
}
