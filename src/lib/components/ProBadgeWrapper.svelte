<div class="btn-pro">
  <!-- TODO: this should point to the new Blend Pro feature page -->
  <a href="/pricing">
    <div class="pro-badge">PRO</div>
  </a>
  <slot />
</div>

<style>
  a:hover {
    color: black;
  }
  .btn-pro {
    position: relative;
    display: inline-block;  
    margin-top: 1rem;
  }
  .pro-badge {
    position: absolute;
    right: 0px;
    margin-top: -10px;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    background: linear-gradient(53deg, #FFFAA0 11.98%, #F4BA9E 55.21%, #EEA7FA 100%);
    border-radius: 50%;
    border: 2px solid black;
    font-family: 'Contrail One';
  }
</style>