<script lang="ts">
  import schwaDay from '$lib/assets/events/schwa-day/national-schwa-day.png';
  import playlistThumbnail from '$lib/assets/events/schwa-day/schwa-playlist-thumbnail.png';
  import wordMatThumbnail from '$lib/assets/events/schwa-day/schwa-word-mat-thumbnail.png';
  import aAsSchwa from '$lib/assets/events/schwa-day/a-as-schwa.png';
  import eAsSchwa from '$lib/assets/events/schwa-day/e-as-schwa.png';
  import oAsSchwa from '$lib/assets/events/schwa-day/o-as-schwa.png';
  import schwaDayKickoff from '$lib/assets/events/schwa-day/schwa-day-kickoff.svg';

  let staticConfetti: Array<{
    id: number;
    left: number;
    top: number;
    color: string;
    shape: string;
    size: number;
    rotate: number;
  }> = [];
  let nextId = 0;

  let carouselOffset = 0;
  const paginationFactor = 380; // 340px item + 40px margin
  const totalItems = 5;
  let visibleItems = 3;

  function updateCarouselSettings() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        visibleItems = 1;
      } else if (window.innerWidth < 1024) {
        visibleItems = 2;
      } else {
        visibleItems = 3;
      }
    }
  }

  if (typeof window !== 'undefined') {
    updateCarouselSettings();
    window.addEventListener('resize', updateCarouselSettings);
  }

  $: atStart = carouselOffset === 0;
  $: atEnd = carouselOffset <= paginationFactor * (totalItems - visibleItems) * -1;

  const moveCarousel = (direction: number) => {
    if (direction > 0 && !atEnd) {
      carouselOffset -= paginationFactor;
    } else if (direction < 0 && !atStart) {
      carouselOffset += paginationFactor;
    }
  };

  const scrollToEnd = (direction: number) => {
    if (direction > 0 && !atEnd) {
      carouselOffset = paginationFactor * (totalItems - visibleItems) * -1;
    } else if (direction < 0 && !atStart) {
      carouselOffset = 0;
    }
  };

  // Create static background confetti concentrated along the page border
  function createStaticConfetti() {
    const colors = ['#5AEDF2', '#F44FFF', '#FFFF00', '#FF7934', '#FB0093', '#4DD7FE'];
    const shapes = ['circle', 'square', 'star'];
    const count = 220;

    staticConfetti = Array.from({ length: count }, () => {
      let left: number;
      let top: number;
      const region = Math.random();

      // Distribute evenly around edges: top, bottom, left, right
      if (region < 0.25) {
        // top strip (0-8%)
        left = Math.random() * 100;
        top = Math.random() * 8;
      } else if (region < 0.5) {
        // bottom strip (92-100%)
        left = Math.random() * 100;
        top = 92 + Math.random() * 8;
      } else if (region < 0.75) {
        // left strip (0-8%)
        left = Math.random() * 8;
        top = Math.random() * 100;
      } else {
        // right strip (92-100%)
        left = 92 + Math.random() * 8;
        top = Math.random() * 100;
      }

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.round(6 + Math.random() * 18); // px
      const rotate = Math.floor(Math.random() * 360);
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: nextId++,
        left,
        top,
        color,
        shape,
        size,
        rotate,
      };
    });
  }

  // Create confetti on page load
  if (typeof window !== 'undefined') {
    createStaticConfetti();
  }
</script>

<svelte:head>
  <title>National Schwa Day - Blend</title>
  <meta name="description" content="Celebrate National Schwa Day with free classroom resources from Blend" />
</svelte:head>

<main>
  <!-- Static Confetti Background -->
  <div class="static-confetti-container">
    {#each staticConfetti as piece (piece.id)}
      {#if piece.shape === 'circle'}
        <div
          class="static-confetti static-circle"
          style="
            left: {piece.left}%;
            top: {piece.top}%;
            background-color: {piece.color};
            width: {piece.size}px;
            height: {piece.size}px;
            transform: rotate({piece.rotate}deg);
          " />
      {:else if piece.shape === 'square'}
        <div
          class="static-confetti static-square"
          style="
            left: {piece.left}%;
            top: {piece.top}%;
            background-color: {piece.color};
            width: {piece.size}px;
            height: {piece.size}px;
            transform: rotate({piece.rotate}deg);
          " />
      {:else if piece.shape === 'star'}
        <div
          class="static-confetti static-star"
          style="
            left: {piece.left}%;
            top: {piece.top}%;
            color: {piece.color};
            font-size: {piece.size}px;
            transform: rotate({piece.rotate}deg);
          ">
          ★
        </div>
      {/if}
    {/each}
  </div>

  <div class="content">
    <!-- Hero Section -->
    <div class="header">
      <div class="side-by-side">
        <div class="description">
          <p class="subtitle mb-2">Blend + Phonics Read-Alouds</p>
          <h1>National Schwa Day 🎉</h1>
          <p class="my-4">
            We've joined forces with Phonics Read-Alouds to celebrate National Schwa Day on April 7th! To honor this special day, we're excited to
            offer FREE phonics resources featuring the most common sound in the English language, the Not So Lazy Schwa.
          </p>
          <p class="my-4">
            Ready to celebrate with us? Check out the resources below to learn how to get involved and make sure you're prepared for the big day!
          </p>
          <div class="side-by-side">
            <a class="btn btn-blurple" href="#resources">Get FREE Resources</a>
            <a class="btn btn-outlined" href="#demo">Watch Demo</a>
          </div>
        </div>
        <div class="xl:w-[45%]">
          <img src={schwaDay} alt="National Schwa Day with Not So Lazy Schwa character" class="w-full rounded-lg" />
        </div>
      </div>
    </div>

    <!-- BLEND Resources Section -->
    <div class="resources" id="resources">
      <div class="resource-title">
        <h2>FREE Classroom Resources</h2>
        <p>
          Celebrate with premade blending drills and spelling activities featuring characters from
          <em>The Not So Lazy Schwa</em> Phonics Read-Alouds story.
        </p>
      </div>

      <div class="carousel-container">
        <div class="carousel" style="transform: translateX({carouselOffset}px);">
          <div class="resource-item">
            <h3>The Not So Lazy Schwa Spelling Mat</h3>
            <div class="resource-preview">
              <img src={wordMatThumbnail} alt="Spelling Mat resource preview" class="h-full w-full rounded object-cover" />
            </div>
            <p>Interactive spelling mat with Elkonin boxes. Mark schwa sounds using The Not So Lazy Schwa character!</p>
            <a
              href="https://app.blendreading.com?jumpScene=res%3A%2F%2FScenes%2FPlay%2FWordMat%2FPlayWordMat.tscn&context=%7B%22wordMatId%22%3A%22schwa%22%7D"
              target="_blank"
              class="btn btn-blurple">Open in Blend</a>
          </div>
          <div class="resource-item">
            <h3>The Not So Lazy Schwa Playlist</h3>
            <div class="resource-preview">
              <img src={playlistThumbnail} alt="Blending Drills resource preview" class="h-full w-full rounded object-cover" />
            </div>
            <p>▶️ Grab and go resource! Premade word list featuring words with schwa sounds! No prep required!</p>
            <a
              href="https://app.blendreading.com?jumpScene=res%3A%2F%2FScenes%2FPlay%2FPlaylist%2FPlayPlaylist.tscn&context=%7B%22playlistId%22%3A2562374201%7D"
              target="_blank"
              class="btn btn-blurple">Open in Blend</a>
          </div>

          <div class="resource-item">
            <h3><i>NEW!</i> The A as a Schwa Playlist</h3>
            <div class="resource-preview">
              <img src={aAsSchwa} alt="A as a Schwa resource preview" class="h-full w-full rounded object-cover" />
            </div>
            <p>▶️ Grab and go resource! Premade word list featuring words with the letter A pronounced as a schwa!</p>
            <a
              href="https://app.blendreading.com?jumpScene=res%3A%2F%2FScenes%2FPlay%2FPlaylist%2FPlayPlaylist.tscn&context=%7B%22playlistId%22%3A231959914%7D"
              target="_blank"
              class="btn btn-blurple">Open in Blend</a>
          </div>

          <div class="resource-item">
            <h3><i>NEW!</i> The E as a Schwa Playlist</h3>
            <div class="resource-preview">
              <img src={eAsSchwa} alt="E as a Schwa resource preview" class="h-full w-full rounded object-cover" />
            </div>
            <p>▶️ Grab and go resource! Premade word list featuring words with the letter E pronounced as a schwa!</p>
            <a
              href="https://app.blendreading.com?jumpScene=res%3A%2F%2FScenes%2FPlay%2FPlaylist%2FPlayPlaylist.tscn&context=%7B%22playlistId%22%3A3355207273%7D"
              target="_blank"
              class="btn btn-blurple">Open in Blend</a>
          </div>

          <div class="resource-item">
            <h3><i>NEW!</i> The O as a Schwa Playlist</h3>
            <div class="resource-preview">
              <img src={oAsSchwa} alt="O as a Schwa resource preview" class="h-full w-full rounded object-cover" />
            </div>
            <p>▶️ Grab and go resource! Premade word list featuring the schwa sound in words with the letter O!</p>
            <a
              href="https://app.blendreading.com?jumpScene=res%3A%2F%2FScenes%2FPlay%2FPlaylist%2FPlayPlaylist.tscn&context=%7B%22playlistId%22%3A3008488044%7D"
              target="_blank"
              class="btn btn-blurple">Open in Blend</a>
          </div>
        </div>
      </div>

      <div class="carousel-controls">
        <button class="btn btn-small" disabled={atStart} on:click={() => scrollToEnd(-1)}>
          <span class="material-symbols-rounded">keyboard_double_arrow_left</span>
        </button>
        <button class="btn btn-small" disabled={atStart} on:click={() => moveCarousel(-1)}>
          <span class="material-symbols-rounded">keyboard_arrow_left</span>
        </button>
        <button class="btn btn-small" disabled={atEnd} on:click={() => moveCarousel(1)}>
          <span class="material-symbols-rounded">keyboard_arrow_right</span>
        </button>
        <button class="btn btn-small" disabled={atEnd} on:click={() => scrollToEnd(1)}>
          <span class="material-symbols-rounded">keyboard_double_arrow_right</span>
        </button>
      </div>

      <div class="swipe-hint">
        <p>Swipe to browse!</p>
      </div>
    </div>

    <!-- Demo Section -->
    <div class="demo-section" id="demo">
      <h2>How to Get Started</h2>
      <p class="demo-subtitle">
        Watch a quick demo or our live webinar recording below to learn about the Schwa Day resources and get ready for the celebration!
      </p>
      <div class="demo-grid">
        <div class="demo-video-panel">
          <div class="video-container">
            <div class="relative aspect-video overflow-hidden rounded-xl shadow-md">
              <iframe
                class="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dujrxDwD1os?si=bLbXLkOWESuObh4h"
                title="How to Get Started demo video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen></iframe>
            </div>
          </div>
          <div class="mt-6 text-center">
            <a
              href="https://www.youtube.com/watch?v=jKHS5_ObPYc&list=PL2TEs6eelwhfLxHTn2hyXDiYdKuh1Upv-"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-green">More Blend Tutorials <span class="material-symbols-rounded external-icon">open_in_new</span></a>
          </div>
        </div>
        <div class="demo-links-panel">
          <img src={schwaDayKickoff} alt="Schwa Day Official Kickoff Celebration" class="kickoff-svg" />
          <p>
            In March, we hosted a webinar together with Phonics Read-Alouds as the official kickoff of Schwa Day. Watch the recording and check out
            the slides below for resource links and exclusive discounts!
          </p>
          <div class="demo-link-actions">
            <h2>
              Passcode: <span class="font-mono">M.T5Qm$1</span>
            </h2>
            <a
              href="https://us06web.zoom.us/webinar/register/WN_BmDMcx59SlGQvKOHNEJANQ#/registration"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-purple"
              >Watch Webinar Recording
              <span class="material-symbols-rounded external-icon">open_in_new</span></a>
            <a
              href="https://drive.google.com/file/d/1FtzC9Jt6686_n0bDbUMt4aBEiYpWu59Z/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outlined">View Webinar Slides <span class="material-symbols-rounded external-icon">open_in_new</span></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources Section -->
    <div class="resources" id="resources">
      <div class="title">
        <h2>Explore More</h2>
      </div>
      <div class="other-resources-list">
        <!-- Phonics Read-Alouds Discount -->
        <div class="item">
          <div class="side-by-side">
            <span class="material-symbols-rounded item-icon">local_offer</span>
            <div class="item-text">
              <h2>Save 15% on Phonics Read-Alouds</h2>
              <p>Get 15% off everything in the Phonics Read-Alouds shop through April 15th with code <strong>BLENDFRIEND</strong>!</p>
              <a href="https://phonicsreadalouds.com/discount/BLENDFRIEND" target="_blank" class="external-link">
                Visit Phonics Read-Alouds Shop
                <span class="material-symbols-rounded external-icon">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Save on Blend Pro -->
        <div class="item">
          <div class="side-by-side">
            <span class="material-symbols-rounded item-icon">card_giftcard</span>
            <div class="item-text">
              <h2>Save on Blend Pro</h2>
              <p>
                You can get 20% off Blend Pro for life with this exclusive discount! Every subscription using the link below gives back to Phonics
                Read-Alouds.
              </p>
              <a href="https://blendreading.com/partners/-OUfwTgMYAwAkveggMKq" class="external-link"> Get 20% Off Blend Pro </a>
            </div>
          </div>
        </div>

        <!-- Check Out The Not So Lazy Schwa -->
        <div class="item">
          <div class="side-by-side">
            <span class="material-symbols-rounded item-icon">auto_stories</span>
            <div class="item-text">
              <h2>Check Out The Not So Lazy Schwa</h2>
              <p>
                Explore the story that inspired these resources! Visit Phonics Read-Alouds to discover the full collection of stories and teaching
                aids.
              </p>
              <a href="https://phonicsreadalouds.com/products/the-not-so-lazy-schwa-book" target="_blank" class="external-link">
                Visit Phonics Read-Alouds site
                <span class="material-symbols-rounded external-icon">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        <!-- National Schwa Day -->
        <div class="item">
          <div class="side-by-side">
            <span class="material-symbols-rounded item-icon">event</span>
            <div class="item-text">
              <h2>Learn About National Schwa Day</h2>
              <p>
                Curious about the history and significance of this holiday? Visit the official National Schwa Day website to learn more about this
                special day.
              </p>
              <a href="https://nationalschwaday.org/" target="_blank" class="external-link">
                Visit National Schwa Day site
                <span class="material-symbols-rounded external-icon">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .static-confetti-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
    overflow: hidden;
  }

  .static-confetti {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    opacity: 0.4;
  }

  .static-confetti-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }

  .static-confetti {
    position: absolute;
    opacity: 0.4;
  }

  .static-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .static-square {
    width: 14px;
    height: 14px;
    border-radius: 2px;
  }

  .static-star {
    font-size: 16px;
    line-height: 1;
    opacity: 0.5;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #abe6ee 0%, #d4f1f9 50%, #c6fdff 100%);
    padding: 2rem;
    position: relative;
  }

  .content {
    position: relative;
    z-index: 2;
    width: 80%;
    text-align: left;
  }

  .header {
    padding: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    font-weight: bolder;
    color: #588dff;
  }

  .description {
    width: 45%;
    flex-basis: 35rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .demo-section {
    padding: 2rem;
    text-align: center;
  }

  .demo-subtitle {
    font-size: 1.1rem;
    margin: 0.5rem 0 2rem 0;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(18rem, 1fr);
    gap: 1.5rem;
    align-items: stretch;
  }

  .demo-video-panel,
  .demo-links-panel {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    padding: 1.25rem;
  }

  .demo-links-panel {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .kickoff-svg {
    width: 100%;
    margin-bottom: 0.75rem;
  }

  .demo-links-panel p {
    margin: 0.75rem 0 1rem 0;
    color: #555;
  }

  .demo-link-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .video-container {
    width: 100%;
    margin: 0;
  }

  .resources {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  .resource-title {
    text-align: center;
    margin-bottom: 2rem;
  }

  .resource-title h2 {
    font-family: 'Contrail One';
    font-size: 2.2rem;
    margin: 0 0 1rem 0;
    color: #333;
  }

  .resource-title p {
    font-size: 1.1rem;
    margin: 0;
    color: #555;
  }

  .carousel-container {
    width: 100%;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .carousel {
    display: flex;
    transition: transform 0.4s ease-in-out;
    transform: translateX(0px);
  }

  .resource-item {
    box-sizing: content-box;
    flex: 0 0 auto;
    width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    margin: 0 1.25rem;
    background: white;
    border-radius: 10px;
  }

  .carousel-controls {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .carousel-controls button {
    background-color: #588dff !important;
    color: white !important;
    border: none !important;
  }

  .carousel-controls button:hover:not(:disabled) {
    background-color: #4a7ae8 !important;
  }

  .carousel-controls button:disabled {
    background-color: #ccc !important;
    color: #888 !important;
  }

  .swipe-hint {
    display: none;
    text-align: center;
    margin-top: 1rem;
  }

  .resource-item h3 {
    font-family: 'Contrail One';
    font-size: 1.8rem;
    margin: 0 0 1rem 0;
    text-align: center;
    color: #333;
  }

  .resource-item p {
    text-align: center;
    margin: 0 0 1rem 0;
    color: #555;
  }

  .resource-preview {
    width: 100%;
    height: 10rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resources .title {
    text-align: center;
    margin-bottom: 2rem;
  }

  .resources .title h2 {
    font-family: 'Contrail One';
    font-size: 2.2rem;
    margin: 0;
  }

  .other-resources-list {
    margin: 1rem;
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .item {
    display: flex;
    flex-direction: column;
    flex-basis: 25rem;
    padding: 0 0 2rem 0;
  }

  .item-icon {
    font-size: 2.4rem;
    color: #1565c0;
  }

  .item-text {
    width: 80%;
  }

  .item-text h2 {
    font-family: 'Contrail One';
    font-size: 1.4rem;
    margin: 0.5rem 0;
  }

  .item-text p {
    margin-top: 0;
  }

  .external-link {
    color: #1565c0;
    text-decoration: underline;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 0.2s;
  }

  .external-link:hover {
    opacity: 0.8;
  }

  .external-icon {
    font-size: 1.2rem;
  }

  .btn:disabled {
    background: none !important;
    border: #666 1px solid;
    color: #666 !important;
    filter: none;
    cursor: not-allowed;
  }

  .btn:disabled:hover {
    background: none !important;
    filter: none;
  }

  @media (max-width: 768px) {
    .content {
      width: 90%;
    }

    .header .side-by-side {
      flex-direction: column;
    }

    .description {
      width: 100%;
    }

    .demo-grid {
      grid-template-columns: 1fr;
    }

    .carousel-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      overflow: visible;
    }

    .carousel {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 1.5rem;
      transition: none;
      transform: none !important;
    }

    .resource-item {
      width: 100%;
      max-width: 400px;
      margin: 0;
      padding: 1rem;
      flex: none;
    }

    .resource-item h3 {
      font-size: 1.2rem;
    }

    .carousel-controls {
      display: none;
    }

    .swipe-hint {
      display: none;
    }
  }

  @media (max-width: 480px) {
    main {
      margin: 0;
      padding: 0 1rem;
      width: 100%;
    }

    .content {
      margin: 0;
      padding: 0;
      width: 100%;
    }

    .header,
    .demo-section,
    .resources {
      margin: 0;
      padding: 1rem;
    }

    .resource-title h2 {
      font-size: 1.8rem;
    }

    .side-by-side {
      flex-direction: column;
    }

    .carousel-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin: 0;
      padding: 0;
      overflow: visible;
    }

    .carousel {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 1rem;
      transition: none;
      transform: none !important;
    }

    .resource-item {
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0.75rem;
      flex: none;
    }

    .resource-item h3 {
      font-size: 1rem;
    }

    .resource-item p {
      font-size: 0.75rem;
    }

    .carousel-controls {
      display: none;
    }

    .swipe-hint {
      display: none;
    }
  }
</style>
