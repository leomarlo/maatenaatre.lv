import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (!session.isAdmin) {
    redirect('/');
  }

  return <AdminClient />;
}
