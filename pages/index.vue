<template>
  <div class="container">
    <transition name="fade" mode="out-in">
      <Logo v-if="$store.state.mapLoaded && !$store.state.showAbout" />
    </transition>
    <MapContainer />
  </div>
</template>

<script>
export default {
}
</script>
