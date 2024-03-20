import { auth, checkSessionAuth, isUserGlobalAdmin } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';

export const POST = async (event) => {
  await checkSessionAuth(event.cookies, { authFunction: (decodedToken) => isUserGlobalAdmin(decodedToken.uid) });

  const { uid } = await event.request.json();
  const emulationToken = await auth.createCustomToken(uid);
  return json({ emulationToken }, { status: 201 });
};
