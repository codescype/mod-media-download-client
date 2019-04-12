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
        <v-layout class="pt-5" justify-center>
          <v-layout
            style="max-width: 600px; position: relative;"
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

            <v-layout justify-center class="w-100 mt-5">
              <!-- TODO: Fix search not syncing to v-model/query -->
              <v-autocomplete
                v-model="query"
                :items="preResults"
                :loading="preSearching"
                :search-input.sync="search"
                hide-no-data
                hide-selected
                no-filter
                item-text="snippet.title"
                item-value="snippet.title"
                autofocus
                dense
                placeholder="Search"
                single-line
                solo-inverted
                hide-details
                class="w-100 search-bar"
                :menu-props="{ contentClass: 'search-menu' }"
                color="primary"
                @keyup.enter="fullSearch(search)"
              />

              <v-btn
                :class="{ 'px-1': $vuetify.breakpoint.xsOnly }"
                :disabled="!search"
                color="primary"
                class="search-btn ma-0"
                style="height: auto;"
                @click="fullSearch(search)"
              >
                <v-icon>search</v-icon>
              </v-btn>
            </v-layout>

            <p class="caption mt-2" style="opacity: 0.8">
              By pressing the 🔍 button, you agree to all of our
              <a href="/music/download/terms-and-conditions">
                terms and conditions
              </a>
            </p>

            <!-- <v-btn
            v-bind="{ depressed: !showAdvanced }"
            color="transparent"
            @click="showAdvanced = !showAdvanced"
            small
          >Advanced
            <v-icon right small
              v-text="showAdvanced
                ? 'arrow_drop_down' : 'arrow_drop_up'"
            ></v-icon>
          </v-btn> -->

            <!--
              TODO: Make into its own component
                Make it shown always
                But toggles between play and paused state
             -->
            <v-scale-transition>
              <div v-if="isLoading" class="app-loader mt-4">
                <div
                  v-for="i in 10"
                  :key="i"
                  :class="`rectangle_${i}`"
                  :style="{
                    animationPlayState: isLoading ? 'running' : 'paused'
                  }"
                />
              </div>
            </v-scale-transition>

            <p
              v-if="queried && results.length <= 0"
              class="mt-5 black-transparent pa-2 rounded-1"
            >
              Sorry. We found <strong>0 results</strong> for your query
              {{ query }}
            </p>

            <p
              v-else-if="queried && results.length > 0"
              class="mt-5 black-transparent pa-2 rounded-1"
            >
              Here you can find all search results for your search query
              {{ query }}. We've found {{ results.length }} matching results.
              Now you have the opportunity to listen to each result before
              downloading it. If you wish to do so, click on the
              <b>Play</b> button.
            </p>

            <template v-if="results">
              <search-result
                v-for="(result, i) in results"
                :key="i"
                :result="result"
              />
            </template>

            <p class="mt-5 black-transparent rounded-1 pa-2">
              Welcome to MOD-mp3 - a popular and free mp3 search engine and
              tool. Just type in your search query, choose the sources you would
              like to search on and click the search button. The search will
              take only a short while (if you select all sources it may take a
              bit longer). As soon as we find any results matching your search
              query - you will get a list of your results. It is that simple.
              <br><br>

              Alternatively, you can also paste in a video URL and click the
              search button to convert a video's audio into an mp3. Once you
              click the search button the conversion of the video will start. As
              soon it is ready you will be able to download the converted
              file.<br><br>

              The usage of our website is free and does not require any software
              or registration. By using our website you accept our
              <a href="/music/download/terms-and-conditions"> Terms of Use </a>.
              <br><br>

              Have fun and enjoy the use of our website.
            </p>

            <v-fab-transition>
              <v-btn
                color="primary"
                dark
                fixed
                bottom
                right
                fab
                small
                class="fab-search"
                @click="focusOnSearch"
              >
                <v-icon>search</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-layout>
          <!-- App 600px -->
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
.search-bar {
  position: relative;
}

.search-bar::before,
.bg-blend::before {
  content: '';
  position: absolute;
  display: block;
  height: 100%;
  width: 100%;
  mix-blend-mode: overlay;
}

.search-bar::before {
  filter: blur(2px);
}

.search-bar::before {
  background: rgba(255, 255, 255, 0.9) !important;
}

.glass {
  position: relative;
  overflow: hidden;
}

.glass > * {
  position: relative;
}

.glass::before {
  height: 100vh;
  width: 100vw;
  display: block;
  position: absolute;
  content: '';
  background: url('~assets/img/background/background-blur-1242x2208.jpg')
    no-repeat bottom right fixed;
  background-size: cover;
}

@media screen and (min-width: 600px) {
  .glass::before {
    background-image: url('~assets/img/background/background-blur-2560x1440.jpg');
  }
}

.app-background-portrait .glass::before {
  background-image: url('~assets/img/background/background-blur-1242x2208.jpg');
}

.app-background-landscape .glass::before {
  background-image: url('~assets/img/background/background-blur-2560x1440.jpg');
}

.search-bar .v-input__slot {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.search-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  /* disable vuetify btn min-width 88px */
  min-width: 48px;
}

@media screen and (min-width: 600px) {
  .search-btn {
    /* enable vuetify btn min-width 88px */
    min-width: 88px;
  }
}

.fab-search {
  opacity: 0.8;
  right: 12px;
}

@media screen and (min-width: 612px) {
  .fab-search {
    right: calc(50vw - 300px);
  }
}

.app-loader {
  width: 100%;
  height: 80px;
  text-align: center;
  font-size: 10px;
}
.app-loader.app-loader-condensed {
  height: 40px;
}
.app-loader > div {
  background-color: #f44336;
  height: 100%;
  width: 5px;
  border-radius: 5px/25px;
  display: inline-block;
  margin: auto 1.5px;
  box-shadow: 0 0 3px rgba(244, 67, 54, 0.2);
  animation: stretchdelay 1.5s 0.2s ease-in-out infinite;
}
.app-loader .rectangle_1 {
  animation-delay: -1.5s;
}
.app-loader .rectangle_10 {
  animation-delay: -1.4s;
}
.app-loader .rectangle_2 {
  animation-delay: -1.25s;
}
.app-loader .rectangle_9 {
  animation-delay: -1.15s;
}
.app-loader .rectangle_3 {
  animation-delay: -0.9s;
}
.app-loader .rectangle_8 {
  animation-delay: -1s;
}
.app-loader .rectangle_4 {
  animation-delay: -0.75s;
}
.app-loader .rectangle_7 {
  animation-delay: -0.65s;
}
.app-loader .rectangle_5 {
  animation-delay: -0.5s;
}
.app-loader .rectangle_6 {
  animation-delay: -0.35s;
}

.elevate-on-interact {
  transition: all 0.3s ease-out;
}

.elevate-on-interact:hover,
.elevate-on-interact:focus,
.elevate-on-interact:focus-within {
  box-shadow: 0px 8px 9px -5px rgba(244, 67, 54, 0.1),
    0px 9px 9px -6px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.16),
    0px 6px 28px 5px rgba(0, 0, 0, 0.14) !important;
  /* FIXME: Fix background-attachment changing on translate in firefox */
  transform: translateY(-3px);
}
</style>

<script>
import SearchResult from '@/components/SearchResult.vue'

// import staticResults from '@/results'

export default {
  name: 'App',

  components: { SearchResult },

  data() {
    return {
      appOrientation: '',
      searchDescriptionLimit: 60,
      query: '',
      search: '',
      preResults: [],
      preSearching: false,
      isLoading: false,
      queried: false,
      results: []
      // showAdvanced: false
    }
  },

  watch: {
    search(val) {
      if (!this.search) return

      this.preSearching = true

      // Lazily load input items
      this.fetch(val)
        .then(results => {
          this.preResults = results
          this.preSearching = false
        })
        .catch(error => console.error(error))
    },

    query(val) {
      if (!val) return

      this.fullSearch(val)
    }
  },

  created() {
    window.addEventListener('resize', this.calculateScreenDimension)
  },

  mounted() {
    this.calculateScreenDimension()
  },

  methods: {
    fullSearch(query) {
      if (!query) return

      this.isLoading = true
      this.queried = false

      this.fetch(query, { maxResults: 10, getFilesInfo: true })
        .then(results => {
          if (!results) {
            return (this.results = [])
          }
          // results.map(result => (result.player = {}));
          results.map(result =>
            Object.assign(result, {
              player: {},
              // downloader: { downloadType: "" }
              downloader: {}
            })
          )
          this.results = results
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false
          this.queried = true
        })
    },

    fetch(query, options) {
      if (!query) return

      return this.fetchFromYoutube(query, options)
        .then(response => response)
        .catch(error => console.error(error))
    },

    fetchFromYoutube(query, options = {}) {
      // For offline test or When past access
      // return new Promise(resolve => resolve(staticResults))

      const { maxResults, getFilesInfo } = Object.assign(
        { maxResults: 5, getFilesInfo: false },
        options
      )
      return (
        this.$axios
          // TODO: Get axios proxy to work
          // .get('/api/search', {
          .get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              type: 'video',
              key: 'AIzaSyC1gJcdNljp3rzyzCwPuKgdWS0XkjHQ21s',
              q: query,
              maxResults
            }
          })
          .then(response => {
            if (!getFilesInfo) return response.data.items
            const promises = response.data.items.map(async item => {
              item.contentDetails = await this.fetchYoutubeVideoDetails(
                item.id.videoId
              )
                .then(contentDetails => contentDetails)
                .catch(error => console.error(error))
              return item
            })
            return Promise.all(promises).then(results => results)
          })
          .catch(error => console.error(error))
      )
    },

    fetchYoutubeVideoDetails(id) {
      return this.$axios
        .get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'contentDetails',
            key: 'AIzaSyC1gJcdNljp3rzyzCwPuKgdWS0XkjHQ21s',
            id
          }
        })
        .then(response => response.data.items[0].contentDetails)
        .catch(error => console.error(error))
    },

    createPlayer(i) {
      this.$set(this.results[i].player, 'creating', true)
      this.$set(this.results[i].player, 'shouldCreate', true)
    },

    showChooseType(i) {
      this.$set(this.results[i], 'showChooseType', true)
    },

    hideChooseType(i) {
      this.$set(this.results[i], 'showChooseType', false)
    },

    chooseDownloadType(i, type) {
      this.$set(this.results[i], 'downloadType', type)
      this.resetDownload(i)
      this.results[i].showChooseQuality = true
      this.results[i].choosingQuality = true
      this.hideChooseType(i)
    },

    chooseDownloadQuality(i, quality) {
      this.results[i].choosingQuality = false
      // this.$set(this.results[i], "showChooseQuality", false);
      this.$set(this.results[i], 'downloadQuality', quality)
      this.initiateDownload(i)
    },

    initiateDownload(i) {
      // this.$set(this.results[i], 'initiatedDownloader', false)
      this.$set(this.results[i], 'initiatingDownloader', true)

      /**
       * TODO: tell server to process
       * on return tell ui were done
       * if error, show error message to ui
       * else initiate download
       */

      setTimeout(() => {
        this.results[i].initiatingDownloader = false
        this.$set(this.results[i], 'initiatedDownloader', true)
        this.download(i)
      }, 5000)
    },

    download(i) {
      this.$set(this.results[i], 'downloading', true)
      setTimeout(() => {
        this.results[i].downloading = false
        this.$set(this.results[i], 'downloaded', true)
      }, 3000)
    },

    resetDownload(i) {
      this.$set(this.results[i], 'downloadQuality', 0)
      this.$set(this.results[i], 'initiatingDownloader', false)
      this.$set(this.results[i], 'initiatedDownloader', false)
      this.$set(this.results[i], 'downloading', false)
      this.$set(this.results[i], 'downloaded', false)
    },

    // createDownloader(i) {
    //   this.$set(this.results[i], "creatingDownloader", true);
    //   this.$set(this.results[i], "shouldCreate", true);
    // },

    playerReady(i) {
      this.results[i].player.creating = false
      this.results[i].player.created = true
    },

    // downloaderReady(i) {
    //   this.results[i].creatingDownloader = false;
    //   this.results[i].createdDownloader = true;
    // },

    destroyPlayer(i) {
      this.results[i].player.shouldCreate = false
      this.results[i].player.created = false
    },

    focusOnSearch() {
      this.$vuetify.goTo('.search-bar', { offset: -50 })
      document.querySelector('.search-bar input').focus()
    },

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
