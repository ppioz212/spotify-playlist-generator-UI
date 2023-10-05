<template>
  <Menubar :model="items" class="menubar">
    <template #start>
      <img
        alt="logo"
        src="../assets/spotify_logo_alt.png"
        height="40"
        class="mr-2"
      />
    </template>
    <template #end>
      <Button label="Logout" severity="danger" @click="logout()" />
    </template>
  </Menubar>
</template>
<script>
  export default {
      data() {
    return {
      items: [
        {
          label: "Home",
          url: "http://localhost:3000",
        },
      ]
    }
},

methods: {
    logout() {
      localStorage.removeItem("token");
      window.location.href = 'http://localhost:3000';
    },
  }
};
</script>
<style>
.menubar {
  background: white;
  border: none;
  border-bottom: solid;
  border-color: rgba(223, 225, 230, 255);
}
</style>