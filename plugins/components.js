import Vue from 'vue'

import VueSocketIO from 'vue-socket.io'
import Logo from '../components/Logo.vue'
import MapContainer from '../components/MapContainer.vue'
import Weather from '../components/Weather.vue'

const isDev = process.env.NODE_ENV !== 'production'

Vue.use(new VueSocketIO({
  debug: isDev,
  connection: 'https://digitaldetox.socket.marco.land'
}))

Vue.component('MapContainer', MapContainer)
Vue.component('Logo', Logo)
Vue.component('Weather', Weather)
