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
  <div>
    {{ checkedPlaylists.length }}
  </div>
  <div style="display: flexbox">
    <Checkbox
      v-model="userCreatedBox"
      :binary="true"
      @change="checkBox1ChangeEvent()"
    />
    <label> User Created Playlists </label>

    <Checkbox
      v-model="followedPlaylistsBox"
      :binary="true"
      @change="checkBox2ChangeEvent()"
    />
    <label> Followed Playlists</label>

    <Checkbox v-model="likedSongsBox" :binary="true" />
    <label> Liked Songs</label>
  </div>
  <div class="selectionParent">
    <div class="selectionElement">
      <div v-for="playlist in allPlaylists" :key="playlist.id">
        <Checkbox v-model="checkedPlaylists" :value="playlist.id" />
        <label style="margin-left: 5px">
          {{ playlist.name }} by {{ playlist.owner }}
        </label>
      </div>
    </div>
    <div class="selectionElement">
      <div v-for="album in allAlbums" :key="album.id">
        <Checkbox v-model="checkedAlbums" :value="album.id" />
        <label style="margin-left: 5px">
          {{ album.name }} by {{ album.id }}
        </label>
      </div>
    </div>
  </div>
  <!-- <li v-for="item in checkedPlaylists" :key="item">
    {{ item }}
  </li> -->
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
      userCreatedPlaylists: [],
      allFollowedPlaylists: [],
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
    this.allAlbums = (
      await axios.get("http://localhost:8080/getAlbums", {
        headers: { Authorization: tokenObject.access_token },
      })
    ).data;
    console.log(this.allAlbums);
  },

  methods: {
    checkBox1ChangeEvent() {
      const userCreatedPlaylistsObjs = this.allPlaylists.filter(
        (item) => item.type == "ALL_USER_CREATED"
      );

      for (let value of userCreatedPlaylistsObjs) {
        this.userCreatedPlaylists.push(value.id);
      }

      if (this.userCreatedBox) {
        for (let item of this.userCreatedPlaylists) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!this.userCreatedBox) {
        this.checkedPlaylists = this.checkedPlaylists.filter(
          (item) => !this.userCreatedPlaylists.includes(item)
        );
      }
    },

    checkBox2ChangeEvent() {
      const allFollowedPlaylistsObjs = this.allPlaylists.filter(
        (item) => item.type == "ALL_FOLLOWED_PLAYLISTS"
      );

      for (let value of allFollowedPlaylistsObjs) {
        this.allFollowedPlaylists.push(value.id);
      }

      if (this.followedPlaylistsBox) {
        for (let item of this.allFollowedPlaylists) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!this.followedPlaylistsBox) {
        this.checkedPlaylists = this.checkedPlaylists.filter(
          (item) => !this.allFollowedPlaylists.includes(item)
        );
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