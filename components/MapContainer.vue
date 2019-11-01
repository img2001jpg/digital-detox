<template>
  <div
    id="map"
    :style="{
      height: windowHeight + 'px'
    }"
    :class="{
      'visible': $store.state.mapLoaded,
      'is-scrolling': isScrolling,
      'no-events': $store.state.noEvents
    }"
  >
    <AboutIcon @click.native="$store.commit('showAbout')" v-if="$store.state.introAnimationDone"/>
    <transition name="fade" mode="out-in">
      <AboutContainer v-if="$store.state.showAbout && !$store.state.noEvents"/>
      <Weather
        v-if="!$store.state.showAbout && !$store.state.noEvents"
        :coordinates="coordinates"
      />
    </transition>
    <MglMap
      v-if="connected"
      ref="map"
      :accessToken="accessToken"
      :mapStyle="mapStyle"
      :zoom="zoom"
      :minZoom="minZoom"
      :maxZoom="maxZoom"
      :pitch="pitch"
      :bearing="bearing"
      :interactive="interactive"
      :center="startCoordinates"
      @load="onMapLoaded"
    >
      <MglGeojsonLayer
        :sourceId="geoJsonSource.data.id"
        :source="geoJsonSource"
        layerId="somethingSomething"
        :layer="geoJsonLayer"
      />
      <MglMarker
        :coordinates.sync="coordinates"
        color="blue"
      >
      </MglMarker>
      <transition name="fade">
        <div class="speed-meter" v-if="isScrolling && currentSpeed > 0 && !$store.state.showAbout && !$store.state.noEvents">{{ currentSpeed }} km/h</div>
      </transition>
      <ProgressBar
        :class="{
          'visible': !$store.state.noEvents && !$store.state.showAbout
        }"
        :currentDistance="currentDistance"
        :fullDistance="fullDistance"
      />
    </MglMap>
  </div>
</template>

<script>
import * as turf from '@turf/turf'
import Mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MglMap, MglGeojsonLayer, MglMarker } from 'vue-mapbox'
import { mapGetters } from 'vuex'
import { camino } from '../assets/geojson/caminofrances'
import AboutContainer from './AboutContainer.vue'
import AboutIcon from './AboutIcon.vue'
import ProgressBar from './ProgressBar.vue'

export default {
  components: {
    AboutContainer,
    AboutIcon,
    MglMap,
    MglGeojsonLayer,
    MglMarker,
    ProgressBar
  },
  data () {
    return {
      windowHeight: null,
      connected: false,
      minZoom: 6,
      maxZoom: 18,
      pitch: 45,
      bearing: 45,
      zoom: 16,
      interactive: true,
      showPopup: true,
      accessToken: 'pk.eyJ1IjoiaW1nMjAwMSIsImEiOiJjamZnejh1OGIyZmh0MnptaWhvOGdrdjh4In0.COQxneZDAQIPys3psF0ehw',
      mapStyle: 'mapbox://styles/img2001/ck0tn5ow313551cm6e101b31b',
      coordinates: [-1.2357903, 43.1634167],
      startCoordinates: [-1.2357903, 43.1634167],
      // aboutCoordinates: [-5.8412128, 44.3750478],
      aboutCoordinates: [-1.6874461, 43.0524282],
      currentDistance: 0,
      currentSpeed: null,
      lastScrollTime: null,
      oldVal: 0,
      mapActions: null,
      isScrolling: false,
      isTransitioning: false,
      timer: null,
      geoJsonSource: {
        type: 'geojson',
        data: camino
      },
      geoJsonLayer: {
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#FFFF00',
          'line-width': 6
        }
      }
    }
  },
  computed: {
    ...mapGetters(['showAbout']),
    lineStr () {
      const arr = []
      this.geoJsonSource.data.features.forEach((feature) => {
        feature.geometry.coordinates.forEach((data) => {
          arr.push(data.slice(0, -1).reverse())
        })
      })
      return turf.lineString(arr)
    },
    fullDistance () {
      return turf.length(this.lineStr, { units: 'kilometres' })
    },
    daysSinceStart () {
      const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
      const startDay = new Date(2019, 1, 27)
      const today = new Date()
      const daysSinceStart = Math.round(Math.abs((startDay.getTime() - today.getTime()) / oneDay))
      return daysSinceStart
    },
    averageScrollPerDay () {
      return this.currentDistance / this.daysSinceStart
    },
    distanceLeftInKm () {
      return this.fullDistance - this.currentDistance
    },
    eta () {
      const daysToGo = this.distanceLeftInKm / this.averageScrollPerDay
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() + daysToGo)
      const dd = targetDate.getDate()
      const yyyy = targetDate.getFullYear()
      const month = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][targetDate.getMonth()]
      function nth (dd) {
        if (dd > 3 && dd < 21) { return 'th' }
        switch (dd % 10) {
          case 1: return 'st'
          case 2: return 'nd'
          case 3: return 'rd'
          default: return 'th'
        }
      }
      return month + ' ' + dd + nth(dd) + ', ' + yyyy
    }
  },
  methods: {
    onMapLoaded (event) {
      this.$store.commit('mapLoaded')
      this.mapActions = event.component.actions
      this.flyTo(this.coordinates, 1)
      const vm = this
      event.map.on('movestart', function () {
        if (vm.isTransitioning) {
          vm.$store.commit('noEvents', true)
        }
      })
      event.map.on('moveend', function () {
        vm.$store.commit('noEvents', false)
        vm.$store.commit('introAnimationDone', true)
        vm.isTransitioning = false
      })
    },
    flyTo (coordinates, duration) {
      this.isTransitioning = true
      this.mapActions.flyTo({
        center: coordinates,
        zoom: 16,
        bearing: 0,
        pitch: 0,
        curve: 0.7,
        speed: duration
      })
    },
    moveAlongLine (distance) {
      const along = turf.along(this.lineStr, distance)
      this.coordinates = along.geometry.coordinates.reverse()
    }
  },
  watch: {
    currentDistance (val, oldVal) {
      this.moveAlongLine(val)
      if (!this.lastScrollTime) {
        this.lastScrollTime = new Date()
        this.oldVal = val
      } else {
        const currentTime = new Date()
        const diffInSec = Math.abs(this.lastScrollTime.getTime() - currentTime.getTime()) / 1000
        const diffInHours = Math.abs(this.lastScrollTime.getTime() - currentTime.getTime()) / 36e5
        if (diffInSec >= 1.5) {
          const distanceInKm = val - this.oldVal
          const speed = distanceInKm / diffInHours
          this.lastScrollTime = new Date()
          this.oldVal = val
          this.currentSpeed = speed.toFixed(1)
        }
      }
    },
    showAbout (val) {
      if (val) {
        this.flyTo(this.aboutCoordinates, 1.5)
      } else {
        this.flyTo(this.coordinates, 1.5)
      }
    },
    averageScrollPerDay (val) {
      const metres = val * 1000
      this.$store.commit('averageScrollPerDay', metres)
    },
    eta (val) {
      this.$store.commit('eta', val)
    }
  },
  sockets: {
    init (val) {
      this.currentDistance = val
      this.connected = true
    },
    scrollval (val) {
      const vm = this
      vm.currentDistance = val
      vm.isScrolling = true
      clearTimeout(vm.timer)
      vm.timer = setTimeout(() => {
        vm.isScrolling = false
      }, 3000)
    }
  },
  mounted () {
    const vm = this
    vm.mapbox = Mapbox
    vm.windowHeight = window.innerHeight
    console.log(window.innerHeight)
    window.addEventListener('resize', () => { vm.windowHeight = window.innerHeight })
    if (window.innerWidth <= 768) {
      vm.$store.commit('noEvents', false)
      vm.$store.commit('introAnimationDone', true)
    }
  }
}
</script>
