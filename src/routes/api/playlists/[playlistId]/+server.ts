import { getUserOrganizationIds, readPath, weaklyAuthenticate } from '$lib/server/firebaseUtils';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { transformPlaylistWordsForClient } from '$lib/utils';

export const GET: RequestHandler = async (request) => {
  const { playlistId } = request.params;

  // Check preloaded playlists first (public, no auth required)
  let playlist = await readPath<Database.Playlist>(`/playlists/preloaded/${playlistId}`);

  // Check library playlists (public, no auth required)
  if (!playlist) {
    playlist = await readPath<Database.Playlist>(`/playlists/library/${playlistId}`);
  }

  // Check user-specific and org-specific playlists (requires auth)
  if (!playlist) {
    const user = await weaklyAuthenticate(request);
    if (user) {
      // Check user playlists
      playlist = await readPath<Database.Playlist>(`/playlists/user/${user.uid}/${playlistId}`);

      // Check shared playlists
      if (!playlist) {
        playlist = await readPath<Database.Playlist>(`/playlists/shared/${playlistId}/playlist`);
      }

      // Check organization playlists
      if (!playlist) {
        const organizationIds = await getUserOrganizationIds(user.uid);
        const orgPlaylists = await Promise.all(
          organizationIds.map((orgId) =>
            readPath<Database.Playlist>(`/playlists/organization/${orgId}/${playlistId}/playlist`)
          )
        );
        playlist = orgPlaylists.find((playlist) => playlist) ?? null;
      }
    }
  }

  if (!playlist) throw error(404);

  return json({
    ...playlist,
    words: transformPlaylistWordsForClient(playlist.words ?? []) 
  });
};

export const OPTIONS: RequestHandler = () => {
  return new Response(null, {
    headers: [['Access-Control-Allow-Methods', 'GET']],
  });
};
