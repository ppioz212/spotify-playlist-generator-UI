
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
import { PropType } from "vue";

export default {
  props: {
    data: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data() {
    return {
      iframeUrl: "",
    };
  },
  mounted() {
    this.iframeUrl =
      "https://open.spotify.com/embed/playlist/" +
      this.data +
      "?utm_source=generator&theme=0";
  },
};
</script>
<style scoped>
</style>