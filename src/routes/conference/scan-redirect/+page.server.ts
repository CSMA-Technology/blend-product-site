import { redirect } from '@sveltejs/kit';

const elevate2025Redirect = 'http://blendreading.com/account?action=upgrade&subscriptionType=yearly&promoCode=ELEVATE25&skipTrial';

export const load = async () => {
  throw redirect(302, elevate2025Redirect);
};
