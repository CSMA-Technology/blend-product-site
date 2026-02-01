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

/**
 * Jump Scene Link Generation
 * Utility functions for generating jump scene links for the Blend app
 */

const SCENE_PLAY_DECK = 'res://Scenes/Play/PlayDeck.tscn';
const SCENE_PLAY_PLAYLIST = 'res://Scenes/Play/Playlist/PlayPlaylist.tscn';
const SCENE_PLAY_WORD_MAT = 'res://Scenes/Play/WordMat/PlayWordMat.tscn';

export type ResourceSourceType = 'preloaded' | 'library';
export type AccessLevel = 'public' | 'pro';

/**
 * Generate a jump scene link for a deck
 * @param deckId - The ID of the deck to load
 * @param appUrl - The base URL of the Blend app
 * @param skipTutorial - Whether to skip the tutorial prompt (default: true)
 * @returns The complete jump scene URL
 */
export function generateDeckJumpLink(deckId: string, appUrl: string, skipTutorial = true): string {
  const encodedScene = encodeURIComponent(SCENE_PLAY_DECK);
  const context = JSON.stringify({ deckId, skip_tutorial: skipTutorial });
  const encodedContext = encodeURIComponent(context);

  return `${appUrl}?jumpScene=${encodedScene}&context=${encodedContext}`;
}

/**
 * Generate a jump scene link for a playlist
 * @param playlistId - The ID of the playlist to load
 * @param appUrl - The base URL of the Blend app
 * @returns The complete jump scene URL
 */
export function generatePlaylistJumpLink(playlistId: string, appUrl: string): string {
  const encodedScene = encodeURIComponent(SCENE_PLAY_PLAYLIST);
  const context = JSON.stringify({ playlistId });
  const encodedContext = encodeURIComponent(context);

  return `${appUrl}?jumpScene=${encodedScene}&context=${encodedContext}`;
}

/**
 * Generate a jump scene link for a word mat
 * @param wordMatId - The ID of the word mat to load
 * @param appUrl - The base URL of the Blend app
 * @returns The complete jump scene URL
 */
export function generateWordMatJumpLink(wordMatId: string, appUrl: string): string {
  const encodedScene = encodeURIComponent(SCENE_PLAY_WORD_MAT);
  const context = JSON.stringify({ wordMatId });
  const encodedContext = encodeURIComponent(context);

  return `${appUrl}?jumpScene=${encodedScene}&context=${encodedContext}`;
}

/** Hardcoded word mats available in the app */
export const WORD_MATS = [
  { id: '1234', name: 'A-Z Tiles' },
  { id: '4321', name: 'Advanced Sounds' },
  { id: '1423', name: 'Phonemes Only' },
] as const;
