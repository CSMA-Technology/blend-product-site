import { checkSessionAuth, deletePath, readPath, writePath } from '$lib/server/firebaseUtils.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import firebaseAdmin from 'firebase-admin';
import firebaseAdminCredential, { databaseURL } from "$lib/server/firebaseAdminCredential";
if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseAdminCredential),
        databaseURL
    });
}

export const load = (async ({ cookies, params: { inviteId }, url }) => {
  const invite = await readPath(`/invites/organization/${inviteId}`);
  const organizationName: Database.Organization.Public = await readPath(`/organizations/${invite.orgId}/public/name`);

  if (!invite) throw error(404);
  await checkSessionAuth(cookies, {
    loginRedirect: url.pathname,
  });

  return { organizationName };
}) satisfies PageServerLoad;

export const actions: Actions = {
  accept: async (event) => {
    const { params: { inviteId }, request } = event;
    const invite = await readPath(`/invites/organization/${inviteId}`);
    const uid = (await request.formData()).get('uid');

    // Update the status of the pending invitee to member in the organization members
    await writePath(`/organizations/${invite.orgId}/private/members/${uid}/role`, "member");

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