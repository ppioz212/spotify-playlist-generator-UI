<template>
  <div class="mainmenu" v-if="playlistUI" id="app">
    <div>
      <p style="margin-bottom: 20px">Enter the name of your playlist:</p>
      <div class="card flex justify-content-center">
        <span class="p-float-label">
          <InputText id="playlistname" v-model="inputValue" />
          <label class="center" for="playlistname">Name of Playlist</label>
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
      <label> Select All </label>
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
  <div v-if="!playlistSelection">
    <p>Loading Playlists and Albums</p>
    <MySpinner />
  </div>
  <MySpinner v-if="loadingScreen" />
  <ResultPage :data="newPlaylistId" v-if="showIframe" />
</template>

<script lang="ts">

import axios from "axios";
import MySpinner from "./MySpinner.vue";
import ResultPage from "./ResultPage.vue";
import Checkbox from "primevue/checkbox";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    MySpinner,
    ResultPage,
    Checkbox,
  },
  data() {
    return {
      inputValue: "" as string,
      loadingScreen: false as boolean,
      newPlaylistId: "" as string,
      iframeUrl: "" as string,
      playlistUI: true as boolean,
      showIframe: false as boolean,
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
    const tokenObject = JSON.parse(localStorage.getItem("token") || "{}");
    this.allPlaylistObjs = (
      await axios.get("http://localhost:8080/getPlaylists", {
        headers: { Authorization: tokenObject.access_token },
      })
    ).data;
    console.log(this.allPlaylistObjs);

    this.allAlbumObjs = (
      await axios.get("http://localhost:8080/getAlbums", {
        headers: { Authorization: tokenObject.access_token },
      })
    ).data;
    console.log(this.allAlbumObjs);

    this.playlistSelection = true;
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
      const tokenObject = JSON.parse(localStorage.getItem("token") || "{}");
      this.loadingScreen = true;
      this.newPlaylistId = (
        await axios.post(
          "http://localhost:8080/generateNewPlaylist",
          playlistObject,
          { headers: { Authorization: tokenObject.access_token } }
        )
      ).data;
      this.loadingScreen = false;
      console.log(this.newPlaylistId);
      this.playlistSelection = false;
      this.showIframe = true;
    },
  },
});
</script>
<style scoped>
.button {
  margin: 5px;
}
.selectionParent {
  margin-right: 25%;
  margin-left: 25%;
  display: flex;
}
.selectionElement {
  text-align: left;
  display: flex;
  flex-direction: column;
  width: 350px;
  background: rgba(248, 249, 250, 255);
}
.mainmenu {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background: rgba(248, 249, 250, 255);
  border-color: rgba(223, 225, 230, 255);
  border-style: solid;
  margin-top: 20px;
  margin-right: 25%;
  margin-left: 25%;
  padding-bottom: 30px;
  justify-content: center;
}

.center {
  width: 89%;
}
</style>