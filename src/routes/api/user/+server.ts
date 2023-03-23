import { authenticate, getUserData } from '$lib/server/firebaseUtils';
import { getBlendProSubscription, getStripeCustomerWithSubscriptions } from '$lib/server/subscriptionUtils';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
    const { uid } = await authenticate(event);
    const [stripeCustomer, firebaseUserData] = await Promise.all([getStripeCustomerWithSubscriptions(uid), getUserData(uid)])
    const subscriptionData = stripeCustomer && !stripeCustomer.deleted && getBlendProSubscription(stripeCustomer);
    const userData = {
        ...firebaseUserData,
        isSubscibedToBlendPro: !!subscriptionData,
        subscriptionPeriodEnd: subscriptionData ? subscriptionData.current_period_end : 0
    }
    return new Response(JSON.stringify(userData, null, 2));
}) satisfies RequestHandler;