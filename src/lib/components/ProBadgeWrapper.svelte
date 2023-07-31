<script lang="ts">
  import proBadge from '$lib/assets/pro-badge.png';
</script>

<div class="btn-pro">
  <img class="badge" alt="pro badge" src={proBadge}/>
  <slot />
</div>

<style>
  .btn-pro {
    position: relative;
    display: inline-block;  
  }
  .badge {
    position: absolute;
    right: 0px;
    margin-top: -10px;
  }
</style>