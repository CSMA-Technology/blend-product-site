import { readPath } from '$lib/server/firebaseUtils';
import type { RequestHandler } from './$types';

export const GET = (async () => {
    const decks = await readPath('/decks/preloaded');
    return new Response(JSON.stringify(decks));
}) satisfies RequestHandler;