<template>
  <div class="mainmenu" v-if="playlistUI" id="app">
    <div>
      <p style="margin-bottom: 20px">Enter the name of your playlist:</p>
      <div class="card flex justify-content-center">
        <span class="p-float-label">
          <InputText id="playlistname" v-model="inputValue" />
          <label class="centerInputText" for="playlistname">Name of Playlist</label>
        </span>
      </div>
      <p style="margin-bottom: 0px">
        Select what Playlists/Albums you'd like to include:
      </p>
      <p style="margin-top: 0px">(You must select at least one item)</p>
      <Button
        class="button"
        label="Generate Playlist"
        @click="generatePlaylist()"
      />
    </div>
  </div>
  <div v-if="playlistSelection">
    <div>
      Selected Playlists: {{ checkedPlaylists.length }} Selected Albums:
      {{ checkedAlbums.length }}
    </div>
    <div style="display: flexbox">
      <Checkbox
        v-model="userCreatedBox"
        :binary="true"
        @change="playlistCheckBoxEvent('ALL_USER_CREATED', userCreatedBox)"
      />
      <label> User Created Playlists </label>

      <Checkbox
        v-model="followedPlaylistsBox"
        :binary="true"
        @change="
          playlistCheckBoxEvent('ALL_FOLLOWED_PLAYLISTS', followedPlaylistsBox)
        "
      />
      <label> Followed Playlists</label>

      <Checkbox v-model="likedSongsBox" :binary="true" />
      <label> Liked Songs</label>

      <Checkbox
        v-model="allAlbumsCheck"
        :binary="true"
        @change="allAlbumsCheckBoxEvent()"
      />
      <label> Select All Albums </label>
    </div>
    <div class="selectionParent" v-if="playlistSelection">
      <div class="selectionElement">
        <div v-for="playlist in allPlaylistObjs" :key="playlist['id']">
          <Checkbox v-model="checkedPlaylists" :value="playlist['id']" />
          <label style="margin-left: 5px">
            {{ playlist["name"] }} by {{ playlist["owner"] }}
          </label>
        </div>
      </div>
      <div class="selectionElement">
        <div v-for="album in allAlbumObjs" :key="album['id']">
          <Checkbox v-model="checkedAlbums" :value="album['id']" />
          <label style="margin-left: 5px">
            {{ album["name"] }} by {{ album["artists"] }}
          </label>
        </div>
      </div>
    </div>
  </div>
  <MySpinner :loading-message="loadingMessage" v-show="loadingScreen" />
</template>

<script lang="ts">
import MySpinner from "./MySpinner.vue";
import Checkbox from "primevue/checkbox";
import { defineComponent } from "vue";
import * as services from "../utils/services";

export default defineComponent({
  components: {
    MySpinner,
    Checkbox,
  },
  data() {
    return {
      inputValue: "test" as string,
      loadingMessage: "" as string,
      loadingScreen: true as boolean,
      playlistUI: true as boolean,
      userCreatedBox: false as boolean,
      followedPlaylistsBox: false as boolean,
      likedSongsBox: false as boolean,
      playlistSelection: false as boolean,
      allAlbumsCheck: false as boolean,
      checkedPlaylists: [] as string[],
      checkedAlbums: [] as string[],
      allAlbumObjs: [],
      allPlaylistObjs: [],
    };
  },

  async mounted() {
    this.loadingMessage = 'Loading Playlists and Albums...'
    this.allPlaylistObjs = await services.getPlaylists();
    console.log('Number of playlists returned: ' + this.allPlaylistObjs.length);
    console.log(this.allPlaylistObjs)

    this.allAlbumObjs = await services.getAlbums();
    this.loadingScreen = false;
    this.playlistSelection = true;
    console.log('Number of albums returned: ' + this.allAlbumObjs.length);
    console.log(this.allAlbumObjs)
  },

  methods: {
    playlistCheckBoxEvent(aggregateType: string, checkbox: boolean) {
      const filteredPlaylistIds: string[] = [];
      const filteredPlaylistObjs = this.allPlaylistObjs.filter(
        (item) => item["type"] == aggregateType
      );

      for (let value of filteredPlaylistObjs) {
        filteredPlaylistIds.push(value["id"]);
      }

      if (checkbox) {
        for (let item of filteredPlaylistIds) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!checkbox) {
        this.checkedPlaylists = this.checkedPlaylists.filter(
          (item) => !filteredPlaylistIds.includes(item)
        );
      }
    },

    allAlbumsCheckBoxEvent() {
      const allAlbumIds: string[] = [];
      for (let value of this.allAlbumObjs) {
        allAlbumIds.push(value["id"]);
      }

      if (this.allAlbumsCheck) {
        for (let item of allAlbumIds) {
          if (!this.checkedAlbums.includes(item)) {
            this.checkedAlbums.push(item);
          }
        }
      }
      if (!this.allAlbumsCheck) {
        this.checkedAlbums = [];
      }
    },

    async generatePlaylist() {
      const playlistObject = {
        nameOfPlaylist: this.inputValue,
        playlistsToAdd: this.checkedPlaylists,
        addLikedSongs: this.likedSongsBox,
        albumsToAdd: this.checkedAlbums,
      };
      this.playlistUI = false;
      this.playlistSelection = false;
      this.loadingMessage = 'Generating Playlist...'
      this.loadingScreen = true;
      const newPlaylistId: string = await services.generatePlaylist(playlistObject);
      this.$router.push({ name: "results-page", params: { newPlaylistId } });
    },
  },
});
</script>
<style scoped>
.button {
  margin: 5px;
}
.centerInputText {
  width: 89%;
}
.selectionParent {
  margin-right: 25%;
  margin-left: 25%;
  display: flex;
}
.selectionElement {
  text-align: left;
  width: 350px;
  background: rgba(248, 249, 250, 255);
}
</style>