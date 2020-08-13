<template>
  <v-app
    dark
    :class="{
      'app-background': true,
      'app-background-portrait': appOrientation === 'portrait',
      'app-background-landscape': appOrientation === 'landscape'
    }"
  >
    <v-content>
      <v-container>
        <v-layout
          style="max-width: 600px; position: relative;"
          class="mx-auto pt-5"
          column
          align-center
        >
          <a href="/" class="d-flex justify-center align-center">
            <img
              src="~assets/img/logo.jpg"
              class="mx-auto"
              style="width: 294px; max-width: 60%;"
              alt="Logo"
            >
          </a>

          <h1
            :class="[
              $vuetify.breakpoint.xsOnly ? 'headline' : 'display-1',
              'mt-2'
            ]"
            style="letter-spacing: 4px; font-weight: 300;"
          >
            YouTube DOWNLOAD
          </h1>

          <nuxt />
        </v-layout>
        <!-- App 600px -->
      </v-container>
    </v-content>
    <!-- <v-footer
      app
    >
      <span>&copy; 2019</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      appOrientation: ''
    }
  },

  created() {
    window.addEventListener('resize', this.calculateScreenDimension)
  },

  mounted() {
    this.calculateScreenDimension()
  },

  destroyed() {
    window.removeEventListener('resize', this.calculateScreenDimension)
  },

  methods: {
    calculateScreenDimension() {
      console.info('Checking for dimensions')
      if (window.innerHeight > window.innerWidth) {
        // portrait
        this.appOrientation = 'portrait'
      } else {
        // landscape
        this.appOrientation = 'landscape'
      }
    }
  }
}
</script>
