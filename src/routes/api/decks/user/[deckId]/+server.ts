import { authenticate, deletePath, getUserData, readPath, writePath } from '$lib/server/firebaseUtils';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const { deckId } = event.params;
  const { uid } = await authenticate(event);
  const deck = await readPath(`/decks/user/${uid}/${deckId}`);
  if (!deck) {
    throw error(404, `No deck exists with refId ${deckId}`);
  }
  return json(deck);
}) satisfies RequestHandler;

export const POST = (async (event) => {
  const { deckId } = event.params;
  const { uid } = await authenticate(event);
  const deckData = await event.request.json();
  await writePath(`/decks/user/${uid}/${deckId}`, deckData);
  return json(deckData, {
    status: 201,
  });
}) satisfies RequestHandler;

export const PUT = (async (event) => {
  const { deckId } = event.params;
  const { uid } = await authenticate(event);
  const deckData = await event.request.json();
  const path = `/decks/user/${uid}/${deckId}`;
  const existingDeck = (await readPath(path)) as Object | null;
  if (!existingDeck) {
    throw error(404, `No deck exists with refId ${deckId}`);
  }
  const newDeck = {
    ...existingDeck,
    ...deckData,
  };
  await writePath(path, newDeck);
  return json(newDeck);
}) satisfies RequestHandler;

export const DELETE = (async (event) => {
  const { deckId } = event.params;
  const { uid } = await authenticate(event);
  const path = `/decks/user/${uid}/${deckId}`;
  const existingDeck = (await readPath(path)) as Object | null;
  if (!existingDeck) {
    throw error(404, `No deck exists with refId ${deckId}`);
  }
  await deletePath(path);
  return json(existingDeck);
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE']],
  });
}) satisfies RequestHandler;
