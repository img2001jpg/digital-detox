<template>
  <div id="about-container">
    <div class="inner">
      <section>
        <h3 class="script indent">
          What is this?
        </h3>
        <p>I built a Google Chrome extension that tracks my personal scrolling distance on any website and sends the data to this page in real time. Every scrolled centimeter on any website will move the marker along the <a href="https://en.wikipedia.org/wiki/Camino_de_Santiago" target="_blank">Camino Francés</a>, the most popular pilgrimage route of the Way of St. James. I'm not actually walking anywhere.</p>
      </section>
      <section>
        <h3 class="script indent">
          How long will it take?
        </h3>
        <p>My journey began on Feb 27th, 2019. On average, I currently scroll {{ $store.state.averageScrollPerDay.toFixed(0) }} m/day which means I will arrive on {{ $store.state.eta }}. Feel free to <a href="mailto:mail@marco.land">contact me</a> if you have any other questions.</p>
      </section>
      <!-- <section>
        <h3 class="script indent">Get a postcard!</h3>
      </section> -->
      <section>
        <h3 class="script indent">
          Technologies
        </h3>
        <p>
          <a href="https://developer.chrome.com/extensions" target="_blank">Google Chrome Extensions</a>, <a href="http://mapbox.com" target="_blank">Mapbox</a>, <a href="https://nuxtjs.org" target="_blank">Nuxt.js</a>, <a href="https://socket.io/" target="_blank">Socket.io</a><br>
          Map credits: © Mapbox © OpenStreetMap © DigitalGlobe
        </p>
      </section>
      <section>
        <h3 class="script indent-small">
          Imprint
        </h3>
        <p>
          Marco Land<br>
          Genter Strasse 4<br>
          13353 Berlin Germany<br>
          <a href="mailto:mail@marco.land">mail@marco.land</a><br>
          <br>
          <a href="https://marco.land/imprint" target="_blank">Data Privacy</a>
        </p>
      </section>
    </div>
  </div>
</template>
