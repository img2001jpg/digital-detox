<template>
  <div
    class="logo-wrapper"
    :class="{
      'show-intro': !$store.state.introAnimationDone && !$store.state.showAbout
    }"
  >
    <h1 class="script">
      Digital Detox
    </h1>
    <h2>Scrolling along the Way of St. James</h2>
  </div>
</template>
