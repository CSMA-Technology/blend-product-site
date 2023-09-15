import { checkSessionAuth, getUserData, readPath, writePath } from '$lib/server/firebaseUtils.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';

export const load = (async ({ cookies, url }) => {
  // If user is not logged in, redirect to login
  await checkSessionAuth(cookies, {
    loginRedirect: url.pathname,
  });

  return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
  submit: async (event) => {
    const { request } = event;
    const formData = await request.formData();
    const uid = formData.get('uid');
    let userDisplayName = 'Blend User';

    if (uid) {
      userDisplayName = (await getUserData(`${uid}`)).displayName ?? 'Blend User';
    }
    formData.append('userDisplayName', userDisplayName);
    
    await event.fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(formData.entries() as any).toString(),
    });

    throw redirect(303, '/help/feedback/success')
  },
}