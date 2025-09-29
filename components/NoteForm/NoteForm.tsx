'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createNote } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be less than 50 characters'),
  content: Yup.string()
    .max(500, 'Content must be less than 500 characters')
    .required('Content is required'), // Зробити обов'язковим
  tags: Yup.array()
    .of(Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as NoteTag[]))
    .min(1, 'At least one tag is required')
    .required('Tags are required'),
});

const initialValues = {
  title: '',
  content: '', // Завжди рядок, не undefined
  tags: ['Personal'] as NoteTag[],
};

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    mutation.mutate({
      title: values.title,
      content: values.content, // Тепер content завжди рядок
      tags: values.tags,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title *</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content *</label>
            <Field as="textarea" id="content" name="content" className={css.textarea} rows={4} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label>Tags *</label>
            <div className={css.tags}>
              {(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as NoteTag[]).map((tag) => (
                <label key={tag} className={css.tagLabel}>
                  <input
                    type="checkbox"
                    checked={values.tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFieldValue('tags', [...values.tags, tag]);
                      } else {
                        setFieldValue(
                          'tags',
                          values.tags.filter((t) => t !== tag),
                        );
                      }
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
            <ErrorMessage name="tags" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={css.cancelButton}
              disabled={isSubmitting || mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
