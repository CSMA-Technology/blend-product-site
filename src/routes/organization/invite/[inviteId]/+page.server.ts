import { checkSessionAuth, deletePath, pushPath, readPath, writePath } from '$lib/server/firebaseUtils.js';
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
  if (!invite) throw error(404, 'This link is expired or invalid.');

  const publicOrgDetails = await readPath<Database.Organization.Public>(`/organizations/${invite.orgId}/public`);
  if (!publicOrgDetails) throw error(404);

  return { organizationName: publicOrgDetails.name };
}) satisfies PageServerLoad;

export const actions: Actions = {
  accept: async (event) => {
    const { params: { inviteId }, request } = event;
    const invite = await readPath<Database.Invite>(`/invites/organization/${inviteId}`);
    if (!invite) throw error(404);
    const uid = (await request.formData()).get('uid');

    // Add the user as a member in the organization
    await writePath(`/organizations/${invite.orgId}/private/members/${uid}/role`, "member");

    // Delete the invite under the organization
    const thisOrgInvites = (await readPath<Database.Organization.Private['invites']>(`/organizations/${invite.orgId}/private/invites`) ?? []);
    await writePath(`/organizations/${invite.orgId}/private/invites`, thisOrgInvites.filter((id) => id !== inviteId));

    // Update the user's entry with the organization
    const existingOrgs = (await readPath<Database.User.Protected['organizations']>(`/users/${uid}/protected/organizations`) ?? []);
    await writePath(`/users/${uid}/protected/organizations`, Array.from((new Set(existingOrgs)).add(invite.orgId)));

    // Delete the invite entry
    deletePath(`/invites/organization/${inviteId}`);

    throw redirect(303, '/organization/invite/accepted')
  },
  decline: async (event) => {
    const { params: { inviteId } } = event;
    const invite = await readPath<Database.Invite>(`/invites/organization/${inviteId}`);
    if (!invite) throw error(404);

    // Delete the invite under the organization
    const thisOrgInvites = (await readPath<Database.Organization.Private['invites']>(`/organizations/${invite.orgId}/private/invites`) ?? []);
    await writePath(`/organizations/${invite.orgId}/private/invites`, thisOrgInvites.filter((id) => id !== inviteId));
    
    // Delete the invite entry
    deletePath(`/invites/organization/${inviteId}`);

    throw redirect(303, '/organization/invite/declined');
  }
}