import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import {
  getStripeCustomerWithSubscriptions,
  getBlendProSubscription,
  getCustomerPortalSession,
  createStripeSession,
  isSubscribedToBlendPro,
  isOrganizationMember,
} from '$lib/server/subscriptionUtils';
import { checkSessionAuth, getUserData, getUserOrganizations, isUserGlobalAdmin, readPath, writePath } from '$lib/server/firebaseUtils';

let email = '';
let name = '';
let uid = '';

export const load = (async ({  url, cookies }) => {
  const actionParam = url.searchParams.get('action') ?? '';
  uid = (await checkSessionAuth(cookies, {
    loginRedirect: `account?${url.searchParams}`,
    // authFunction: ({ uid: tokenUid }) => tokenUid === uid,
  })).uid;

  const userData = await getUserData(uid);
  email = userData.email!;
  name = userData.displayName ?? 'Blend User';
  const isGlobalAdmin = isUserGlobalAdmin(uid);
  const organizations = getUserOrganizations(uid).then((orgIds) => {
    return Promise.all(
      (orgIds || []).map(async (orgId: string) => {
        const organization = await readPath<Database.Organization>(`/organizations/${orgId}`);
        return {  
          id: orgId,
          name: organization?.public.name,
          role: (await isGlobalAdmin) ? 'admin' : organization?.private?.members?.[uid]?.role,
        };
      }),
    );
  });
  const customer = await getStripeCustomerWithSubscriptions(uid);

  // Redirect to Stripe Checkout if necessary
  if(!isSubscribedToBlendPro(customer) && !(await isOrganizationMember(uid))) {
    switch (actionParam) {
      case 'upgrade': {
        const stripeSession = await createStripeSession(uid, email, name, url.origin);
        throw redirect(303, stripeSession.url!);
      }
      default: {
        break;
      }
    }
  }

  if (!customer || customer.deleted) {
    return {
      isSubscribedToBlendPro: false,
      hasOrganizationMembership: (await organizations).length > 0,
      subscriptionPeriodEnd: 0,
      subscriptionPendingCancellation: false,
      organizations: JSON.stringify(await organizations),
    };
  }
  const subscription = getBlendProSubscription(customer);

  return {
    isSubscribedToBlendPro: !!subscription,
    hasOrganizationMembership: (await organizations).length > 0,
    subscriptionPeriodEnd: subscription?.current_period_end ?? 0,
    subscriptionPendingCancellation: subscription?.cancel_at_period_end,
    organizations: JSON.stringify(await organizations),
  };

}) satisfies PageServerLoad;

export const actions = {
  createSubscriptionOrder: async ({ url: { origin } }) => {
    console.log(origin);
    const stripeSession = await createStripeSession(uid, email, name, origin);
    throw redirect(303, stripeSession.url!);
  },
  redirectToCustomerPortal: async ({ url }) => {
    console.log(`Redirecting to customer billing portal for user ${uid}`);
    const customer = await getStripeCustomerWithSubscriptions(uid);
    if (!customer || customer.deleted) {
      console.error(`Stripe customer for ${uid} does not exist or is deleted. Aborting.`);
      throw error(400, `Stripe customer for ${uid} does not exist`);
    }
    const session = await getCustomerPortalSession(customer, url.href.replace(url.search, ''));
    throw redirect(303, session.url);
  },
  leaveOrganization: async ({ request }) => {
    const data = await request.formData();
    const orgId = data.get('orgId');
    const organization = await readPath<Database.Organization>(`/organizations/${orgId}`);
    if (!organization) throw error(404);
    const user = await readPath<Database.User>(`/users/${uid}`);
    await writePath(`/users/${uid}/protected/organizations`, user?.protected.organizations?.filter((id) => id !== orgId));
    const orgMembers = organization.private?.members || {};
    await writePath(`/organizations/${orgId}/private/members`, {
      ...orgMembers,
      [uid]: null,
    });
  },
} satisfies Actions;
