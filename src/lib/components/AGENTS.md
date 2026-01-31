# Component Documentation

This directory contains reusable Svelte components for the Blend Product Site.

---

## Component Catalog

### UI Components

#### [Alert.svelte](Alert.svelte)

**Purpose:** Display alert/notification messages

**Props:**
- `type`: `'info' | 'success' | 'warning' | 'error'`
- `message`: `string`

**Usage:**
```svelte
<Alert type="success" message="Settings saved successfully!" />
```

---

#### [Modal.svelte](Modal.svelte)

**Purpose:** Modal dialog overlay

**Props:**
- `open`: `boolean` - Controls visibility
- `title`: `string` - Modal title

**Slots:**
- Default slot - Modal content
- `actions` slot - Footer action buttons

**Usage:**
```svelte
<Modal bind:open={showModal} title="Confirm Action">
  <p>Are you sure?</p>
  <svelte:fragment slot="actions">
    <button on:click={() => showModal = false}>Cancel</button>
    <button on:click={handleConfirm}>Confirm</button>
  </svelte:fragment>
</Modal>
```

---

#### [Collapsible.svelte](Collapsible.svelte)

**Purpose:** Expandable/collapsible content section

**Props:**
- `title`: `string` - Section header
- `open`: `boolean` - Initial state (default: false)

**Slots:**
- Default slot - Collapsible content

**Usage:**
```svelte
<Collapsible title="Advanced Settings">
  <p>Advanced configuration options...</p>
</Collapsible>
```

---

### Navigation Components

#### [AppBar.svelte](AppBar.svelte)

**Purpose:** Top navigation bar with logo and user menu

**Props:**
- `user`: `User | null` - Current authenticated user

**Features:**
- Logo link to homepage
- User avatar/menu when authenticated
- Login button when not authenticated
- Responsive mobile menu

**Usage:**
```svelte
<AppBar user={$user} />
```

---

#### [Footer.svelte](Footer.svelte)

**Purpose:** Site footer with links and copyright

**Features:**
- Links to About, Pricing, Blog, Help
- Social media links
- Copyright notice

**Usage:**
```svelte
<Footer />
```

---

### Authentication Components

#### [AuthCheck.svelte](AuthCheck.svelte)

**Purpose:** Client-side authentication guard

**Props:**
- `fallback`: `string` - Redirect URL if not authenticated (default: '/login')

**Slots:**
- Default slot - Content shown only to authenticated users

**Features:**
- Checks `$user` store
- Redirects to login if not authenticated
- Shows loading state during auth check

**Usage:**
```svelte
<AuthCheck fallback="/login">
  <p>This content only shows to logged-in users</p>
</AuthCheck>
```

---

### Subscription Components

#### [ProBadge.svelte](ProBadge.svelte)

**Purpose:** Display "Pro" badge indicator

**Props:**
- `size`: `'small' | 'medium' | 'large'` (default: 'medium')

**Usage:**
```svelte
<ProBadge size="small" />
```

---

#### [ProBadgeWrapper.svelte](ProBadgeWrapper.svelte)

**Purpose:** Wrap feature with Pro badge overlay

**Props:**
- `isPro`: `boolean` - Whether user has Pro access
- `showUpgrade`: `boolean` - Show upgrade prompt when clicked (default: true)

**Slots:**
- Default slot - Feature content

**Features:**
- Grays out content for non-Pro users
- Shows Pro badge overlay
- Opens upgrade modal on click (if `showUpgrade=true`)

**Usage:**
```svelte
<ProBadgeWrapper isPro={$user?.isSubscribedToBlendPro}>
  <button>Pro-only feature</button>
</ProBadgeWrapper>
```

---

#### [PlanSelection.svelte](PlanSelection.svelte)

**Purpose:** Plan selection UI with monthly/annual toggle

**Props:**
- `currentPlan`: `'basic' | 'pro'` - User's current plan
- `onSelectPlan`: `(plan: 'monthly' | 'annual') => void` - Callback

**Features:**
- Monthly/annual toggle
- Price display
- Feature comparison
- CTA buttons

**Usage:**
```svelte
<PlanSelection
  currentPlan="basic"
  onSelectPlan={handlePlanSelection}
/>
```

---

#### [PricingPlan.svelte](PricingPlan.svelte)

**Purpose:** Individual pricing plan card

**Props:**
- `title`: `string`
- `price`: `number`
- `period`: `'month' | 'year'`
- `features`: `string[]`
- `highlighted`: `boolean` - Highlight this plan (default: false)
- `ctaText`: `string` - CTA button text
- `onCTA`: `() => void` - CTA callback

**Usage:**
```svelte
<PricingPlan
  title="Blend Pro"
  price={9.99}
  period="month"
  features={['Unlimited decks', 'Custom themes', 'Priority support']}
  highlighted={true}
  ctaText="Get Started"
  onCTA={handleSubscribe}
/>
```

---

### Content Components

#### [BlogPost.svelte](BlogPost.svelte)

**Purpose:** Render blog post with rich content blocks

**Props:**
- `post`: `BlogPost` - Blog post object from `src/lib/data/blogs/`

**Supported Block Types:**
- `heading` - Text heading
- `text` - Paragraph text
- `image` - Image with caption
- `youtube` - Embedded YouTube video
- `byline` - Author byline

**Usage:**
```svelte
<script>
  import { blogPosts } from '$lib/data/blogs';
  const post = blogPosts.find(p => p.slug === 'my-post');
</script>

<BlogPost post={post} />
```

---

#### [FeatureCard.svelte](FeatureCard.svelte)

**Purpose:** Feature showcase card for marketing pages

**Props:**
- `icon`: `string` - Icon URL or name
- `title`: `string`
- `description`: `string`

**Usage:**
```svelte
<FeatureCard
  icon="🎯"
  title="Targeted Practice"
  description="Focus on specific phonics patterns"
/>
```

---

#### [PartnerCard.svelte](PartnerCard.svelte)

**Purpose:** Partner information display card

**Props:**
- `partner`: `Partner` - Partner object with logo, name, message

**Features:**
- Partner logo display
- Social link
- Blend message
- Partner message

**Usage:**
```svelte
<PartnerCard partner={partnerData} />
```

---

### Library Components

#### [LibraryCarousel.svelte](LibraryCarousel.svelte)

**Purpose:** Horizontal scrolling carousel for library items

**Props:**
- `items`: `LibraryItem[]` - Playlists or decks to display
- `type`: `'playlist' | 'deck'`

**Features:**
- Horizontal scroll
- Arrow navigation
- Touch/swipe support
- Responsive grid fallback

**Usage:**
```svelte
<LibraryCarousel items={playlists} type="playlist" />
```

---

## Component Patterns

### Using Stores

Most components consume the `$user` store from `$lib/firebase.ts`:

```svelte
<script>
  import { user } from '$lib/firebase';
</script>

{#if $user}
  <p>Welcome, {$user.displayName}!</p>
{:else}
  <p>Please log in</p>
{/if}
```

### Event Handling

Components use custom events for communication:

```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('action', { data: 'value' });
  }
</script>

<button on:click={handleClick}>Click me</button>
```

**Usage:**
```svelte
<MyComponent on:action={handleAction} />
```

### Conditional Rendering

Use Svelte's `{#if}` blocks for conditional content:

```svelte
{#if isPro}
  <ProFeature />
{:else}
  <UpgradePrompt />
{/if}
```

### Loading States

Show loading spinners during async operations:

```svelte
<script>
  let loading = false;

  async function loadData() {
    loading = true;
    await fetch('/api/data');
    loading = false;
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  <DataDisplay />
{/if}
```

---

## Styling

### Tailwind CSS

All components use Tailwind CSS for styling:

```svelte
<div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h2 class="text-xl font-bold">Title</h2>
</div>
```

### Custom Styles

For component-specific styles, use `<style>` block:

```svelte
<style>
  .custom-class {
    /* Custom CSS */
  }
</style>
```

**Note:** Svelte automatically scopes styles to the component.

---

## Accessibility

### ARIA Labels

Use proper ARIA labels for interactive elements:

```svelte
<button aria-label="Close modal" on:click={close}>
  <Icon name="x" />
</button>
```

### Keyboard Navigation

Ensure all interactive components support keyboard navigation:

```svelte
<div
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
>
  Click or press Enter
</div>
```

---

## Testing Components

### Unit Testing (Vitest)

```typescript
import { render } from '@testing-library/svelte';
import Alert from './Alert.svelte';

test('renders alert message', () => {
  const { getByText } = render(Alert, {
    props: { type: 'success', message: 'Test message' }
  });

  expect(getByText('Test message')).toBeInTheDocument();
});
```

### E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('modal opens and closes', async ({ page }) => {
  await page.goto('/test-page');
  await page.click('[data-testid="open-modal"]');
  await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  await page.click('[data-testid="close-modal"]');
  await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
});
```

---

## Common Gotchas

1. **SSR disabled globally** - Components can use browser APIs without checks
2. **Reactive statements** - Use `$:` for computed values: `$: fullName = firstName + ' ' + lastName`
3. **Store subscriptions** - Auto-subscribe with `$` prefix: `$user` instead of `user.subscribe(...)`
4. **Event modifiers** - Use Svelte event modifiers: `on:click|preventDefault={handler}`
5. **Slot defaults** - Provide default content for optional slots

---

## Related Documentation

- [Main Documentation](../../AGENTS.md)
- [Svelte Documentation](https://svelte.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
