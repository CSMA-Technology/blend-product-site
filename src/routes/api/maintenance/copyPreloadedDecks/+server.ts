import type { RequestHandler } from './$types';
import { db, readPath, writePath } from '$lib/server/firebaseUtils';

const createDeckCopy = async (deckId: number, userId: string) => {
  // Generate new reference ID
  const newRefId = Math.floor(Math.random() * 4294967295);

  // Fetch linked deck
  const linkedDeck = await readPath<Database.Deck>(`/decks/preloaded/${deckId}`);
  if (linkedDeck) {
    // Create a copy of the linked deck with updated fields
    const timestamp = new Date().toISOString().split('.')[0];
    const deckCopy = { ...linkedDeck };
    deckCopy.created_ts = timestamp;
    deckCopy.modified_ts = timestamp;
    deckCopy.position = -1;
    deckCopy.refId = newRefId;
    deckCopy.is_editable = true;

    // Save the copy to the user's decks
    await writePath(`/decks/user/${userId}/${newRefId}`, deckCopy);
  }
  return newRefId;
};

export const POST: RequestHandler = async (event) => {
  const playlists = (await db.ref('/playlists/user').get()).val();

  const playlistsToChange: { [userId: string]: Database.Playlist[] } = {};
  const usersWithPlaylistsLinked = new Set();

  if (playlists) {
    Object.keys(playlists).forEach((userId) => {
      playlistsToChange[userId] = []; // Initialize counts for each user
      const userPlaylists = playlists[userId];

      Object.keys(userPlaylists).forEach((playlistId) => {
        const playlist = userPlaylists[playlistId] as Database.Playlist;
        if (playlist.linked_deck_id === 113822357 || playlist.linked_deck_id === 541852177) {
          playlistsToChange[userId].push(playlist);
        }
      });
    });
  }

  const allChanges = Object.entries(playlistsToChange)
    .filter(([userId, playlists]) => playlists.length > 0)
    .flatMap(([userId, playlists]) => {
      let newCvcDeckId: number;
      let newBlendsAdvancedVowelsDeckId: number;

      const promises = playlists.map(async (playlist) => {
        const { linked_deck_id } = playlist;
        if (linked_deck_id === 113822357) {
          if (!newBlendsAdvancedVowelsDeckId) {
            newBlendsAdvancedVowelsDeckId = await createDeckCopy(113822357, userId);
            await writePath(`/playlists/user/${userId}/${playlist.refId}/linked_deck_id`, newBlendsAdvancedVowelsDeckId);
          }
        } else if (linked_deck_id === 541852177) {
          if (!newCvcDeckId) {
            newCvcDeckId = await createDeckCopy(541852177, userId);
            await writePath(`/playlists/user/${userId}/${playlist.refId}/linked_deck_id`, newCvcDeckId);
          }
        }
      });
      return promises;
    });
  await Promise.all(allChanges);
  console.log('=====================================');
  console.log(
    '# Users whose libraries were updated with a copy of a preloaded deck: ',
    Object.entries(playlistsToChange).filter(([userId, playlists]) => playlists.length > 0).length,
  );
  return new Response();
};
