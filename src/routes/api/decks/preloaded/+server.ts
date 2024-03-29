import { getOrganizationDecks, getUserData, getUserOrganizations, readPath, weaklyAuthenticate } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (request) => {
  const user = await weaklyAuthenticate(request);
  const decks = (await readPath<Database.Decks.Preloaded>('/decks/preloaded')) || {};
  const deckArray = Object.entries(decks).map(([key, val]) => val);
  return json(deckArray, {
    headers: [['Access-Control-Allow-Origin', '*']],
  });
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [
      ['Access-Control-Allow-Origin', '*'],
      ['Access-Control-Allow-Headers', '*'],
      ['Access-Control-Allow-Methods', 'GET'],
    ],
  });
}) satisfies RequestHandler;
