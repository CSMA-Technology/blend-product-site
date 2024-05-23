import { readPath } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transformPlaylistForClient } from '$lib/utils';

export const GET = (async (request) => {
  const playlists = (await readPath<Database.Playlists.Preloaded>('/playlists/preloaded')) || {};
  const playlistArray = Object.values(playlists).map((playlist) => ({
    ...playlist,
    words: transformPlaylistForClient(playlist) ?? [],
  }));
  return json(playlistArray, { headers: [['Cache-Control', 'must-revalidate, max-age=3600, stale-while-revalidate=604800']] });
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET']],
  });
}) satisfies RequestHandler;
