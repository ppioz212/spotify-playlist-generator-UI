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
      <p style="margin-bottom: 0px" > Select what Playlists/Albums you'd like to include: </p>
      <p style="margin-top: 0px" > (You must select at least one item)</p>
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
    <Checkbox v-model="userCreatedBox" :binary="true" @change="checkBox1ChangeEvent()" />
    <label > User Created Playlists </label>

    <Checkbox v-model="followedPlaylistsBox" :binary="true" @change="checkBox2ChangeEvent()" />
    <label> Followed Playlists</label>

    <Checkbox v-model="likedSongsBox" :binary="true" />
    <label> Liked Songs</label>
  </div>
  <div v-for="item in allPlaylists" :key="item.playlistId">
    <Checkbox  v-model="checkedPlaylists" :value="item.playlistId" />
    <label style="margin-left: 5px">
      {{ item.playlistName }} by {{ item.playlistOwner }}
    </label>
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
      checkedPlaylists: [],
      userCreatedBox: false,
      followedPlaylistsBox: false,
      likedSongsBox: false,
      userCreatedPlaylists:[],
      allFollowedPlaylists:[]
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
  },

  methods: {
    checkBox1ChangeEvent() {
      const userCreatedPlaylistsObjs = this.allPlaylists.filter((item) => item.playlistType == "ALL_USER_CREATED");

      for(let value of userCreatedPlaylistsObjs) {
        this.userCreatedPlaylists.push(value.playlistId); 
      }

      if (this.userCreatedBox) {
        for (let item of this.userCreatedPlaylists) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!this.userCreatedBox) {
        this.checkedPlaylists = this.checkedPlaylists.filter((item) => !this.userCreatedPlaylists.includes(item));
      }
    },
    
    checkBox2ChangeEvent() {
      const allFollowedPlaylistsObjs = this.allPlaylists.filter((item) => item.playlistType == "ALL_FOLLOWED_PLAYLISTS");

      for(let value of allFollowedPlaylistsObjs) {
        this.allFollowedPlaylists.push(value.playlistId); 
      }

      if (this.followedPlaylistsBox) {
        for (let item of this.allFollowedPlaylists) {
          if (!this.checkedPlaylists.includes(item)) {
            this.checkedPlaylists.push(item);
          }
        }
      }

      if (!this.followedPlaylistsBox) {
        this.checkedPlaylists = this.checkedPlaylists.filter((item) => !this.allFollowedPlaylists.includes(item));
      }
    },

  async generatePlaylist() {
    const playlistObject = {
      nameOfPlaylist: this.inputValue,
      playlistsToAdd: this.checkedPlaylists,
      addLikedSongs: this.likedSongsBox
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
}
};
</script>
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* margin-top: 60px; */
}

.button {
  margin: 5px;
}

.iframe {
  display: flex;
}
.mainmenu {
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