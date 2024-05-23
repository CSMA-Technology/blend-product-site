import { readPath } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { filterAttributes, transformPlaylistForClient } from '$lib/utils';

let playlistsPromise = readPath<Database.Playlists.Library>('/playlists/library');
const refreshPlaylistsPromise = () => {
  console.log('Refreshing playlists');
  playlistsPromise = readPath<Database.Playlists.Library>('/playlists/library');
};
setInterval(refreshPlaylistsPromise, 30000);

export const GET = (async (request) => {
  const attributes = request.url.searchParams.get('attributes')?.split(',') ?? [];
  console.log('Awaiting playlists');
  const playlists = (await playlistsPromise) || {};
  const playlistArray = Object.values(playlists).map((playlist) => ({
    ...playlist,
    words: transformPlaylistForClient(playlist) ?? [],
  }));
  const filteredPlaylists = filterAttributes(attributes, playlistArray);
  return json(filteredPlaylists.some((playlist: Database.Playlist) => Object.keys(playlist).length > 0) ? filteredPlaylists : playlistArray);
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET']],
  });
}) satisfies RequestHandler;
