<template>
<MyMenuBar/>
<router-view></router-view>
</template>

<script>
import axios from "axios";
import { RouterView } from 'vue-router'
import MyMenuBar from './components/MyMenuBar.vue'

export default {
  components: {
    MyMenuBar,
    RouterView,
  },
  data() {
    return {
      code: "",
    };
  },

  async mounted() {
    let doesTokenExist = false;
    doesTokenExist = localStorage.getItem("token");
    const tokenObject = JSON.parse(localStorage.getItem("token"));
    let date = new Date();

    if (doesTokenExist && date.getTime()/1000 < tokenObject.timeGenerated + tokenObject.expires_in) {
        this.$router.push('/playlist');
    } else {
      let urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams.has("code"));
      this.code = urlParams.get("code");
      if (this.code == null) {
        this.$router.push('/login');
      } else {
        await this.getToken();
        //TODO: add logic here when getToken fails (due to error or server being down)
        this.$router.push('/playlist');
      }
    }
  },

  methods: {
    async getToken() {
      let accessTokenObject = (
        await axios.post("http://localhost:8080/getAccessToken", this.code)
      ).data;
      let date = new Date();
      accessTokenObject.timeGenerated = date.getTime() / 1000;
      const parsed = JSON.stringify(accessTokenObject);
      localStorage.setItem("token", parsed);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir,Helvetica,Arial,sans-serif;
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
.center {
  width: 89%;
}
</style>
