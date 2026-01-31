# Claude Code Instructions for Blend Product Site

**This file is automatically loaded by Claude Code when starting a conversation.**

---

## Primary Documentation

For comprehensive documentation about this SvelteKit application, see:

**[@AGENTS.md](AGENTS.md)** - Main documentation file

---

## Repository-Specific Etiquette

### Code Style

- **TypeScript:** Strict mode enabled, use proper typing
- **Formatting:** Prettier and ESLint configured - run `npm run format` before commits
- **Components:** Use Svelte 4 composition patterns, avoid deprecated APIs

### Git Workflow

- **Branches:** `main` (production), `test` (staging), feature branches
- **Pre-commit:** Type checking and unit tests run automatically
- **Commit Messages:** Use conventional commits format

### Environment Safety

- **NEVER commit `.env` file** - Contains production credentials
- **Test changes in emulator first:** `npm run firebase-local` + `npm run dev`
- **Verify deployment context:** Check `PUBLIC_DEPLOY_CONTEXT` before deploying

### API Development

- **Authentication required:** Use `authenticate()` or `weaklyAuthenticate()` for all user-specific endpoints
- **Return proper status codes:** 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found)
- **CORS already enabled globally:** Don't add duplicate headers in individual endpoints

### Database Operations

- **Firebase paths are case-sensitive:** `/users/` not `/Users/`
- **Test migrations in emulator:** Data loss is permanent in production
- **Use transactions for concurrent writes:** Prevent race conditions

### Security

- **Validate all input:** Never trust client data
- **Use authorization checks:** Verify user has permission for requested resource
- **Sanitize before database writes:** Prevent injection attacks

---

## Unexpected Behaviors & Warnings

1. **SSR Disabled:** Root layout has `ssr: false` - Firebase client SDK requires browser
2. **Session expiration:** 5-day cookie lifetime - users will be logged out after
3. **Emulator data is ephemeral:** Don't rely on persistence between emulator restarts
4. **Firebase rules not in repo:** Security rules managed in Firebase Console
5. **Stripe webhooks external:** Webhook handling not in this codebase

---

## Quick Reference

```bash
# Development
npm run dev                    # Start dev server
npm run firebase-local         # Start emulators
npm run check                  # Type checking

# Testing
npm run test                   # E2E tests
npm run test:unit             # Unit tests

# Production
npm run build                  # Build for production
npm run preview               # Preview production build
```

---

## Additional Context Files

- **API Reference:** [src/routes/api/AGENTS.md](src/routes/api/AGENTS.md)
- **Components:** [src/lib/components/AGENTS.md](src/lib/components/AGENTS.md)
- **Server Utils:** [src/lib/server/AGENTS.md](src/lib/server/AGENTS.md)

---

**For detailed architecture, database schemas, and integration guides, see [@AGENTS.md](AGENTS.md)**
