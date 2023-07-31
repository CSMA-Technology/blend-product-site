<script lang="ts">
  import combinedBlends from '$lib/assets/marketplace/combined-blends.png';

  const premadeDecks = [
    {
      "name": "Combined Blends", 
      "description" : "This deck is aimed at blah blah blah a description of what this deck was made for.",
      "author": "Summer Kiesel",
      "image": combinedBlends,
      "id": "-NaT4aMfMtKhI7de8PQb"
    }
  ]
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
    {#each premadeDecks as deck}
    <div class="deck">
      <div class="side-by-side">
        <img src={deck.image} alt="sample"/>
        <section class="description">
          <h2>{deck.name}</h2>
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
  main {
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

  h2 {
    font-family: "Contrail One";
  }

  .side-by-side {
    justify-content: center;
  }
  .side-by-side img {
    width: 40%;
    flex-basis: 40rem;
    max-height: 20rem;
    object-fit: cover; 
    border-radius: 10px 0px 0px 10px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .description {
    width: 30%;
    justify-content: left;
    padding: 2rem;
    background-color: white;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    color: #012A51;
  }

  .decks {
    display: flex;
    flex-direction: column;
    padding: 2rem;
  }
  .btn {
    border-color: #012A51;
    border-width: 0.15rem;
    color: #012A51;
    margin: 0;
  }

  .btn:hover {
    background-color: #012A51;
    color: white;
  }
</style>