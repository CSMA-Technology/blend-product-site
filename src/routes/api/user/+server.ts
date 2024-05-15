import {
  authenticate,
  checkClientCacheValidity,
  getOrganizationInfo,
  getUserData,
  getUserOrganizations,
  setLastModifiedTimeIfNull,
} from '$lib/server/firebaseUtils';
import {
  getBlendProSubscription,
  getStripeCustomerWithSubscriptions,
  isOrganizationMember,
  isSubscribedToBlendPro,
} from '$lib/server/subscriptionUtils';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const startTime = Date.now();
  const { uid } = await authenticate(event);
  const authenticateTime = Date.now();
  console.log(`Authenticated in ${authenticateTime - startTime}ms`);
  const ifModifiedHeader = event.request.headers.get('If-Modified-Since');
  if (ifModifiedHeader) {
    const isCachedVersionValid = await checkClientCacheValidity(uid, ifModifiedHeader);
    console.log(`Checked cache validity in ${Date.now() - authenticateTime}ms`);
    if (isCachedVersionValid) {
      return new Response(null, {
        status: 304,
        headers: [['Access-Control-Allow-Origin', '*']],
      });
    }
    // If the cached version is not valid, there is a chance that is because the last modified time was not set.
    // We make a best effort to set the last modified time here, but we don't wait for it to complete.
    setLastModifiedTimeIfNull(uid);
  }
  const [stripeCustomer, firebaseUserData] = await Promise.all([getStripeCustomerWithSubscriptions(uid), getUserData(uid)]);
  const userDataTime = Date.now();
  console.log(`Got user data in ${userDataTime - authenticateTime}ms`);
  const subscriptionData = stripeCustomer && !stripeCustomer.deleted && getBlendProSubscription(stripeCustomer);
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
    isSubscribedToBlendPro: (await isOrganizationMember(uid)) || isSubscribedToBlendPro(stripeCustomer),
    subscriptionPeriodEnd: subscriptionData ? subscriptionData.current_period_end : 0,
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
