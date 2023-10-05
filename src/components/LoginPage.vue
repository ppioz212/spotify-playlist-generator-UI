<template>
<div class="mainmenu">
      <h1>Spotify Playlist Generation</h1>
    <div id="app">
      <p>
        Please login with your spotify account to generate the playlist of your
        choosing
      </p>
      <Button
        label="Login with Spotify"
        style="margin: 5px"
        @click="openAuthorizatonUrl()"
      />
    </div>
</div>
</template>
<script>
import axios from "axios";
export default {
 components: {
    
  },
  
  data() {
    return {
      code: "",
      accessTokenObject: {},
    };
  },

  async mounted() {
    let doesTokenExist = false;
    doesTokenExist = localStorage.getItem("token");
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    let date = new Date();

    if (
      doesTokenExist &&
      date.getTime() / 1000 < tokenObject.timeGenerated + tokenObject.expires_in
    ) {
      console.log('token still usable')
    } else {
      let urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams.has("code"));
      this.code = urlParams.get("code");
      if (this.code != null) {
        this.getToken();
        
      }
    }
  },

  methods: {
     openAuthorizatonUrl() {
      const clientId = "1dbfd19797084691bbd011cab62cb6a6";
      const redirectUri = "http://localhost:3000"
      const scope ="user-read-private%20" +"playlist-modify-private%20" +
                "playlist-modify-public%20" +"user-library-read%20" +
                "user-read-email%20" +"playlist-read-collaborative%20" +
                "playlist-read-private%20" +"user-library-read";
      const AuthUrl = "https://accounts.spotify.com/authorize?" + "response_type=code"
                + "&client_id=" + clientId
                + "&scope=" + scope
                + "&redirect_uri=" + redirectUri;
      window.open(AuthUrl, "_self", "noreferrer");
    },

    openInSameTab(Url) {
      window.open(Url, "_self", "noreferrer");
    },

    async getToken() {
      this.accessTokenObject = (
        await axios.post("http://localhost:8080/getAccessToken", this.code)
      ).data;
      let date = new Date();
      this.accessTokenObject.timeGenerated = date.getTime() / 1000;
      const parsed = JSON.stringify(this.accessTokenObject);
      localStorage.setItem("token", parsed);
    },


  },
};
</script>
<style scoped>
#app {
  /* display: inline-block; */
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
  text-align: center;
  /* margin-top: 60px; */
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
</style>