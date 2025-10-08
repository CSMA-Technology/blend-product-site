import { redirect } from '@sveltejs/kit';

const conferenceRedirect = 'http://blendreading.com/account?action=upgrade&subscriptionType=yearly&promoCode=TRL2025&skipTrial';

export const load = async () => {
  throw redirect(302, conferenceRedirect);
};
