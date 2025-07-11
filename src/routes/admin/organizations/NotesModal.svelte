<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import { createWritableStore } from '$lib/firebase';
  import { onDestroy } from 'svelte';

  export let show = false;
  export let orgId: string;

  // Realtime notes store for this org
  const notesStore = createWritableStore<Database.AdminData.OrganizationNotes[string]>(`admin-data/organization-notes/${orgId}`);
  let notes: string = '';
  const unsubscribe = notesStore.subscribe((val) => {
    if (typeof val === 'string') notes = val;
    else if (val == null) notes = '';
  });
  onDestroy(unsubscribe);

  function handleInput(e: Event) {
    notesStore.set((e.target as HTMLTextAreaElement).value);
  }
</script>

<Modal bind:showModal={show}>
  <h2 slot="header">Organization Notes</h2>
  <form class="w-screen max-w-3xl">
    <div class="flex flex-col gap-4 py-4">
      <textarea
        class="border-gray min-h-[200px] w-full rounded-md border-2 px-2"
        bind:value={notes}
        on:input={handleInput}
        placeholder="Notes will save in real time" />
    </div>
  </form>
  <div slot="footer" class="flex justify-end">
    <button class="btn btn-gray" on:click={() => (show = false)}>Close</button>
  </div>
</Modal>
