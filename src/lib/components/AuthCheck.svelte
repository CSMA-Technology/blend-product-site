<!--
  @component

  This is a *client-side* auth check to ensure the user is logged in.
  
  It is useful where server-side session auth is unavailable, or if you want the page to redirect to the log in when the user becomes logged out.

  Since we are using two different auth methods (session cookie and firebase SDK, which uses local indexedDB), it is also possible to have a mismatch where the cookie is present but the user is logged out on the client. 
  This should therefore be used redundantly with the server-side `checkSessionAuth` function where user auth is critical. 

  It is not appropriate on its own to protect sensitive data on a server-rendered page, as the HTML may be sent to the client regardless of the user's auth status.
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { user, willAttemptLogin } from '$lib/firebase';
  import { page } from '$app/stores';
  import type { User } from 'firebase/auth';
  /**
   * If the user is logged out, this is the page they will be redirected to *after* successfully logging in.
   * Defaults to the current page, *without* query parameters (the pathname).
   */
  export let loginRedirect: string = $page.url.pathname;
  /**
   * Provide this value if the page should redirect if the user is already logged in.
   * Can be a string or a function that will be passed the Firebase User object and must return a string.
   * If not provided, and the user is logged in, there will be no redirect.
   */
  export let defaultRedirect: string | null | ((user: User) => string) = null;

  /**
   * The message to display to the user when they are redirected to the login page. Shpuld be an ID of a message in $lib/messages.ts.
   */
  export let messageId: string = 'loginRedirect';

  $: {
    if (!$user && !willAttemptLogin()) goto(`/login?successRedirect=${encodeURIComponent(loginRedirect)}&message=${messageId}`);
    else if ($user && defaultRedirect) goto(typeof defaultRedirect === 'function' ? defaultRedirect($user) : defaultRedirect);
  }
</script>
