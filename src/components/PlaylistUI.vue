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
        @change="userCreatedCheckBoxEvent()"
      />
      <label> User Created Playlists </label>

      <Checkbox
        v-model="followedPlaylistsBox"
        :binary="true"
        @change="followedPlaylistsCheckBoxEvent()"
      />
      <label> Followed Playlists</label>

      <Checkbox v-model="likedSongsBox" :binary="true" />
      <label> Liked Songs</label>

      <Checkbox
        v-model="allAlbumsCheck"
        :binary="true"
        @change="AllAlbumsCheckBoxEvent()"
      />
      <label> Select All </label>
    </div>
    <div class="selectionParent" v-if="playlistSelection">
      <div class="selectionElement">
        <div v-for="playlist in allPlaylists" :key="playlist.id">
          <Checkbox v-model="checkedPlaylists" :value="playlist.id" />
          <label style="margin-left: 5px">
            {{ playlist.name }} by {{ playlist.owner }}
          </label>
        </div>
      </div>
      <div class="selectionElement">
        <div v-for="album in allAlbumObjs" :key="album.id">
          <Checkbox v-model="checkedAlbums" :value="album.id" />
          <label style="margin-left: 5px">
            {{ album.name }} by {{ album.artists }}
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
  <ResultPage :data="this.newPlaylistId" v-if="showIframe" />
</template>

<script>
import axios from "axios";
import MySpinner from "./MySpinner.vue";
import ResultPage from "./ResultPage.vue";
import Checkbox from "primevue/checkbox";

export default {
  components: {
    MySpinner,
    ResultPage,
    Checkbox,
  },
  data() {
    return {
      inputValue: null,
      loadingScreen: false,
      newPlaylistId: "",
      iframeUrl: "",
      playlistUI: true,
      showIframe: false,
      userCreatedBox: false,
      followedPlaylistsBox: false,
      likedSongsBox: false,
      playlistSelection: false,
      allAlbumsCheck: false,
      checkedPlaylists: [],
      checkedAlbums: [],
    };
  },

  async mounted() {
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    this.allPlaylists = (
      await axios.get("http://localhost:8080/getPlaylists", {
        headers: { Authorization: tokenObject.access_token },
      })
    ).data;
    console.log(this.allPlaylists);
    this.allAlbumObjs = (
      await axios.get("http://localhost:8080/getAlbums", {
        headers: { Authorization: tokenObject.access_token },
      })
    ).data;
    console.log(this.allAlbumObjs);
    this.playlistSelection = true;
  },

  methods: {
    userCreatedCheckBoxEvent() {
      const userCreatedPlaylistIds = [];
      const userCreatedPlaylistsObjs = this.allPlaylists.filter(
        (item) => item.type == "ALL_USER_CREATED"
      );

      for (let value of userCreatedPlaylistsObjs) {
        userCreatedPlaylistIds.push(value.id);
      }

      if (this.userCreatedBox) {
        for (let item of userCreatedPlaylistIds) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!this.userCreatedBox) {
        this.checkedPlaylists = this.checkedPlaylists.filter(
          (item) => !userCreatedPlaylistIds.includes(item)
        );
      }
    },

    followedPlaylistsCheckBoxEvent() {
      const allFollowedPlaylistIds = [];
      const allFollowedPlaylistsObjs = this.allPlaylists.filter(
        (item) => item.type == "ALL_FOLLOWED_PLAYLISTS"
      );

      for (let value of allFollowedPlaylistsObjs) {
        allFollowedPlaylistIds.push(value.id);
      }

      if (this.followedPlaylistsBox) {
        for (let item of allFollowedPlaylistIds) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!this.followedPlaylistsBox) {
        this.checkedPlaylists = this.checkedPlaylists.filter(
          (item) => !allFollowedPlaylistIds.includes(item)
        );
      }
    },

    AllAlbumsCheckBoxEvent() {
      const allAlbumIds = [];
      for (let value of this.allAlbumObjs) {
        allAlbumIds.push(value.id);
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
      const tokenObject = JSON.parse(localStorage.getItem("token"));
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
      this.showIframe = true;
    },
  },
};
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