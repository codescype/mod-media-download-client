<template>
  <v-flex xs11>
    <v-layout
      class="text-xs-center"
      column
      justify-center
      align-center
    >
      <img
        v-if="data.code === 'auth-data/network-request-failed'"
        src="~assets/img/icons/status/icons8-offline-96.png"
        style="height: 96px; width: 96px;"
      >
      <img
        v-else
        src="~assets/img/icons/status/icons8-error-96.png"
        style="height: 96px; width: 96px;"
      >

      <h1
        v-if="error.statusCode === 404"
        class="display-1 text--secondary"
      >
        Page not found
      </h1>

      <v-layout
        v-else-if="data.code === 'auth-data/network-request-failed'"
        justify-center
        align-items-center
        column
      >
        <h1
          class="display-1 text--secondary"
        >
          Network error!
        </h1>
        <p class="title text--secondary">
          Please check your connection it might be unstable/lost!
        </p>

        <v-flex>
          <v-btn
            :to="data.continueUrl"
            class="mt-3 flex-grow-none"
            nuxt
            dark
            large
            color="accent"
          >
            <v-icon left>
              refresh
            </v-icon> Retry
          </v-btn>
        </v-flex>
      </v-layout>

      <h1
        v-else
        class="display-1 text--secondary"
      >
        An error occurred!
      </h1>

      <nuxt-link
        v-if="data.code !== 'auth-data/network-request-failed'"
        to="/"
        class="mt-3"
      >
        Back to safety
      </nuxt-link>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'ErrorPage',

  head: {
    title: 'Error'
  },

  props: {
    error: {
      type: Object,
      default() {
        return {
          message: '{ "code": "unknown/unknown" }'
        }
      }
    }
  },

  computed: {
    data() {
      try {
        return JSON.parse(this.error.message)
      } catch (error) {
        console.error(error)
        return {
          message: '{ "code": "unknown/unknown" }'
        }
      }
    }
  }
}
</script>
