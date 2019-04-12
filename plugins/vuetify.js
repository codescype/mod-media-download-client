import Vue from 'vue'
import Vuetify, {
  VApp,
  // VGrid,
  VBtn,
  VIcon,
  VTextField,
  VAutocomplete,
  VDivider,

  // transitions
  VFadeTransition,
  VScaleTransition,
  VSlideXTransition,
  VSlideXReverseTransition,
  VSlideYTransition,
  VSlideYReverseTransition
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'
// import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  components: {
    VApp,
    // VGrid,
    VBtn,
    VIcon,
    VTextField,
    VAutocomplete,
    VDivider,

    // transitions
    VFadeTransition,
    VScaleTransition,
    VSlideXTransition,
    VSlideXReverseTransition,
    VSlideYTransition,
    VSlideYReverseTransition
  },
  directives: {
    Ripple
  },
  theme: {
    primary: '#F44336',
    secondary: '#757575',
    accent: '#f4a236',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  options: {
    customProperties: true
  }
})
