<!-- Takes an array of Decks, Playlists, OrganizationDecks, or OrganizationPlaylists and renders them in a table -->
<script lang="ts">
  import type { ChangeEventHandler } from 'svelte/elements';
  interface FlattenedItem {
    author?: string;
    createdAt: string;
    refId: string;
    name: string;
    updatedAt: string;
  }
  export let items: Database.Deck[] | Database.Playlist[] | Database.OrganizationDeck[] | Database.OrganizationPlaylist[];
  export let memberDetails: Database.Organization.MemberDetails[];
  export let selectable = false;
  export let selectedItems: string[] = [];
  export let itemActions: { name: string; handler: (item: FlattenedItem) => any }[] = [];
  $: flattenedItems = items
    .map<FlattenedItem>((item) => {
      return {
        //@ts-expect-error
        ...item.deck,
        //@ts-expect-error
        ...item.playlist,
        ...item,
      };
    })
    .map((item) => ({
      ...item,
      author: item.author ? memberDetails.find(({ uid }) => uid === item.author)?.displayName : undefined,
    }));

  const handleItemCheck: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      selectedItems = [...selectedItems, target.value];
    } else {
      selectedItems = selectedItems.filter((id) => id !== target.value);
    }
  };
</script>

<table>
  <thead>
    <tr>
      {#if selectable}
        <th></th>
      {/if}
      <th>Name</th>
      <th>Created At</th>
      <th>Updated At</th>
      <th>Author</th>
      {#if itemActions.length > 0}
        <th>Actions</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each flattenedItems as item}
      <tr>
        {#if selectable}
          <td><input type="checkbox" value={item.refId} on:change={handleItemCheck} /></td>
        {/if}
        <td>{item.name}</td>
        <td>{item.createdAt}</td>
        <td>{item.updatedAt}</td>
        <td>{item.author}</td>
        {#if itemActions.length > 0}
          <td>
            {#each itemActions as action}
              <button on:click={() => action.handler(item)}>{action.name}</button>
            {/each}
          </td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>
