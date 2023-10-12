<template>
  <div class="mainmenu">
    <h1>Spotify Playlist Generation</h1>
    <div>
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
<script lang="ts">

export default {
  
  methods: {
    openAuthorizatonUrl() {
      const clientId = "1dbfd19797084691bbd011cab62cb6a6";
      const redirectUri = "http://localhost:3000";
      const scope =
        "user-read-private%20" +
        "playlist-modify-private%20" +
        "playlist-modify-public%20" +
        "user-library-read%20" +
        "user-read-email%20" +
        "playlist-read-collaborative%20" +
        "playlist-read-private%20" +
        "user-library-read";
      const AuthUrl =
        "https://accounts.spotify.com/authorize?response_type=code" +
        "&client_id=" +
        clientId +
        "&scope=" +
        scope +
        "&redirect_uri=" +
        redirectUri;
      // + "&show_dialog=true";  // Use for proper usage of application to allow logging in and out easily

      window.open(AuthUrl, "_self", "noreferrer");
    },
  },
};
</script>
<style scoped>
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