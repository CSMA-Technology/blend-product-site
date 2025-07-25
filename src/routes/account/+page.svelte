<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import Modal from '$lib/components/Modal.svelte';
  import { user, signOut, customLoginToken } from '$lib/firebase';
  import type { PageData } from './$types';
  import TeamCreationModal from './components/TeamCreationModal.svelte';
  import TeamList from './components/TeamList.svelte';

  // Do not destructure. Doing so will lose the reactivity when the data is reloaded, such as when we call invalidateAll() below. Just use data.*
  export let data: PageData;

  const allOrganizations = [...data.licensedOrganizations, ...data.unlicensedOrganizations];
  let selectedOrgId: string;
  $: showOrgLeaveConfirmation = false;

  //@ts-ignore
  window.debugBlendUser = async () => {
    const idToken = await $user?.getIdToken();
    console.log(
      `
          uid: ${$user?.uid},
          id_token: ${idToken},
          custom_token: ${$customLoginToken}
        `,
    );
  };

  let disableSignOut = false;
  const onSignOutCLicked = async () => {
    disableSignOut = true;
    await signOut();
    goto('/login?message=signedOut');
  };

  const leaveOrganization = async (orgId: string) => {
    const body = new FormData();
    body.append('orgId', orgId);
    body.append('uid', `${$user?.uid}`);
    await fetch('?/leaveOrganization', {
      method: 'POST',
      body,
    });
    // orgDetails = orgDetails.filter(({ id }) => id !== orgId);
    invalidateAll();
  };

  const onLeaveClicked = (orgId: string) => {
    selectedOrgId = orgId;
    showOrgLeaveConfirmation = true;
  };

  let isCreatingSubscriptionOrder = false;

  let showTeamCreationModal = false;
</script>

<svelte:head>
  <title>My Account - Blend</title>
</svelte:head>

<div class="content">
  <h1 class="mt-4">Manage Account</h1>
  <section class="info">
    <h2>Profile Info</h2>
    <div class="detail">
      <h3 class="font-bold">Name</h3>
      <p>{$user?.displayName ?? 'Not Specified'}</p>
    </div>
    <div class="detail">
      <h3 class="font-bold">Email</h3>
      <p>{$user?.email}</p>
    </div>
    <div class="detail !mt-0">
      <button disabled={disableSignOut} on:click={onSignOutCLicked} class="btn">Sign Out</button>
    </div>
  </section>
  <section class="info">
    {#if data.licensedOrganizations.length}
      <div class="detail">
        <h3 class="text-2xl font-bold">Organizations</h3>
        <ul class="organization-list">
          {#each data.licensedOrganizations as { id, name, role } ({ id })}
            <li class="organization-item">
              {name}
              <span>
                <button class="btn btn-small btn-red" style="margin-right: 0;" on:click={() => onLeaveClicked(id)}>Leave</button>
                {#if data.isGlobalAdmin || role === 'admin'}
                  <a href={`/organization/${id}`} class="btn btn-small" style="margin-left: 0; margin-right: 0;">Manage</a>
                {/if}
              </span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="org-help mt-1">
        <p>Need help with your organization?</p>
        <p>
          Check out our guide here: <a
            href="https://docs.google.com/document/d/1RdX4JEZEGHoX9J2ccliZw-wEQzeWMudbcqTbdwM-zsc/edit?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer">Blend Organizations Guide</a>
        </p>
      </div>
    {/if}
    <TeamList {data} />
  </section>
  <section class="info">
    <h2>Subscription Information</h2>
    <div class="detail">
      <h3 class="font-bold">Your Blend Plan</h3>
      {#if data.isSubscribedToBlendPro}
        <p>Blend Pro</p>
        <div class="detail">
          <h3 class="font-bold">Billing</h3>
          {#if data.subscriptionPendingCancellation}
            <p>
              Your subscription has been cancelled and will expire {new Date(data.subscriptionPeriodEnd * 1000).toLocaleDateString()}. You will not be
              charged again.
            </p>
            <p>If you wish to reactivate your subscription, click the button below.</p>
            <form action="?/redirectToCustomerPortal" method="POST">
              <input type="hidden" name="uid" value={$user?.uid} />
              <button id="checkout-and-portal-button" type="submit" class="btn">Manage Subscription</button>
            </form>
          {:else if data.subscriptionPeriodEnd}
            <p>
              Your next billing period starts on {new Date(data.subscriptionPeriodEnd * 1000).toLocaleDateString()}
            </p>
            <form action="?/redirectToCustomerPortal" method="POST">
              <input type="hidden" name="uid" value={$user?.uid} />
              <button id="checkout-and-portal-button" type="submit" class="btn">Manage Subscription</button>
            </form>
          {:else}
            <p>Your subscription is active.</p>
          {/if}
        </div>
      {:else if data.hasLicensedOrgMembership}
        <p>Blend Pro - Group License</p>
        <p class="text-sm">You have Blend Pro access through your organization membership(s).</p>
        <br />
        <p>
          For questions about your access, please reach out to your organization admin or email us at <a href="mailto:support@blendreading.com"
            >support@blendreading.com.</a>
        </p>
      {:else}
        <p>Blend Basic</p>
        <form
          action="?/createSubscriptionOrder"
          on:submit={() => {
            isCreatingSubscriptionOrder = true;
          }}
          method="POST">
          <input type="hidden" name="email" value={$user?.email} />
          <input type="hidden" name="name" value={$user?.displayName} />
          <input type="hidden" name="uid" value={$user?.uid} />
          <button id="checkout-and-portal-button" type="submit" disabled={isCreatingSubscriptionOrder} class="btn">Upgrade to Blend Pro</button>
        </form>
      {/if}
    </div>
  </section>
</div>

<TeamCreationModal bind:show={showTeamCreationModal} />
<Modal bind:showModal={showOrgLeaveConfirmation}>
  <h2 slot="header">Are you sure?</h2>
  <p class="p-4">
    This will remove you from the {allOrganizations.find(({ id }) => id === selectedOrgId)?.name} organization. You will need to be invited back in order
    to re-join.
  </p>
  <div slot="footer" class="row flex-around">
    <button
      class="btn btn-gray"
      on:click={() => {
        showOrgLeaveConfirmation = false;
      }}>Cancel</button>
    <button
      class="btn btn-red"
      on:click={() => {
        leaveOrganization(selectedOrgId);
        showOrgLeaveConfirmation = false;
      }}>Leave Organization</button>
  </div>
</Modal>

<style>
  @media (max-width: 480px) {
    .info {
      width: 80% !important;
    }
  }

  .btn {
    font-family: 'Heebo';
    font-weight: bold;
    font-size: 1.2rem;
  }
  p,
  h3 {
    margin: 0;
  }
  .info {
    width: 50%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  :global(.detail) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem;
  }
  .content {
    row-gap: 2rem;
  }

  .organization-list {
    list-style: none;
    padding-left: 0;
    width: 100%;
  }

  .organization-item {
    padding: 10px;
    border-bottom: solid 0.5px rgba(255, 255, 255, 0.5);
    border-top: solid 0.5px rgba(255, 255, 255, 0.5);
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .org-help a:hover {
    color: white;
  }
</style>
