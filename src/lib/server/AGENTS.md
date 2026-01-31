# Server Utilities Documentation

This directory contains server-side utility modules for the Blend Product Site.

**IMPORTANT:** These utilities run ONLY on the server. Never import them in client-side code.

---

## Module Overview

### [firebaseAdminCredential.ts](firebaseAdminCredential.ts)

**Purpose:** Initialize Firebase Admin SDK with service account credentials

**Exports:**
- `firebaseAdmin` - Configured Firebase Admin instance

**Environment Variables Required:**
- `FIREBASE_SERVICE_PRIVATE_KEY_ID`
- `FIREBASE_SERVICE_PRIVATE_KEY`

**Usage:**
```typescript
import { firebaseAdmin } from '$lib/server/firebaseAdminCredential';

const user = await firebaseAdmin.auth().getUser(uid);
```

---

### [firebaseUtils.ts](firebaseUtils.ts)

**Purpose:** Firebase database operations and authentication utilities

**Key Functions:**

#### Authentication & Authorization

```typescript
// Authenticate API request (throws 401 if invalid)
const user = await authenticate(request);

// Authenticate without throwing (returns null if invalid)
const user = await weaklyAuthenticate(request);

// Check session cookie (throws 302 redirect if invalid)
const user = await checkSessionAuth(cookies);

// Authorization checks
const isAdmin = await isUserGlobalAdmin(uid);
const isOrgAdmin = await isUserOrganizationAdmin(uid, orgId);
const isPro = await isProUser(uid);
```

#### Database Operations

```typescript
// Read data
const data = await readDatabase('/users/uid123');
const snapshot = await readDatabaseSnapshot('/decks/preloaded');

// Write data
await writeDatabase('/users/uid123/profile', { name: 'John' });

// Delete data
await deleteDatabase('/users/uid123/old-data');

// Get flag value
const flagValue = await getFlag('featureName', uid);
```

**Helper Functions:**
- `getOrganizationMembers(orgId)` - Get all organization members
- `getOrganizationAdmins(orgId)` - Get organization admins only

---

### [subscriptionUtils.ts](subscriptionUtils.ts)

**Purpose:** Stripe integration for Blend Pro subscriptions

**Environment Variables Required:**
- `STRIPE_SECRET_KEY`
- `STRIPE_BLEND_PRO_PRICE_CODE`
- `STRIPE_BLEND_PRO_ANNUAL_PRICE_CODE`
- `STRIPE_BLEND_PRO_PRODUCT_CODE`

**Key Functions:**

```typescript
// Create checkout session
const session = await createStripeSession(
  customerId,      // Stripe customer ID
  priceId,        // Price ID (monthly or annual)
  successUrl,     // Redirect after success
  cancelUrl       // Redirect after cancel
);

// Get active subscription
const subscription = await getBlendProSubscription(customerId);

// Check subscription status
const isSubscribed = await isSubscribedToBlendPro(uid);
```

**Subscription Status Logic:**
- Checks both Stripe subscription AND organization license
- Returns `true` if user has active subscription OR is member of licensed organization
- Caches subscription status in Firebase

---

### [emailUtils.ts](emailUtils.ts)

**Purpose:** Email sending via Listmonk transactional email service

**Environment Variables Required:**
- `LISTMONK_API_URL`
- `LISTMONK_USER`
- `LISTMONK_PASSWORD`

**Key Functions:**

```typescript
// Send templated email
await sendEmail(
  recipientEmail,
  recipientName,
  templateId,      // Listmonk template ID
  variables        // Template variables object
);
```

**Email Templates:**
- **Template 13:** Deck share emails
  - Variables: `sender_name`, `deck_name`, `share_link`
- **Template 16:** Playlist share emails
  - Variables: `sender_name`, `playlist_name`, `share_link`

**Usage Example:**
```typescript
await sendEmail(
  'recipient@example.com',
  'Jane Doe',
  13,
  {
    sender_name: 'John Doe',
    deck_name: 'Consonants',
    share_link: 'https://blendreading.com/deckShare/abc123'
  }
);
```

---

### [accountUtils.ts](accountUtils.ts)

**Purpose:** Account management utilities

**Key Functions:**

```typescript
// Delete anonymous Firebase Auth users
const deletedCount = await deleteAnonymousUsers();
```

**Purpose:** Cleanup orphaned anonymous accounts created during testing or abandoned sessions.

---

## Common Patterns

### Error Handling

All utilities throw descriptive errors:

```typescript
try {
  const user = await authenticate(request);
} catch (error) {
  // Error is thrown with descriptive message
  return json({ error: error.message }, { status: 401 });
}
```

### Authentication in API Routes

**Pattern 1: Required authentication (throw on failure)**

```typescript
import { authenticate } from '$lib/server/firebaseUtils';

export async function GET({ request }) {
  const user = await authenticate(request);  // Throws 401 if invalid
  // user is guaranteed to be defined here
  return json({ uid: user.uid });
}
```

**Pattern 2: Optional authentication (return null on failure)**

```typescript
import { weaklyAuthenticate } from '$lib/server/firebaseUtils';

export async function GET({ request }) {
  const user = await weaklyAuthenticate(request);
  if (!user) {
    // Return public data
    return json({ publicData: true });
  }
  // Return user-specific data
  return json({ userData: true, uid: user.uid });
}
```

**Pattern 3: Page protection (redirect on failure)**

```typescript
import { checkSessionAuth } from '$lib/server/firebaseUtils';

export async function load({ cookies }) {
  const user = await checkSessionAuth(cookies);  // Redirects to /login if invalid
  // user is guaranteed to be defined here
  return { user };
}
```

### Authorization Checks

```typescript
import { isUserGlobalAdmin, isProUser } from '$lib/server/firebaseUtils';

export async function POST({ request }) {
  const user = await authenticate(request);

  // Check if user is global admin
  if (!await isUserGlobalAdmin(user.uid)) {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Check if user is Pro
  if (!await isProUser(user.uid)) {
    return json({ error: 'Pro subscription required' }, { status: 403 });
  }

  // Proceed with admin/Pro-only action
}
```

### Database Operations

```typescript
import { readDatabase, writeDatabase } from '$lib/server/firebaseUtils';

// Read user profile
const profile = await readDatabase(`/users/${uid}/protected`);

// Update user data
await writeDatabase(`/users/${uid}/protected/lastLogin`, Date.now());

// Read multiple items
const snapshot = await readDatabaseSnapshot('/decks/preloaded');
const decks = snapshot.val();  // Returns object of all preloaded decks
```

### Stripe Integration

```typescript
import { createStripeSession, isSubscribedToBlendPro } from '$lib/server/subscriptionUtils';

// Create checkout session
const session = await createStripeSession(
  customerData.stripeCustomerId,
  PUBLIC_STRIPE_BLEND_PRO_PRICE_CODE,
  'https://blendreading.com/blendPro/success',
  'https://blendreading.com/pricing'
);

// Check subscription
const isPro = await isSubscribedToBlendPro(uid);
if (!isPro) {
  return json({ error: 'Pro subscription required' }, { status: 403 });
}
```

---

## Environment Detection

The utilities automatically detect the deployment environment:

```typescript
import { PUBLIC_DEPLOY_CONTEXT } from '$env/static/public';

if (PUBLIC_DEPLOY_CONTEXT === 'local') {
  // Use Firebase emulators
  // Database: localhost:9000
  // Auth: localhost:9099
  // Storage: localhost:9199
} else if (PUBLIC_DEPLOY_CONTEXT === 'test') {
  // Use test Firebase project: blend-test-96c76
} else {
  // Use production Firebase project: csma-blend
}
```

---

## Security Considerations

1. **Never expose these utilities to client-side code**
   - All modules in this directory are server-only
   - Importing in client code will cause build errors

2. **Validate all input before database writes**
   - Never trust client data
   - Sanitize and validate before calling `writeDatabase()`

3. **Use proper authorization checks**
   - Authentication (who are you?) ≠ Authorization (what can you do?)
   - Always check both before sensitive operations

4. **Protect sensitive data**
   - User private data: `/users/{uid}/private/`
   - Organization private data: `/organizations/{orgId}/private/`
   - Use Firebase Security Rules as backup layer

5. **Handle errors gracefully**
   - Don't expose internal error details to clients
   - Log errors to Sentry for debugging

---

## Testing

### Unit Tests

```bash
npm run test:unit
```

### Testing with Firebase Emulators

```bash
# Start emulators
npm run firebase-local

# Run dev server
npm run dev

# All Firebase operations will use emulator data
```

**Emulator Endpoints:**
- Database: `http://localhost:9000`
- Auth: `http://localhost:9099`
- Storage: `http://localhost:9199`

---

## Common Gotchas

1. **Firebase Admin SDK requires service account**
   - Must set `FIREBASE_SERVICE_PRIVATE_KEY_ID` and `FIREBASE_SERVICE_PRIVATE_KEY`
   - Private key must include newlines: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

2. **Session cookies expire after 5 days**
   - Users must re-login after expiration
   - No automatic refresh (by design)

3. **Stripe customer ID must exist**
   - Created automatically on first subscription attempt
   - Stored in `/users/{uid}/private/stripeCustomerId`

4. **Organization checks are async**
   - Must `await` all authorization functions
   - Results are not cached (queries Firebase each time)

5. **Database paths are case-sensitive**
   - `/users/` ≠ `/Users/`
   - Always use lowercase for consistency

---

## Related Documentation

- [Main Documentation](../../AGENTS.md)
- [API Reference](../../routes/api/AGENTS.md)
- [Firebase Utils Source](firebaseUtils.ts)
