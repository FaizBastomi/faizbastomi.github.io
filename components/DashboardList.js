'use client';

import { Children, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faGripVertical } from '@fortawesome/free-solid-svg-icons';

const move = (list, from, to) => {
  const next = [...list];
  const [id] = next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
};

// localStorage throws in private browsing mode; a collapsed section must not take the page down.
const stored = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export default function DashboardList({ title, ids, reorder, storageKey, children, footer }) {
  const cards = Children.toArray(children);
  const slot = new Map(ids.map((id, i) => [id, cards[i]]));
  const [order, setOrder] = useState(ids);
  const [source, setSource] = useState(ids);
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  // Re-sync when the server sends a fresh order (after a revalidate), without clobbering the
  // optimistic order a drag has already put on screen.
  if (ids !== source) {
    setSource(ids);
    setOrder(ids);
  }

  // ready gates the body so a section stored collapsed never paints its contents first.
  useEffect(() => {
    setOpen(stored(storageKey, '1') !== '0');
    setReady(true);
  }, [storageKey]);

  const persist = async (next, prev) => {
    setOrder(next);
    try {
      await reorder(next.join(','));
    } catch {
      setOrder(prev);
    }
  };

  const nudge = (from, delta) => {
    const to = from + delta;
    if (to < 0 || to >= order.length) return;
    persist(move(order, from, to), order);
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(storageKey, next ? '1' : '0');
    } catch {
      /* nothing to persist to */
    }
  };

  return (
    <div className="mb-10">
      <button type="button" aria-expanded={open} onClick={toggle} className="flex cursor-pointer items-center gap-2">
        <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} className="text-sm" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </button>

      {ready && open && (
        <>
          <ul className="mt-3 space-y-3">
            {order.map((id, index) => (
              <li
                key={id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (over !== id) setOver(id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = order.indexOf(dragging);
                  const to = order.indexOf(id);
                  setDragging(null);
                  setOver(null);
                  if (from < 0 || to < 0 || from === to) return;
                  persist(move(order, from, to), order);
                }}
                className={`flex items-start gap-2 ${over === id && dragging !== id ? 'rounded-lg ring-1 ring-[#89b4fa]' : ''}`}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', id);
                    setDragging(id);
                  }}
                  onDragEnd={() => {
                    setDragging(null);
                    setOver(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      nudge(index, -1);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      nudge(index, 1);
                    }
                  }}
                  aria-label={`Move item ${index + 1} of ${order.length}, arrow keys`}
                  className={`mt-2 cursor-grab rounded p-1 text-[#858aa0] hover:text-[#89b4fa] ${dragging === id ? 'opacity-40' : ''}`}
                >
                  <FontAwesomeIcon icon={faGripVertical} />
                </button>
                <div className="flex-1">{slot.get(id)}</div>
              </li>
            ))}
          </ul>
          {footer}
        </>
      )}
    </div>
  );
}
