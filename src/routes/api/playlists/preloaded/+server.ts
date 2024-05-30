import { readPath } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { transformPlaylistWordsForClient } from '$lib/utils';

export const GET = (async (request) => {
  const playlists = (await readPath<Database.Playlists.Preloaded>('/playlists/preloaded')) || {};
  const playlistArray = Object.values(playlists).map((playlist) => ({
    ...playlist,
    words: transformPlaylistWordsForClient(playlist.words ?? []),
  }));
  return json(playlistArray);
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET']],
  });
}) satisfies RequestHandler;
