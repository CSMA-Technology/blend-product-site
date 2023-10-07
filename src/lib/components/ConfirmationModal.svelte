<script lang="ts">
  import Modal from './Modal.svelte';

  export let title: string = 'Are you sure?';
  export let message: string = 'This action cannot be undone.';
  export let onConfirm: () => void;
  export let onCancel: () => void;

  export let show: boolean = false;
</script>

<Modal bind:showModal={show}>
  <h1 slot="header">{title}</h1>
  <p>{message}</p>
  <div slot="footer" class="row">
    <button class="btn" on:click={onConfirm}>Yes</button>
    <button class="btn btn-btn-gray" on:click={onCancel}>No</button>
  </div>
</Modal>
