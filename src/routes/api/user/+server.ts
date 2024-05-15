import { authenticate, getOrganizationInfo, getUserData, getUserOrganizations } from '$lib/server/firebaseUtils';
import { isOrganizationMember, isStripeCustomerSubscribedToBlendPro, isSubscribedToBlendPro } from '$lib/server/subscriptionUtils';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const startTime = Date.now();
  const { uid } = await authenticate(event);
  const authenticateTime = Date.now();
  console.log(`Authenticated in ${authenticateTime - startTime}ms`);
  const [firebaseUserData, isProSubscriber] = await Promise.all([getUserData(uid), isSubscribedToBlendPro(uid)]);
  const userDataTime = Date.now();
  console.log(`Got user data in ${userDataTime - authenticateTime}ms`);
  const userOrganizations = await getUserOrganizations(uid);
  const organizationInfo = await Promise.all(
    userOrganizations.map(async (orgId) => {
      const orgInfo = await getOrganizationInfo(orgId);
      return {
        orgName: orgInfo?.name,
        orgId,
      };
    }),
  );
  const orgInfoTime = Date.now();
  console.log(`Got organization info in ${orgInfoTime - userDataTime}ms`);
  const userData = {
    ...firebaseUserData,
    isSubscribedToBlendPro: isProSubscriber || (await isOrganizationMember(uid)),
    organizationInfo,
  };
  console.log(`Validated Pro membership in ${Date.now() - orgInfoTime}ms`);
  console.log(`Total time: ${Date.now() - startTime}ms`);
  return new Response(JSON.stringify(userData, null, 2));
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET']],
  });
}) satisfies RequestHandler;
