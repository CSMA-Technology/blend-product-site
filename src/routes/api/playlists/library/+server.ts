import { readPath } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { filterAttributes } from '$lib/utils';

export const GET = (async (request) => {
  const attributes = request.url.searchParams.get('attributes')?.split(',') ?? [];
  const playlists = (await readPath<Database.Playlists.Library>('/playlists/library')) || {};
  const playlistArray = Object.values(playlists).map((playlist) => ({
    ...playlist,
    words: playlist.words?.map((word) => word.map((letters) => (letters === false ? null : letters))) ?? [],
  }));
  const filteredPlaylists = filterAttributes(attributes, playlistArray);
  return json(filteredPlaylists.some((playlist: Database.Playlist) => Object.keys(playlist).length > 0) ? filteredPlaylists : playlistArray);
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET']],
  });
}) satisfies RequestHandler;
