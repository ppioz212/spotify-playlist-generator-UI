<template>
  <div class="container">
    <div class="row justify-content-md-center" style="margin-top: 5px">
      <p>{{ loadingMessage }}</p>
      <ProgressSpinner
        strokeWidth="4"
        fill="var(--surface-ground)"
        animationDuration="1.5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PropType } from "vue";

export default defineComponent({
  props: {
    loadingMessage: {
      type: String as PropType<string>,
      required: false,
    },
  },
});
</script>
<style scoped>
</style>