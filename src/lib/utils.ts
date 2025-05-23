import { browser } from '$app/environment';
import { PUBLIC_APP_URL } from '$env/static/public';
import { readable, writable } from 'svelte/store';
import { customLoginToken } from './firebase';

export function isEmbeddedBrowser() {
  if (!browser) return false;
  // @ts-expect-error
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isFacebookEmbedded = /FBAN|FBAV|FB_IAB|FBIOS|FBSS/i.test(userAgent);

  return isFacebookEmbedded;
}

/**
 * Use this to ensure that you get the environment-appropriate URL for the app. Also appends the login token if the user is logged in.
 */
export const appUrl = readable<string>(PUBLIC_APP_URL, (set) => {
  customLoginToken.subscribe((token) => {
    if (token) {
      set(`${PUBLIC_APP_URL}?loginToken=${token}`);
    } else {
      set(PUBLIC_APP_URL);
    }
  });
});

/** Used to ensure that any link to an upgrade includes the partner ID if it is set */
export const upgradeUrl = readable<string>('/account?action=upgrade', (set) => {
  partnerData.subscribe((partnerData) => {
    if (partnerData?.id) {
      set(`/account?action=upgrade&partnerId=${partnerData.id}`);
    } else {
      set('/account?action=upgrade');
    }
  });
});

/**
 * Used to store the public info of an affiliate partner.
 * If this is set at the time a checkout session is created, the partner's terms will be applied to that checkout.
 */
export const partnerData = writable<{ id: string; displayName: string } | null>(null);

export const filterAttributes = (attributes: string[], input: object | object[]) => {
  const filter = (obj: object) => Object.fromEntries(Object.entries(obj).filter(([key]) => attributes.includes(key)));
  return Array.isArray(input) ? input.map(filter) : filter(input);
};

export const transformPlaylistWordsForClient = (words: (string | false)[][]): (string | null)[][] =>
  words.map((word) => word.map((letter) => (letter === false ? null : letter)));

export const transformPlaylistWordsForDatabase = (words: (string | null)[][]): (string | false)[][] =>
  words.map((word) => word.map((letter) => (letter === null ? false : letter)));

/**
 * Transforms images for use with data files, where the images will ultimately be fed into enhanced image components.
 * @param images - The result of `import.meta.glob`
 * @returns An object where the key is the file name, sans extension, and the value is the file object.
 */
export const transformImages = (images: { [key: string]: ImageFile }) =>
  Object.keys(images).reduce<{ [key: string]: ImageFile }>((acc, key) => {
    const name = key.split('/').pop()?.split('.')[0];
    if (!name) return acc;
    return { ...acc, [name]: images[key] };
  }, {});
