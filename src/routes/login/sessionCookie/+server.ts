import { auth } from '$lib/server/firebaseUtils';

export const POST = async ({ request, cookies }) => {
  const { idToken } = await request.json();
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 5 * 1000 });
  cookies.set('session', sessionCookie, { httpOnly: true, sameSite: 'lax', maxAge: 99999999, path: '/' });
  return new Response();
}

export const DELETE = async ({ cookies }) => {
  cookies.delete('session', { path: '/' });
  return new Response();
}