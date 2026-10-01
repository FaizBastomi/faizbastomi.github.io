'use client';

import { useActionState } from 'react';

const input = 'w-full rounded bg-[#313244] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#89b4fa]';

export function Field({ name, label, type = 'text', defaultValue, className = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs text-[#858aa0]">{label}</span>
      <input className={input} name={name} type={type} defaultValue={defaultValue ?? ''} {...rest} />
    </label>
  );
}

// The action returns { error } for validation, so the message survives the trip. redirect()'s
// digest-tagged throw must reach Next intact; any other throw is replaced, since production
// strips its message.
export default function SubmitForm({ action, submit, children, className = '' }) {
  const [error, formAction] = useActionState(async (prev, formData) => {
    try {
      return (await action(formData))?.error ?? null;
    } catch (e) {
      if (typeof e?.digest === 'string' && e.digest.startsWith('NEXT_REDIRECT')) throw e;
      return 'Something went wrong. Please try again.';
    }
  }, null);

  return (
    <form action={formAction} className={className}>
      {children}
      <button className="mt-2 cursor-pointer rounded bg-[#89b4fa] px-3 py-1 text-sm font-semibold text-[#1e1e2e]">
        {submit}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-[#f38ba8]">
          {error}
        </p>
      )}
    </form>
  );
}
