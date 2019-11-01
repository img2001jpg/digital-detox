<template>
  <div id="weather">
    <transition name="fade" mode="out-in">
      <span v-if="weather">
        {{ city }}, {{ country }}<br>
        <img class="weather-icon" :src="weatherIcon" /> {{ temperature }}° C, {{ weatherDescription }}
      </span>
    </transition>
  </div>
</template>
<script>
export default {
  props: ['coordinates'],
  name: 'Weather',
  data () {
    return {
      weather: null
    }
  },
  methods: {
    async fetchWeather  () {
      const weather = await this.$axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${this.coordinates[1]}&lon=${this.coordinates[0]}&appid=3ad20da63cd74faf6d6a420ec20bb9a9&units=metric`)
      this.weather = weather.data
    }
  },
  computed: {
    city () {
      if (!this.weather) { return }
      return this.weather.name
    },
    country () {
      if (!this.weather) { return }
      return this.weather.sys.country
    },
    temperature () {
      if (!this.weather) { return }
      return this.weather.main.temp.toFixed(0)
    },
    weatherDescription () {
      if (!this.weather) { return }
      return this.weather.weather[0].description
    },
    weatherIcon () {
      if (!this.weather) { return }
      return `https://openweathermap.org/img/wn/${this.weather.weather[0].icon}@2x.png`
    }
  },
  mounted () {
    this.fetchWeather()
  }
}
</script>
