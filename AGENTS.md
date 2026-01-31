# Blend Product Site - AI Agent Documentation

**Last Updated:** 2026-01-31

## Overview

The Blend Product Site is a full-stack SvelteKit application serving dual purposes:
1. **Public-facing marketing website** - Homepage, pricing, blog, partner program
2. **Backend API host** - RESTful API for the Blend educational phonics app

**Tech Stack:**
- SvelteKit 2.5.4 + Svelte 4.2.0
- TypeScript 5.1.6
- Tailwind CSS 3.4.9
- Vite 5.1.6
- Netlify (hosting/deployment)

**External Services:**
- Firebase (Realtime Database, Auth, Storage)
- Stripe (subscription payments)
- Listmonk (transactional email)
- Sentry (error monitoring)

---

## Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Start Firebase emulators (auth, database, storage)
npm run firebase-local

# Type checking
npm run check

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test        # E2E tests (Playwright)
npm run test:unit   # Unit tests (Vitest)
```

---

## Project Structure

```
blend-product-site/
├── src/
│   ├── routes/              # SvelteKit routes (pages + API)
│   │   ├── api/             # RESTful API endpoints (~23 endpoints)
│   │   ├── account/         # User account pages
│   │   ├── organization/    # Team management pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── library/         # Content library pages
│   │   └── [other pages]/   # Marketing & static pages
│   ├── lib/
│   │   ├── components/      # Reusable Svelte components (14)
│   │   ├── server/          # Server-side utilities (Firebase, Stripe, email)
│   │   ├── data/            # Static content (blogs, library, FAQs)
│   │   ├── firebase.ts      # Firebase client SDK
│   │   └── utils.ts         # Client utilities
│   ├── hooks.server.ts      # Server hooks (Sentry, CORS)
│   └── hooks.client.ts      # Client hooks (error handling)
├── static/                  # Static assets
├── .env                     # Environment variables (DO NOT COMMIT)
└── netlify.toml             # Netlify configuration
```

See [src/routes/api/AGENTS.md](src/routes/api/AGENTS.md) for detailed API documentation.

---

## Environment Configuration

**Required Environment Variables:**

```bash
# Firebase Service Account (from Firebase Console)
FIREBASE_SERVICE_PRIVATE_KEY_ID=xxx
FIREBASE_SERVICE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_...
STRIPE_BLEND_PRO_PRICE_CODE=price_...
STRIPE_BLEND_PRO_ANNUAL_PRICE_CODE=price_...
STRIPE_BLEND_PRO_PRODUCT_CODE=prod_...
STRIPE_ANNUAL_DISCOUNT_ID=disc_...

# Listmonk Email Service
LISTMONK_API_URL=https://...
LISTMONK_USER=xxx
LISTMONK_PASSWORD=xxx

# Deployment Context (set by Netlify)
PUBLIC_DEPLOY_CONTEXT=production|test|local

# App URL (for deep linking)
PUBLIC_APP_URL=https://blendreading.com/app

# Firebase Emulators (Development Only)
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_DATABASE_EMULATOR_HOST=localhost:9000
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

**Deployment Contexts:**
- **production**: Uses `csma-blend` Firebase project
- **test**: Uses `blend-test-96c76` Firebase project
- **local**: Uses Firebase emulators

---

## Authentication & Authorization

**Authentication Flow:**
1. User signs in via Firebase Auth (client-side)
2. Client requests custom token: `POST /api/login/customToken`
3. Client creates session cookie: `POST /api/login/sessionCookie` (5-day expiration)
4. Server validates session using `checkSessionAuth()` for protected routes

**Authorization Levels:**
- **Global Admin**: Full access to all organizations and admin features
- **Organization Admin**: Manage organization members, invites, settings
- **Organization Member**: Access organization decks/playlists
- **Blend Pro User**: Subscribed to Blend Pro OR member of licensed organization
- **Blend Basic User**: Limited to preloaded content

**Key Server Functions:**
- `checkSessionAuth()` - Validates session, redirects to login if invalid ([src/lib/server/firebaseUtils.ts](src/lib/server/firebaseUtils.ts))
- `authenticate()` - Validates Bearer token for API requests
- `weaklyAuthenticate()` - Attempts authentication, returns null if fails
- `isUserGlobalAdmin()` - Checks global admin status
- `isUserOrganizationAdmin()` - Checks org-specific admin status
- `isProUser()` - Checks Pro subscription or licensed org membership

---

## Database Schema (Firebase Realtime Database)

**Key Database Paths:**

```
/users/{uid}/
  /protected/
    /isSubscribedToBlendPro: boolean
    /organizations: string[]           # Array of organization IDs
  /private/
    /stripeCustomerId: string

/organizations/{orgId}/
  /public/
    /name: string
    /contactEmail?: string
    /logoUrl?: string
  /private/
    /members: {[uid]: {role: 'admin'|'member'}}
    /invites: string[]                # Array of invite IDs
    /inviteRequests: {[uid]: {...}}   # Pending join requests
  /locked/
    /active: boolean
    /seats: number
    /isLicensed: boolean              # Org has valid license

/decks/{scope}/{deckId}/              # scope: user|organization|preloaded
  /created_ts: string
  /modified_ts: string
  /is_editable: boolean
  /name: string
  /position: number
  /refId: number

/playlists/{scope}/{playlistId}/      # scope: user|organization|preloaded
  /linked_deck_id: number
  /name: string
  /words: (string|false)[][]          # 2D array of phonemes

/flags/
  /global: {[flagName]: boolean}
  /user/{uid}: {[flagName]: boolean}
```

---

## API Architecture

**Base URL:** `/api/`

**Authentication:**
- Session cookie (browser): Created via `/api/login/sessionCookie`
- Bearer token (app): `Authorization: Bearer {idToken}`

**CORS:** Enabled for all origins (`Access-Control-Allow-Origin: *`)

**Response Format:** JSON with standard HTTP status codes

**API Endpoint Categories:**

1. **Authentication** - `/api/login/*`
2. **User Management** - `/api/user`
3. **Decks** - `/api/decks/*` (user, preloaded, shared)
4. **Playlists** - `/api/playlists/*` (user, preloaded, library, shared)
5. **Organizations** - `/api/organization/{orgId}/*`
6. **Admin** - `/api/admin/*` (global admin only)
7. **Feature Flags** - `/api/flags/*`
8. **Maintenance** - `/api/maintenance/*` (internal use)

See [src/routes/api/AGENTS.md](src/routes/api/AGENTS.md) for complete API reference.

---

## Key Integrations

### Stripe (Payment Processing)

**Purpose:** Blend Pro subscription management

**Implementation:** [src/lib/server/subscriptionUtils.ts](src/lib/server/subscriptionUtils.ts)

**Key Functions:**
- `createStripeSession()` - Create checkout session
- `getBlendProSubscription()` - Fetch active subscription
- `isSubscribedToBlendPro()` - Check subscription status

**Products:**
- Monthly: `price_1Q0UpoL7q6D0NeacBn19EbwK`
- Annual: `price_1Q0VCOL7q6D0NeactnW0KlGo`

### Listmonk (Transactional Email)

**Purpose:** Send deck/playlist share emails, organization invites

**Implementation:** [src/lib/server/emailUtils.ts](src/lib/server/emailUtils.ts)

**Key Functions:**
- `sendEmail()` - Send templated email

**Templates:**
- Template 13: Deck share emails
- Template 16: Playlist share emails

### Sentry (Error Monitoring)

**Implementation:** [hooks.server.ts](hooks.server.ts), [hooks.client.ts](hooks.client.ts)

**Features:**
- Server-side error tracking
- Client-side error tracking
- Automatic source map upload

---

## SvelteKit Patterns

### Server-Side Rendering (SSR)

**Disabled at root:** SSR is disabled in root layout (`+layout.ts` with `ssr: false`)

**Reason:** Firebase client SDK requires browser environment

### Route Protection

Protected routes use `checkSessionAuth()` in `+page.server.ts`:

```typescript
import { checkSessionAuth } from '$lib/server/firebaseUtils';

export async function load({ cookies }) {
  const user = await checkSessionAuth(cookies);
  // user is guaranteed to be authenticated here
  return { user };
}
```

### API Endpoints

API routes follow SvelteKit conventions in `src/routes/api/`:

```typescript
// GET /api/example
export async function GET({ request, cookies }) {
  const user = await authenticate(request);
  // Return JSON response
  return json({ data: ... });
}

// POST /api/example
export async function POST({ request, cookies }) {
  const body = await request.json();
  // Process and return
  return json({ success: true });
}
```

---

## Common Tasks

### Adding a New API Endpoint

1. Create route file: `src/routes/api/[endpoint]/+server.ts`
2. Implement HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
3. Use `authenticate()` or `weaklyAuthenticate()` for auth
4. Return JSON responses with appropriate status codes
5. Add CORS headers if needed (already global in `hooks.server.ts`)

### Adding a New Page

1. Create route directory: `src/routes/[page-name]/`
2. Add `+page.svelte` for UI
3. Add `+page.server.ts` for server-side data loading (optional)
4. Use `checkSessionAuth()` if page requires authentication
5. Import components from `$lib/components/`

### Modifying Database Schema

1. **CRITICAL:** Database migrations are manual in Firebase Realtime Database
2. Update schema documentation in this file
3. Write migration script in `src/routes/api/maintenance/` if needed
4. Test in Firebase emulator first (`npm run firebase-local`)
5. Deploy to test environment before production

### Adding a New Feature Flag

1. Add flag to `/flags/global/` or `/flags/user/{uid}/` in Firebase
2. Use `getFlag()` utility in [src/lib/server/firebaseUtils.ts](src/lib/server/firebaseUtils.ts)
3. Client-side: Fetch via `/api/flags/[flagName]`

---

## Testing

### Unit Tests (Vitest)

```bash
npm run test:unit
```

**Location:** `*.test.ts` files alongside source

### E2E Tests (Playwright)

```bash
npm run test
```

**Location:** `tests/` directory

### Manual Testing with Emulators

```bash
# Terminal 1: Start emulators
npm run firebase-local

# Terminal 2: Start dev server
npm run dev

# Access at http://localhost:5173
```

---

## Deployment

**Platform:** Netlify

**Build Command:** `npm run build`

**Publish Directory:** `build/`

**Environment Variables:** Set in Netlify dashboard

**Branches:**
- `main` → Production (`https://blendreading.com`)
- `test` → Test environment (`https://test.blendreading.com`)
- Other branches → Deploy previews

**Post-Deploy:**
- Sentry source maps automatically uploaded
- Firebase security rules not managed here (manual updates)

---

## Common Gotchas

1. **Firebase Emulator Data:** Not persisted between restarts by default
2. **Session Cookie Expiration:** 5 days - users must re-login after
3. **CORS:** Already enabled globally, don't add duplicate headers
4. **SSR Disabled:** Don't rely on SSR for SEO (use prerendering if needed)
5. **Environment Variables:** Restart dev server after changing `.env`
6. **Stripe Webhooks:** Not configured in this repo (handled separately)
7. **Firebase Rules:** Not managed in this repo (update in Firebase Console)

---

## Security Considerations

1. **Never commit `.env`** - Contains sensitive credentials
2. **Validate all user input** - Especially in API endpoints
3. **Use Firebase Security Rules** - Database access control
4. **Rate limiting:** Not implemented - consider adding for public APIs
5. **Session hijacking:** Session cookies are httpOnly and sameSite=lax
6. **SQL Injection:** N/A (using Firebase Realtime Database)
7. **XSS:** Svelte auto-escapes by default, avoid `{@html}` with user content

---

## Related Documentation

- [API Documentation](src/routes/api/AGENTS.md) - Complete API reference
- [Component Patterns](src/lib/components/AGENTS.md) - Reusable component documentation
- [Server Utilities](src/lib/server/AGENTS.md) - Server-side utility functions

---

## Support & Contact

- **Issues:** [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- **Main Developer:** Adrian Moya
- **Sentry:** https://sentry.io/organizations/csma-technology/projects/blend-product-site
