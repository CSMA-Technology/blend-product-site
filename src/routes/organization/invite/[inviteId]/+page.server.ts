import { checkSessionAuth, deletePath, readPath, writePath } from '$lib/server/firebaseUtils.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';
import firebaseAdmin from 'firebase-admin';
import firebaseAdminCredential, { databaseURL } from "$lib/server/firebaseAdminCredential";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseAdminCredential),
    databaseURL
  });
}

export const load = (async ({ cookies, params: { inviteId }, url }) => {
  // If user is not logged in, redirect to login
  await checkSessionAuth(cookies, {
    loginRedirect: url.pathname,
  });

  const invite = await readPath<Database.Invite>(`/invites/organization/${inviteId}`);
  if (!invite) throw error(404);

  const publicOrgDetails = await readPath<Database.Organization.Public>(`/organizations/${invite.orgId}/public`);
  if (!publicOrgDetails) throw error(404);

  return { organizationName: publicOrgDetails.name };
}) satisfies PageServerLoad;

export const actions: Actions = {
  accept: async (event) => {
    const { params: { inviteId }, request } = event;
    const invite = await readPath(`/invites/organization/${inviteId}`);
    const uid = (await request.formData()).get('uid');

    // Update the status of the pending invitee to member in the organization members
    await writePath(`/organizations/${invite.orgId}/private/members/${uid}/role`, "member");

    // Delete the entry in the members array if it was a temporary ID
    deletePath(`/organizations/${invite.orgId}/private/members/${inviteId}`);

    // Delete the invite entry
    deletePath(`/invites/organization/${inviteId}`);

    throw redirect(303, '/organization/invite/accepted')
  },
  decline: async (event) => {
    const { params: { inviteId } } = event;

    // Delete the invite entry
    deletePath(`/invites/organization/${inviteId}`);
    throw redirect(303, '/organization/invite/declined');
  }
}