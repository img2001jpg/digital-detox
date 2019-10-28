<template>
  <div
    class="progress-bar"
  >
    <span
      class="indicator"
      :style="{
        width: percentage + '%'
      }"
    />
    <span class="text">{{ currentDistance.toFixed(3) }} / {{ fullDistance.toFixed(3) }} metres scrolled ({{ percentage }}%)</span>
  </div>
</template>
<script>
export default {
  props: ['currentDistance', 'fullDistance'],
  computed: {
    percentage () {
      const percentage = this.currentDistance / this.fullDistance * 100
      return percentage.toFixed(2)
    }
  }
}
</script>
