
<template>
  <div>
    <iframe
      title="Spotify Embed: Recommendation Playlist "
      :src="iframeUrl"
      width="50%"
      height="500px"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      iframeUrl: "",
    };
  },
  mounted() {
    this.iframeUrl =
      "https://open.spotify.com/embed/playlist/" +
      this.$route.params.newPlaylistId +
      "?utm_source=generator&theme=0";
  },
});
</script>
<style scoped>
</style>