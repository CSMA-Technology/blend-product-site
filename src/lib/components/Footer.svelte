<script lang="ts">
  import logo from '$lib/assets/blend_logo.png';
  import facebook from '$lib/assets/footer/facebook.png';
  import instagram from '$lib/assets/footer/instagram.png';
  import newsletter from '$lib/assets/footer/email_newsletter.svg';
  import youtube from '$lib/assets/footer/youtube.png';
</script>

<footer>
  <div class="footer-content">
    <div class="footer-logo">
      <img src={logo} alt="Blend Logo" />
    </div>
    <div class="footer-section">
      <h2>BLEND READING</h2>
      <a class="text-sm" href="mailto:support@blendreading.com">support@blendreading.com</a>
      <p style="font-size: 0.8rem; margin-top: 0.4rem;">© Blend Reading 2023</p>
    </div>
    <div class="footer-section">
      <h2>USEFUL LINKS</h2>
      <ul>
        <li><a href="/help/report-an-issue">Report an Issue</a></li>
        <li><a href="/help/feedback">Submit Feedback</a></li>
        <li><a href="/info/data-deletion">Data Deletion Request</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h2>ABOUT US</h2>
      <ul>
        <li>
          <a href="/about">Meet the Team</a>
        </li>
        <li>
          <a href="/partners">Partner Program</a>
        </li>
        <li><a href="/info/privacy-policy">Privacy Policy</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h2 style="text-align: center;">STAY IN TOUCH</h2>
      <div class="social-media">
        <a href="https://www.facebook.com/blendreading" target="_blank" rel="noopener noreferrer"><img src={facebook} alt="facebook logo" /></a>
        <a href="https://www.instagram.com/blendreading/" target="_blank" rel="noopener noreferrer"><img src={instagram} alt="instagram logo" /></a>
        <a href="https://www.youtube.com/@blendreading" target="_blank" rel="noopener noreferrer"><img src={youtube} alt="youtube icon" /></a>
        <a href="/newsletter"><img src={newsletter} alt="email newsletter icon" /></a>
      </div>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: white;
    width: 100%;
    margin-top: auto;
  }

  .footer-logo {
    flex-basis: 8rem;
  }

  .footer-logo img {
    height: 7rem;
  }

  .footer-section {
    flex-basis: 18rem;
    display: flex;
    flex-direction: column;
  }

  .footer-section > p {
    font-size: medium;
  }

  .social-media {
    display: flex;
    gap: 1rem;
    margin: 0.2rem auto 0 auto;
  }

  .social-media img {
    height: 2rem;
  }

  p {
    margin: 0;
  }

  .footer-content {
    padding: 1.2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
    row-gap: 1rem;
  }

  ul {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
  }
  li {
    font-size: medium;
    width: fit-content;
  }
  li > a {
    font-size: medium;
    font-weight: normal;
  }

  h2 {
    font-family: 'Contrail One';
    font-weight: 500;
  }

  @media (max-width: 480px) {
    .footer-section {
      flex-basis: 9rem;
    }
    .footer-logo {
      margin: auto 0;
    }
  }
</style>
