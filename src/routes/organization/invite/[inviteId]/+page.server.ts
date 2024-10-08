import { checkSessionAuth, deleteOrganizationInvites, deletePath, pushPath, readPath, writePath } from '$lib/server/firebaseUtils.js';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';
import { isProUser } from '$lib/server/subscriptionUtils';

export const load = (async ({ cookies, params: { inviteId }, url }) => {
  // If user is not logged in, redirect to login
  const uid = (
    await checkSessionAuth(cookies, {
      loginRedirect: `${url.pathname}?action=acceptInvite`, // This action is not handled right now, but its presence will prevent the plan selection page from being shown
    })
  ).uid;

  const invite = await readPath<Database.Invite.Organization>(`/invites/organization/${inviteId}`);
  if (!invite) throw error(404, 'This link is expired or invalid.');

  const publicOrgDetails = await readPath<Database.Organization.Public>(`/organizations/${invite.orgId}/public`);
  if (!publicOrgDetails) throw error(404);

  const lockedOrgDetails = await readPath<Database.Organization.Locked>(`/organizations/${invite.orgId}/locked`);

  const isPro = await isProUser(uid);

  return { organizationName: publicOrgDetails.name, isOrganizationLicensed: lockedOrgDetails?.isLicensed ?? false, isPro };
}) satisfies PageServerLoad;

export const actions: Actions = {
  accept: async (event) => {
    const {
      params: { inviteId },
      request,
    } = event;
    const invite = await readPath<Database.Invite.Organization>(`/invites/organization/${inviteId}`);
    if (!invite) throw error(404);
    const organization = await readPath<Database.Organization>(`/organizations/${invite.orgId}`);
    if (!organization) throw error(404);
    const uid = (await request.formData()).get('uid');

    // Add the user as a member in the organization
    await writePath(`/organizations/${invite.orgId}/private/members/${uid}/role`, 'member');

    // Update the user's entry with the organization
    const existingOrgs = (await readPath<Database.User.Protected['organizations']>(`/users/${uid}/protected/organizations`)) ?? [];
    await writePath(`/users/${uid}/protected/organizations`, Array.from(new Set(existingOrgs).add(invite.orgId)));

    await deleteOrganizationInvites([inviteId], invite.orgId, organization);

    throw redirect(303, '/organization/invite/accepted');
  },
  decline: async (event) => {
    const {
      params: { inviteId },
    } = event;
    const invite = await readPath<Database.Invite.Organization>(`/invites/organization/${inviteId}`);
    if (!invite) throw error(404);
    const organization = await readPath<Database.Organization>(`/organizations/${invite.orgId}`);
    if (!organization) throw error(404);
    await deleteOrganizationInvites([inviteId], invite.orgId, organization);

    throw redirect(303, '/organization/invite/declined');
  },
};
