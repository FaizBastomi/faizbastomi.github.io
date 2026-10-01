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

// redirect() throws a digest-tagged error that must reach Next intact, so it is rethrown
// instead of being shown to the user as a form error.
export default function SubmitForm({ action, submit, children, className = '' }) {
  const [error, formAction] = useActionState(async (_prev, formData) => {
    try {
      await action(formData);
      return null;
    } catch (e) {
      if (typeof e?.digest === 'string' && e.digest.startsWith('NEXT_REDIRECT')) throw e;
      return e?.message || 'Something went wrong';
    }
  }, null);

  return (
    <form action={formAction} className={className}>
      {children}
      <button className="mt-2 cursor-pointer rounded bg-[#89b4fa] px-3 py-1 text-sm font-semibold text-[#1e1e2e]">
        {submit}
      </button>
      {error && <p className="mt-2 text-sm text-[#f38ba8]">{error}</p>}
    </form>
  );
}
