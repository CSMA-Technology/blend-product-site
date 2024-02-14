import { authenticate, getOrganizationDecks, getOrganizationInfo, getUserOrganizations, readPath } from '$lib/server/firebaseUtils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
  const { uid } = await authenticate(event);
  const viewParam = event.url.searchParams.get('view');
  const orgIdParam = event.url.searchParams.get('orgId');
  if (orgIdParam && !viewParam) return new Response('If orgId is provided, view must be set to org', {status: 400, headers: [['Access-Control-Allow-Origin', '*']]});
  switch (viewParam) {
    case 'user': {
      const userDecks = (await readPath<Database.Decks.User>(`/decks/user/${uid}`)) || {};
      const deckArray = Object.entries(userDecks).map(([key, val]) => val);
      return json(deckArray, {
        headers: [['Access-Control-Allow-Origin', '*']],
      });
    }
    case 'org': {
      const organizationIds = await getUserOrganizations(uid);
      if (orgIdParam) {
        if (!organizationIds.includes(orgIdParam)) return new Response('User is not a member of this organization', {status: 403, headers: [['Access-Control-Allow-Origin', '*']]});
        const orgDecks = (await getOrganizationDecks(orgIdParam)) ?? {};
        const organizationInfo = await getOrganizationInfo(orgIdParam);
        const deckArray = Object.values(orgDecks).map(({ deck }) => ({
          ...deck,
          orgSource: {
            orgName: organizationInfo?.name,
            orgId: orgIdParam,
          },
        
        }));
        return json(deckArray, {
          headers: [['Access-Control-Allow-Origin', '*']],
        });
      } else {
        const organizationDeckArray = (
          await Promise.all(
            organizationIds.map(async (orgId) => {
              const decks = (await getOrganizationDecks(orgId)) ?? {};
              const orgInfo = await getOrganizationInfo(orgId);
              return Object.values(decks).map(({ deck }) => ({
                ...deck,
                orgSource: {
                  orgName: orgInfo?.name,
                  orgId,
                },
              }));
            }),
          )
        ).flat();
        return json(organizationDeckArray, {
          headers: [['Access-Control-Allow-Origin', '*']],
        });
      }
    }
    default: {
      const userDecks = (await readPath<Database.Decks.User>(`/decks/user/${uid}`)) || {};
      const userDeckArray = Object.entries(userDecks).map(([key, val]) => val);
      const positionOffset = Math.max(...userDeckArray.map(({ position }) => position), 0) + 2; // +2 because legacy position can be -1, and we want the new position to be strictly greater TODO: refactor this once we get rid of the legacy magic numbers in positioning
      const organizationIds = await getUserOrganizations(uid);
      const organizationDeckArray = (
        await Promise.all(
          organizationIds.map(async (orgId) => {
            const orgDecks = (await getOrganizationDecks(orgId)) ?? {};
            const orgInfo = await getOrganizationInfo(orgId);
            return Object.values(orgDecks).map(({ deck }) => ({
              ...deck,
              position: deck.position + positionOffset,
              orgSource: {
                orgName: orgInfo?.name,
                orgId,
              },
            }));
          }),
        )
      ).flat();

      return json([...userDeckArray, ...organizationDeckArray], {
        headers: [['Access-Control-Allow-Origin', '*']],
      });
    }
  }
}) satisfies RequestHandler;

export const OPTIONS = (() => {
  return new Response(null, {
    headers: [
      ['Access-Control-Allow-Origin', '*'],
      ['Access-Control-Allow-Headers', '*'],
    ],
  });
}) satisfies RequestHandler;
