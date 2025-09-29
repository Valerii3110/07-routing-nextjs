'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NoteTag } from '@/types/note';
import css from './SidebarNotes.module.css';

const SidebarNotes = () => {
  const pathname = usePathname();
  const noteTags = Object.values(NoteTag);

  const isActive = (tag: string) => {
    return pathname === `/notes/filter/${tag}`;
  };

  return (
    <aside className={css.sidebar}>
      <h2 className={css.title}>Filter by Tags</h2>
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link
            href="/notes/filter/All"
            className={`${css.menuLink} ${isActive('All') ? css.active : ''}`}
          >
            All notes
          </Link>
        </li>

        {noteTags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={`/notes/filter/${tag}`}
              className={`${css.menuLink} ${isActive(tag) ? css.active : ''}`}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarNotes;
