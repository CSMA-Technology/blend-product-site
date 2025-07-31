import { checkSessionAuth } from '$lib/server/firebaseUtils';

export const load = async ({ cookies, route: { id } }) => {
  await checkSessionAuth(cookies, {
    loginRedirect: id,
  });
};
