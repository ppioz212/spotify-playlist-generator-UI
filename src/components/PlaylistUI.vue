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
        <p>Then choose what playlist you'd like to generate:</p>
        <Button class="button"
          label="Compile User-Created Playlists"
          @click="generatePlaylist('ALL_USER_CREATED')"
        />
      </div>
      <div>
        <Button class="button"
          label="Compile All of User's Playlists"
          @click="generatePlaylist('ALL_USER_OWNED')"
        />
      </div>
  </div>
  <div style="display:flexbox">
    <Checkbox v-model="userCreated" :binary="true" 
    @change="testchange()"/>
    <label> User Created Playlists </label>

    <Checkbox v-model="followedAlbums" :binary="true" />
    <label> Followed Albums </label>

    <Checkbox v-model="followedPlaylists" :binary="true" />
    <label> Followed Playlists</label>
  </div>
  <div v-for="item in categories" :key="item">
    <Checkbox v-model="checkedPlaylists" :value="item.key" />
    <label> {{item.name}} , {{item.key}} </label>
  </div>
  <li v-for="item in checkedPlaylists" :key="item">
    {{item}}
  </li>
  <MySpinner v-if="loadingScreen"/>
  <ResultPage :data=this.newPlaylistId v-if="showIframe"/>
</template>
<script>
import axios from "axios";
import MySpinner from './MySpinner.vue'
import ResultPage from './ResultPage.vue';
import Checkbox from 'primevue/checkbox';


export default {
  components: {
    MySpinner,
    ResultPage,
    Checkbox
  },
  data() {
    return {
      inputValue: null,
      loadingScreen: false,
      newPlaylistId: '',
      iframeUrl: '',
      playlistUI: true,
      showIframe:false,
                  categories: [
                { name: "Accounting", key: "A" },
                { name: "Marketing", key: "M" },
                { name: "Production", key: "P" },
                { name: "Research", key: "R" }
            ],
      checkedPlaylists:[],
      userCreated:false,
      followedAlbums:false,
      followedPlaylists:false,
    };
  },

  methods: {
    testchange() {
        if (!this.userCreated) {
        for(let i =0; i < this.checkedPlaylists.length; i++) {
          if (this.checkedPlaylists[i] == 'A' || this.checkedPlaylists[i] == 'P' ) {
            continue;
          }

        }
      }
    },

    async generatePlaylist(playlistType) {
      const playlistObject = {
        typeOfPlaylist: playlistType,
        nameOfPlaylist: this.inputValue,
      };
      this.playlistUI = false;
      const tokenObject = JSON.parse(localStorage.getItem("token"));
      this.loadingScreen = true;
      this.newPlaylistId = (await axios.post("http://localhost:8080/generateNewPlaylist",playlistObject,
                        {headers: {Authorization: tokenObject.access_token,},})).data;
      this.loadingScreen = false;
      console.log(this.newPlaylistId);
      this.showIframe = true;
    },
  }
};
</script>
<style scoped>
#app {
  font-family: Avenir,Helvetica,Arial,sans-serif;
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