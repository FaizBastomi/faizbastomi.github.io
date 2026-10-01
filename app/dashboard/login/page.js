import { redirect } from 'next/navigation';
import SubmitForm from '@/components/SubmitForm';
import { dashboardPath, isAuthed } from '@/lib/auth';
import { login } from '../actions';

export const metadata = { title: 'Login' };

export default async function LoginPage() {
  if (await isAuthed()) redirect(`/${dashboardPath()}`);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SubmitForm action={login} submit="Login" className="w-full max-w-xs">
        <label className="block">
          <span className="mb-1 block text-xs text-[#858aa0]">Password</span>
          <input
            className="w-full rounded bg-[#313244] px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#89b4fa]"
            name="password"
            type="password"
            autoFocus
          />
        </label>
      </SubmitForm>
    </div>
  );
}
