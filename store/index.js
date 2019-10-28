export const state = () => ({
  mapLoaded: false,
  noEvents: true,
  showAbout: false,
  introAnimationDone: false
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
    state.introAnimationDone = state
  }
}

export const getters = {
  showAbout (state) {
    return state.showAbout
  }
}
