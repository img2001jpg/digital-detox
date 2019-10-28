import Vue from 'vue'

import VueSocketIO from 'vue-socket.io'
import Logo from '../components/Logo.vue'
import MapContainer from '../components/MapContainer.vue'

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'https://digitaldetox.marco.land'
}))

Vue.component('MapContainer', MapContainer)
Vue.component('Logo', Logo)
