'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import css from './TagsMenu.module.css';
import Link from 'next/link';
import { NoteTag } from '../../types/note';

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const noteTags = Object.values(NoteTag);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuButton}>
        Notes ▾
      </button>
      {isOpen && (
        <ul ref={menuRef} className={css.menuList}>
          <li className={css.menuItem}>
            <Link className={css.menuLink} href={`/notes/filter/All`} onClick={toggle}>
              All notes
            </Link>
          </li>
          {noteTags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link className={css.menuLink} href={`/notes/filter/${tag}`} onClick={toggle}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
