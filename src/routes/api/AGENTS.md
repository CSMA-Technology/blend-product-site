# Blend Product Site - API Documentation

**API Base URL:** `/api/`

This directory contains all RESTful API endpoints for the Blend application.

---

## Authentication

All API endpoints use one of two authentication methods:

### 1. Session Cookie (Browser-based)

Used by web pages in the application.

**Flow:**
1. User signs in with Firebase Auth
2. Client calls `POST /api/login/customToken` to get custom token
3. Client calls `POST /api/login/sessionCookie` to create httpOnly cookie
4. Cookie automatically sent with subsequent requests

### 2. Bearer Token (API-based)

Used by the Godot app and external integrations.

**Header:**
```
Authorization: Bearer {firebaseIdToken}
```

**Implementation:**
```typescript
import { authenticate } from '$lib/server/firebaseUtils';

export async function GET({ request }) {
  const user = await authenticate(request);  // Throws 401 if invalid
  // user: { uid, email, ... }
}
```

---

## API Endpoints Reference

### Authentication (`/api/login/`)

#### `POST /api/login/customToken`

Generate a Firebase custom token from an ID token.

**Purpose:** Create custom token for app deep-linking with authentication

**Request:**
```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**
```json
{
  "customToken": "firebase-custom-token"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing or invalid ID token
- `500` - Server error

---

#### `POST /api/login/sessionCookie`

Create a session cookie from an ID token.

**Purpose:** Establish browser session (5-day expiration)

**Request:**
```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**
```json
{
  "success": true
}
```

**Sets Cookie:**
```
session={cookie}; HttpOnly; SameSite=Lax; Max-Age=432000; Path=/
```

**Status Codes:**
- `200` - Success
- `400` - Missing or invalid ID token
- `500` - Server error

---

#### `DELETE /api/login/sessionCookie`

Logout by clearing session cookie.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Always succeeds

---

### User Management (`/api/user`)

#### `GET /api/user`

Get authenticated user data with subscription status.

**Authentication:** Required (Bearer token or session cookie)

**Response:**
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "isSubscribedToBlendPro": true,
  "organizations": ["org-id-1", "org-id-2"],
  "isGlobalAdmin": false
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `500` - Server error

---

### Decks (`/api/decks/`)

#### `GET /api/decks/preloaded`

Get all preloaded (system) decks.

**Authentication:** Optional (public endpoint)

**Response:**
```json
{
  "decks": [
    {
      "deckId": "deck-1",
      "name": "Consonants",
      "refId": 1,
      "position": 0,
      "created_ts": "2024-01-01T00:00:00Z",
      "modified_ts": "2024-01-01T00:00:00Z",
      "is_editable": false,
      "cards": [
        {
          "value": "b",
          "column": 0,
          "row": 0,
          "color": "#FF0000",
          "mergeStatus": "MERGED"
        }
      ]
    }
  ]
}
```

**Caching:** Responses cached for performance

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `GET /api/decks/user`

Get user's personal and organization decks.

**Authentication:** Required

**Query Parameters:**
- `omitOrgDecks` (optional): If "true", exclude organization decks
- `orgId` (optional): Filter to specific organization

**Response:**
```json
{
  "userDecks": [ /* user-owned decks */ ],
  "organizationDecks": [ /* org decks */ ]
}
```

**Authorization:**
- Returns only decks user has access to
- Organization decks require organization membership

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `500` - Server error

---

#### `GET /api/decks/[deckId]`

Get a specific deck by ID.

**Authentication:** Required

**Response:**
```json
{
  "deckId": "deck-1",
  "name": "My Deck",
  "refId": 42,
  "cards": [ /* card data */ ]
}
```

**Authorization:**
- User must own deck OR be in organization that owns deck

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not authorized to access this deck
- `404` - Deck not found
- `500` - Server error

---

#### `POST /api/decks/shared`

Share a deck with a Pro user via email.

**Authentication:** Required (Pro users only)

**Request:**
```json
{
  "deckData": { /* full deck data */ },
  "recipientEmail": "recipient@example.com",
  "senderDisplayName": "John Doe"
}
```

**Response:**
```json
{
  "shareKey": "generated-share-key"
}
```

**Side Effects:**
- Creates share record in database
- Sends email via Listmonk (Template 13)

**Authorization:**
- Sender must be Pro user
- Recipient must exist and be Pro user

**Status Codes:**
- `200` - Success
- `400` - Invalid request or recipient not Pro
- `401` - Not authenticated
- `403` - Not a Pro user
- `500` - Server error

---

#### `GET /api/decks/shared/[sharedDeckId]`

Retrieve a shared deck.

**Authentication:** Required

**Response:**
```json
{
  "deckData": { /* full deck data */ },
  "senderDisplayName": "John Doe"
}
```

**Authorization:**
- Only the recipient can access (verified by email)

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not authorized (not the recipient)
- `404` - Share not found or expired
- `500` - Server error

---

### Playlists (`/api/playlists/`)

#### `GET /api/playlists/preloaded`

Get all preloaded (system) playlists.

**Authentication:** Optional (public endpoint)

**Response:**
```json
{
  "playlists": [
    {
      "playlistId": "playlist-1",
      "name": "CVC Words",
      "linked_deck_id": 1,
      "words": [
        ["c", "a", "t"],
        ["d", "o", "g"]
      ],
      "refId": 1,
      "position": 0
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `GET /api/playlists/library`

Get library (curated) playlists.

**Authentication:** Optional (public endpoint)

**Response:**
```json
{
  "playlists": [ /* library playlists */ ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `GET /api/playlists/user`

Get user's personal playlists.

**Authentication:** Required

**Response:**
```json
{
  "playlists": [ /* user-owned playlists */ ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `500` - Server error

---

#### `GET /api/playlists/user/[playlistId]`

Get a specific user playlist.

**Authentication:** Required

**Response:**
```json
{
  "playlistId": "playlist-1",
  "name": "My Playlist",
  "linked_deck_id": 42,
  "words": [ /* word arrays */ ]
}
```

**Authorization:**
- User must own playlist

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Playlist not found
- `500` - Server error

---

#### `POST /api/playlists/user/[playlistId]`

Create a new playlist (or update if exists).

**Authentication:** Required

**Request:**
```json
{
  "name": "My New Playlist",
  "linked_deck_id": 42,
  "words": [
    ["c", "a", "t"],
    ["d", "o", "g"]
  ]
}
```

**Response:**
```json
{
  "success": true,
  "playlistId": "playlist-1"
}
```

**Authorization:**
- Pro users: unlimited playlists
- Basic users: 1 playlist limit

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request data
- `401` - Not authenticated
- `403` - Playlist limit reached (Basic users)
- `500` - Server error

---

#### `PUT /api/playlists/user/[playlistId]`

Update an existing playlist.

**Authentication:** Required

**Request:** Same as POST

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Updated successfully
- `400` - Invalid request data
- `401` - Not authenticated
- `403` - Not authorized to update
- `404` - Playlist not found
- `500` - Server error

---

#### `DELETE /api/playlists/user/[playlistId]`

Delete a playlist.

**Authentication:** Required

**Response:**
```json
{
  "success": true
}
```

**Authorization:**
- User must own playlist

**Status Codes:**
- `200` - Deleted successfully
- `401` - Not authenticated
- `403` - Not authorized to delete
- `404` - Playlist not found
- `500` - Server error

---

#### `POST /api/playlists/shared`

Share a playlist with a Pro user via email.

**Authentication:** Required (Pro users only)

**Request:**
```json
{
  "playlistData": { /* full playlist data */ },
  "recipientEmail": "recipient@example.com",
  "senderDisplayName": "John Doe"
}
```

**Response:**
```json
{
  "shareKey": "generated-share-key"
}
```

**Side Effects:**
- Creates share record in database
- Sends email via Listmonk (Template 16)

**Status Codes:**
- `200` - Success
- `400` - Invalid request or recipient not Pro
- `401` - Not authenticated
- `403` - Not a Pro user
- `500` - Server error

---

#### `GET /api/playlists/shared/[sharedPlaylistId]`

Retrieve a shared playlist.

**Authentication:** Required

**Response:**
```json
{
  "playlistData": { /* full playlist data */ },
  "senderDisplayName": "John Doe"
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not authorized
- `404` - Share not found
- `500` - Server error

---

### Organizations (`/api/organization/`)

#### `POST /api/organization/[organizationId]/invites`

Create and send organization invites.

**Authentication:** Required (Organization admin only)

**Request:**
```json
{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

**Response:**
```json
{
  "success": true,
  "invitesSent": 2
}
```

**Side Effects:**
- Creates invite records
- Sends email invitations

**Authorization:**
- Must be organization admin

**Status Codes:**
- `200` - Success
- `400` - Invalid emails or org at capacity
- `401` - Not authenticated
- `403` - Not organization admin
- `500` - Server error

---

#### `DELETE /api/organization/[organizationId]/invites`

Delete organization invites.

**Authentication:** Required (Organization admin only)

**Request:**
```json
{
  "inviteIds": ["invite-1", "invite-2"]
}
```

**Response:**
```json
{
  "success": true
}
```

**Authorization:**
- Must be organization admin

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not organization admin
- `500` - Server error

---

#### `POST /api/organization/[organizationId]/members`

Add members from invite requests.

**Authentication:** Required (Organization admin only)

**Request:**
```json
{
  "uids": ["uid-1", "uid-2"]
}
```

**Response:**
```json
{
  "success": true,
  "membersAdded": 2
}
```

**Authorization:**
- Must be organization admin
- UIDs must be from pending invite requests

**Status Codes:**
- `200` - Success
- `400` - Invalid UIDs or org at capacity
- `401` - Not authenticated
- `403` - Not organization admin
- `500` - Server error

---

#### `DELETE /api/organization/[organizationId]/members`

Remove members from organization.

**Authentication:** Required (Organization admin only)

**Request:**
```json
{
  "uids": ["uid-1", "uid-2"]
}
```

**Response:**
```json
{
  "success": true
}
```

**Authorization:**
- Must be organization admin
- Cannot remove self if only admin

**Status Codes:**
- `200` - Success
- `400` - Cannot remove last admin
- `401` - Not authenticated
- `403` - Not organization admin
- `500` - Server error

---

### Feature Flags (`/api/flags/`)

#### `GET /api/flags`

Get all feature flags for the current user.

**Authentication:** Optional (returns global flags if not authenticated)

**Response:**
```json
{
  "flags": {
    "newFeatureEnabled": true,
    "betaAccess": false
  }
}
```

**Logic:**
- Returns global flags merged with user-specific flags
- User flags override global flags

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `GET /api/flags/[flagName]`

Get a specific feature flag value.

**Authentication:** Optional

**Response:**
```json
{
  "enabled": true
}
```

**Status Codes:**
- `200` - Success
- `404` - Flag not found
- `500` - Server error

---

### Admin APIs (`/api/admin/`)

**All admin endpoints require global admin privileges.**

#### `POST /api/admin/emulationToken`

Create an emulation token for testing.

**Authentication:** Required (Global admin only)

**Request:**
```json
{
  "uid": "user-id-to-emulate"
}
```

**Response:**
```json
{
  "customToken": "firebase-custom-token"
}
```

**Purpose:** Allow admins to test as specific users

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not global admin
- `500` - Server error

---

#### `GET /api/admin/organization/[organizationId]/userData`

Get organization member metadata.

**Authentication:** Required (Global admin only)

**Response:**
```json
{
  "members": [
    {
      "uid": "user-1",
      "email": "user@example.com",
      "displayName": "John Doe"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not global admin
- `404` - Organization not found
- `500` - Server error

---

#### `GET /api/admin/partners/subscriptionData/[subscriptionId]`

Get partner subscription details.

**Authentication:** Required (Global admin only)

**Response:**
```json
{
  "subscription": {
    "id": "sub_xxx",
    "customerId": "cus_xxx",
    "status": "active",
    "currentPeriodEnd": 1234567890
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not global admin
- `404` - Subscription not found
- `500` - Server error

---

#### `GET /api/admin/userData`

Get global user data (for admin dashboard).

**Authentication:** Required (Global admin only)

**Response:**
```json
{
  "users": [ /* user metadata */ ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not global admin
- `500` - Server error

---

### Maintenance APIs (`/api/maintenance/`)

**Internal use only - no authentication required but should be restricted by Netlify.**

#### `POST /api/maintenance/cleanupAnonymousAccounts`

Delete anonymous Firebase Auth accounts.

**Purpose:** Cleanup orphaned anonymous accounts

**Response:**
```json
{
  "deletedCount": 42
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `POST /api/maintenance/copyPreloadedDecks`

Copy preloaded decks to user accounts.

**Purpose:** Migrate system decks

**Request:**
```json
{
  "sourceScope": "preloaded",
  "targetScope": "user",
  "targetUid": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "copiedCount": 5
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `POST /api/maintenance/migratePlaylistCards`

Migrate playlist data structure.

**Purpose:** Data migration for schema changes

**Response:**
```json
{
  "success": true,
  "migratedCount": 100
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Common Patterns

### Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Authentication Helpers

**Server-side authentication:**

```typescript
import { authenticate, weaklyAuthenticate } from '$lib/server/firebaseUtils';

// Throws 401 if invalid
const user = await authenticate(request);

// Returns null if invalid (doesn't throw)
const user = await weaklyAuthenticate(request);
```

### Authorization Checks

```typescript
import { isUserGlobalAdmin, isUserOrganizationAdmin, isProUser } from '$lib/server/firebaseUtils';

const isAdmin = await isUserGlobalAdmin(uid);
const isOrgAdmin = await isUserOrganizationAdmin(uid, orgId);
const isPro = await isProUser(uid);
```

### CORS

CORS is enabled globally in `hooks.server.ts`:

```typescript
response.headers.set('Access-Control-Allow-Origin', '*');
```

Don't add duplicate CORS headers in individual endpoints.

---

## Testing APIs

### Using curl

```bash
# Get user data
curl -H "Authorization: Bearer YOUR_ID_TOKEN" \
  https://blendreading.com/api/user

# Create session
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_ID_TOKEN"}' \
  https://blendreading.com/api/login/sessionCookie
```

### Using Firebase Emulators

```bash
# Terminal 1: Start emulators
npm run firebase-local

# Terminal 2: Start dev server
npm run dev

# APIs will use emulator data at localhost:9000
```

### Playwright E2E Tests

```bash
npm run test
```

Tests located in `tests/` directory.

---

## Rate Limiting

**Currently not implemented.** Consider adding rate limiting for:
- Login endpoints
- Share endpoints
- Organization invite endpoints

---

## Related Documentation

- [Main Documentation](../../AGENTS.md) - Project overview
- [Server Utilities](../../lib/server/AGENTS.md) - Implementation details
- [Firebase Utils](../../lib/server/firebaseUtils.ts) - Auth/DB utilities
