<script lang="ts">
  import marketplaceDecks from '$lib/data/marketplaceDecks';
</script>

<svelte:head>
  <title>Pro Decks</title>
</svelte:head>

<main>
  <section class="library-description">
    <h1>Blend Pro Deck Library</h1>
    <p>Pro Users have access to a library of premade decks provided by our Blend Team.</p>
    <p>You can import any of these decks into your own library.</p>
    <p>Something about how Summer is certified in OG and made these decks to help teachers pinpoint different phonics skills.</p>
  </section>
  
  <section class="decks">
    {#each marketplaceDecks as deck}
    <div class="deck">
      <div class="side-by-side">
        <img src={deck.image} alt="sample"/>
        <section class="description">
          <div class="title">{deck.name}</div>
          <p>{deck.description}</p>
          <p><i>Created by: {deck.author}</i></p>
          <a href="/decks/{deck.id}" class="btn">Import</a>
        </section>
      </div>
    </div>
    {/each}
  </section>
</main>

<style>
  .deck {
    width: 60%;
    border-radius: 10px;
    border: 2px solid #012A51;
  }
  main {
    padding: 2rem;
    background: #8EC9FF;
  }
  .library-description {
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    margin-bottom: 0;
  }

  .title {
    font-family: 'Contrail One';
    font-size: 1.8rem;
  }

  .side-by-side {
    justify-content: center;
  }
  
  .side-by-side img {
    flex-grow: 1;
    width: 60%;
    flex-basis: 30rem;
    max-height: 30rem;
    object-fit: cover; 
    border-radius: 10px;
  }

  .description {
    flex-grow: 1;
    width: 30%;
    justify-content: left;
    padding: 2rem;
    flex-basis: 10rem;
    background: rgba(255, 255, 255, 0.40);
    border-radius: 10px;
    color: #012A51;
  }

  .decks {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .btn {
    border-color: #012A51;
    border-width: 0.15rem;
    color: #012A51;
    margin: 0;
    font-weight: 900;
  }

  .btn:hover {
    background-color: #012A51;
    color: white;
  }
  @media (max-width: 480px) {
    .deck {
      width: 100%;
      font-size: 90%;
    }
  }
</style>