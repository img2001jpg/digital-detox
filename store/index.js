export const state = () => ({
  mapLoaded: false,
  noEvents: true,
  showAbout: false,
  introAnimationDone: false,
  averageScrollPerDay: null,
  eta: null
})

export const mutations = {
  mapLoaded (state) {
    state.mapLoaded = true
  },
  noEvents (state, val) {
    state.noEvents = val
  },
  showAbout (state) {
    state.showAbout = !state.showAbout
  },
  introAnimationDone (state) {
    state.introAnimationDone = true
  },
  averageScrollPerDay (state, val) {
    state.averageScrollPerDay = val
  },
  eta (state, val) {
    state.eta = val
  }
}

export const getters = {
  showAbout (state) {
    return state.showAbout
  }
}
