import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types.js';
import consonantsAndShortVowels from '$lib/data/library/playlists/consonantsAndShortVowels';
import consonantDigraphs from '$lib/data/library/playlists/consonantDigraphs';
import silentE from '$lib/data/library/playlists/silentE';
import suffixes from '$lib/data/library/playlists/suffixes';
import rControlledVowels from '$lib/data/library/playlists/rControlledVowels';
import vowelTeams from '$lib/data/library/playlists/vowelTeams';
import diphthongs from '$lib/data/library/playlists/diphthongs';
import morphology from '$lib/data/library/playlists/morphology';

export const load = (({ params }) => {
  const playlists: BlendLibrary.Item[] = [
    ...consonantsAndShortVowels.items,
    ...consonantDigraphs.items,
    ...silentE.items,
    ...suffixes.items,
    ...rControlledVowels.items,
    ...vowelTeams.items,
    ...diphthongs.items,
    ...morphology.items,
  ];
  const playlist: BlendLibrary.Item | undefined = playlists.find((playlist) => playlist.id === params.playlistSlug);
  if (playlist) {
    return {
      playlist,
    };
  }

  throw error(404, 'Not found');
}) satisfies PageLoad;
