<template>
  <div class="mt-4 glass w-100 elevate-on-interact ">
    <v-layout column align-center light class="pa-3">
      <p
        class="mb-3 white--text text-xs-center"
        v-text="result.snippet.title"
      />

      <p class="caption">
        Duration:
        {{ result.contentDetails.duration | youtubeTime }}
      </p>

      <v-layout align-center>
        <transition mode="out-in" name="fade-transition">
          <v-btn
            v-show="!showChooseType"
            color="primary"
            small
            :disabled="initiatingDownloader"
            :loading="creatingDownloader"
            @click="showChooseType = true"
          >
            Download
            <v-icon right small>
              cloud_download
            </v-icon>
          </v-btn>
        </transition>

        <transition mode="out-in" name="slide-x-transition">
          <v-btn
            v-show="showChooseType"
            fab
            small
            @click="showChooseType = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </transition>

        <v-layout column>
          <transition mode="out-in" name="slide-y-transition">
            <v-btn
              v-show="showChooseType"
              :color="downloadType === 'mp3' ? 'primary' : 'secondary'"
              small
              :loading="creatingDownloader"
              @click="chooseDownloadType('mp3')"
            >
              Audio
              <v-icon right small>
                audiotrack
              </v-icon>
            </v-btn>
          </transition>

          <transition mode="out-in" name="slide-y-reverse-transition">
            <v-btn
              v-show="showChooseType"
              :color="downloadType === 'mp4' ? 'primary' : 'secondary'"
              small
              :loading="creatingDownloader"
              @click="chooseDownloadType('mp4')"
            >
              Video
              <v-icon right small>
                videocam
              </v-icon>
            </v-btn>
          </transition>
        </v-layout>

        <!-- <iframe
        v-if="shouldCreateDownloader"
        :src="`https://youtube2mp3api.com/@api/button/mp3/${result.id.videoId}`"
        width="140px" height="32px" scrolling="no"
        class="downloader-iframe"
        :style="{
          border: 'none',
          position: createdDownloader ? 'relative' : 'absolute',
          opacity: createdDownloader ? 1 : 0
          }"
        :ref="`result-${i}-downloader`"
        @load="downloaderReady()"
      ></iframe> -->

        <transition mode="out-in" name="slide-y-transition">
          <v-btn
            v-if="!createdPlayer"
            key="play"
            color="secondary"
            small
            :loading="creatingPlayer"
            @click="createPlayer()"
          >
            Play
            <v-icon right small>
              play_arrow
            </v-icon>
          </v-btn>

          <v-btn
            v-else
            key="stop"
            color="secondary"
            small
            :loading="destroyingPlayer"
            @click="destroyPlayer()"
          >
            Close
            <v-icon right small>
              stop
            </v-icon>
          </v-btn>
        </transition>
      </v-layout>

      <v-layout class="mt-3 w-100" style="max-width: 360px;">
        <v-flex
          v-show="showChooseQuality && downloadType === 'mp3'"
          :class="[choosingQuality ? '' : 'flex-grow-none']"
        >
          <v-layout class="m-download-qualities h-100">
            <!-- <transition-group tag="div" class="layout m-download-qualities h-100" name="slide-y-transition"> -->
            <template v-for="q in audioDownloadQualities">
              <!-- <v-slide-y-transition
              :key="q" > -->
              <transition :key="q" mode="out-in" name="slide-y-transition">
                <v-layout
                  v-show="!downloadQuality || downloadQuality === q"
                  tag="button"
                  column
                  align-center
                  class="m-download-quality"
                  :data-disabled="!!downloadQuality"
                  @click="chooseDownloadQuality(q)"
                >
                  <div class="m-download-quality-top" />
                  <div class="px-3 py-2">
                    MP3
                  </div>
                  <v-divider class="m-download-quality-divider" />
                  <b class="px-3 py-2" v-text="`${q}kb/s`" />
                </v-layout>
              </transition>
              <!-- </v-slide-y-transition> -->
            </template>
            <!-- </transition-group> -->
          </v-layout>
        </v-flex>

        <transition
          name="slide-y-transition"
          mode="out-in"
          leave-to-class="slide-y-reverse-transition-leave-to"
        >
          <v-flex v-if="initiatingDownloader" key="initiating">
            <!-- TODO: Make Loader Component -->
            <v-scale-transition>
              <div class="app-loader black-transparent pa-3 h-100">
                <div
                  v-for="j in 10"
                  :key="j"
                  :class="`rectangle_${j}`"
                  :style="{
                    animationPlayState: initiatingDownloader
                      ? 'running'
                      : 'paused'
                  }"
                />
              </div>
            </v-scale-transition>
          </v-flex>

          <v-flex v-else-if="initiatedDownloader" key="initiated">
            <v-btn
              ref="downloadBtn"
              color="transparent"
              class="ma-0 w-100 px-3 py-2 black-transparent h-100 elevation-5"
              tag="a"
              :download="result.snippet.title"
              :href="downloadURL"
            >
              <v-layout column align-center justify-center>
                <strong>RE-DOWNLOAD</strong>

                <v-divider
                  dark
                  class="mx-3"
                  style="width: 80%; margin: 7px 0 4px; border-color: red; border-color: var(--v-primary-base);"
                />

                <v-icon>
                  cloud_download
                </v-icon>
              </v-layout>
            </v-btn>
          </v-flex>
        </transition>
      </v-layout>
    </v-layout>

    <youtube
      v-if="shouldCreatePlayer"
      :video-id="result.id.videoId"
      :player-vars="{ origin: 'https://www.mod.ng', autoplay: 1 }"
      :player-width="'100%'"
      :player-height="337.5"
      style="padding: 10px 0px; max-width: 600px;"
      @ready="playerReady()"
    />
  </div>
</template>

<style lang="stylus">
.m-download-qualities-divider {
  height: 100%;
  border-left-style: solid;
  border-left-width: 0.7px;
  border-color: #fff4 !important;
  display: block;
}

.m-download-quality {
  position: relative;
  color: white;
  transition: padding 0.4s;
  outline: none;
}

.m-download-quality:nth-last-of-type(4) {
  background-color: #f44336; /* primary color */
}

.m-download-quality:nth-last-of-type(3) {
  background-color: #f4a236; /* accent color */
}

.m-download-quality:nth-last-of-type(2) {
  background-color: #2196f3; /* accent color */
}

.m-download-quality:nth-last-of-type(1) {
  background-color: rgba(76, 175, 79, 1); /* accent color */
}

.m-download-quality-top {
  transition: all 0.3s;
  width: 100%;
  background-color: inherit;
  position: absolute;
  bottom: 100%;
}

.m-download-quality:not([data-disabled]):hover .m-download-quality-top {
  padding-top: 5px;
}

/* .m-download-quality:hover {
  padding-top: 10px;
  transform-origin: bottom center;
} */
.m-download-quality-divider {
  width: 100%;
  border-color: #fff4 !important;
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }

  20%, 60% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
    background-color: #f4a236;
  }
}
</style>

<script>
// const IRequiredString = {
//   required: true,
//   type: String
// }
// import axios from 'axios'

export default {
  name: 'SearchResult',

  filters: {
    youtubeTime(time) {
      if (!time) return ''
      time = time.toString()
      return time
        .replace('PT', '')
        .replace('H', 'hr ')
        .replace('M', 'mins ')
        .replace('S', 'secs')
    }
  },

  props: {
    result: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      shouldCreatePlayer: false,
      creatingPlayer: false,
      createdPlayer: false,
      destroyingPlayer: false,

      downloadType: '',
      showChooseType: false,

      downloadQuality: '',
      showChooseQuality: false,
      choosingQuality: false,

      creatingDownloader: false,
      initiatingDownloader: false,
      initiatedDownloader: false,
      downloading: false,
      downloaded: false,

      downloadURL: '',

      audioDownloadQualities: ['96', '128', '192', '360'], // bitrate
      videoDownloadQualities: ['360p', '480p', '720p', '1080p'] // resolutions
    }
  },

  methods: {
    createPlayer() {
      // TODO: Clear any existing player on page first
      this.creatingPlayer = true
      this.shouldCreatePlayer = true
    },

    chooseDownloadType(type) {
      this.downloadType = type
      this.resetDownload()
      this.showChooseQuality = true
      this.choosingQuality = true
      this.showChooseType = false
    },

    chooseDownloadQuality(quality) {
      // To prevent clicks after quality chosen
      if (this.downloadQuality) return

      this.choosingQuality = false
      // this.showChooseQuality = false
      this.downloadQuality = quality
      this.initiateDownload()
    },

    initiateDownload() {
      // this.initiatedDownloader = false
      this.initiatingDownloader = true

      /**
       * TODO: tell server to process
       * on return tell ui were done
       * if error, show error message to ui
       * else initiate download
       */

      // axios({
      this.$axios
        .get(
          // method: 'get',
          // `http://localhost:3500/${this.downloadType}`,
          `https://mod-media-download-server.herokuapp.com/${
            this.downloadType
          }`,
          {
            params: {
              id: this.result.id.videoId,
              quality: this.downloadQuality
            },
            responseType: 'arraybuffer'
          }
        )
        .then(response => {
          // console.dir(response)
          // response.data.pipe()
          const file = new Blob([new Uint8Array(response.data)], {
            type: this.downloadType === 'mp3' ? 'audio/mp3' : 'video/mp4'
          })
          this.downloadURL = window.URL.createObjectURL(file)
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.initiatingDownloader = false
          this.initiatedDownloader = true
          // this.download()
          this.$nextTick().then(() => {
            setTimeout(() => {
              this.download()
            }, 400)
          })
        })
    },

    download() {
      // this.downloading = true
      // setTimeout(() => {
      //   this.downloading = false
      // this.downloaded = true
      // }, 3000)
      this.$nextTick().then(() => this.$refs.downloadBtn.$el.click())
      this.downloaded = true
    },

    resetDownload() {
      this.downloadQuality = ''
      this.initiatingDownloader = false
      this.initiatedDownloader = false
      this.downloading = false
      this.downloaded = false
    },

    // createDownloader() {
    //   this.creatingDownloader = true
    //   this.shouldCreate = true
    // },

    playerReady() {
      this.creatingPlayer = false
      this.createdPlayer = true
    },

    // downloaderReady() {
    //   this.creatingDownloader = false;
    //   this.createdDownloader = true;
    // },

    destroyPlayer() {
      this.shouldCreatePlayer = false
      this.createdPlayer = false
    }
  }
}
</script>
