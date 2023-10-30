<template>
  <div class="mainmenu" v-if="playlistUI" id="app">
    <div>
      <p style="margin-bottom: 20px">Enter the name of your playlist:</p>
      <div class="card flex justify-content-center">
        <span class="p-float-label">
          <InputText id="playlistname" v-model="inputValue" />
          <label class="centerInputText" for="playlistname">Name of Playlist</label>
        </span>
      </div>
      <p style="margin-bottom: 0px">
        Select what Playlists/Albums you'd like to include:
      </p>
      <p style="margin-top: 0px">(You must select at least one item)</p>
      <Button class="button" label="Generate Playlist" @click="generatePlaylist()" />
    </div>
  </div>
  <div v-if="playlistUI">
    <div>
      Selected Playlists: {{ checkedPlaylists.length }} Selected Albums:
      {{ checkedAlbums.length }}
    </div>
    <div style="display: flexbox">
      <Checkbox v-model="userCreatedBox" :binary="true" @change="playlistCheckBoxEvent('UserCreated', userCreatedBox)" />
      <label> User Created Playlists </label>

      <Checkbox v-model="followedPlaylistsBox" :binary="true"
        @change="playlistCheckBoxEvent('Followed', followedPlaylistsBox)" />
      <label> Followed Playlists</label>

      <Checkbox v-model="likedSongsBox" :binary="true" />
      <label> Liked Songs</label>

      <Checkbox v-model="allAlbumsCheck" :binary="true" @change="allAlbumsCheckBoxEvent()" />
      <label> Select All Albums </label>
    </div>
    <div class="selectionParent" v-if="playlistUI">
      <div class="selectionElement">
        <div v-for="playlist in allPlaylistObjs" :key="playlist['id']">
          <Checkbox v-model="checkedPlaylists" :value="playlist['id']" />
          <label style="margin-left: 5px">
            {{ playlist["name"] }} by {{ playlist["owner"]["displayName"] }}
          </label>
        </div>
      </div>
      <div class="selectionElement">
        <div v-for="album in allAlbumObjs" :key="album['id']">
          <Checkbox v-model="checkedAlbums" :value="album['id']" />
          <label style="margin-left: 5px">
            {{ album["name"] }} by {{ album["artists"] }}
          </label>
        </div>
      </div>
    </div>
  </div>
  <MySpinner :loading-message="loadingMessage" v-show="loadingScreen" />
</template>

<script setup lang="ts">
import MySpinner from "./MySpinner.vue";
import Checkbox from "primevue/checkbox";
import { ref, onMounted, reactive } from "vue";
import * as services from "../utils/services";
import { useRouter } from "vue-router";

const router = useRouter()

const loadingMessage = ref<string>("Loading Playlists and Albums...");
const loadingScreen = ref<boolean>(true);
const playlistUI = ref<boolean>(false);
const playlistSelection = ref<boolean>(false);

const userCreatedBox = ref<boolean>(false);
const followedPlaylistsBox = ref<boolean>(false);
function playlistCheckBoxEvent(aggregateType: string, checkbox: boolean) {
  const filteredPlaylistIds: string[] = [];
  let filteredPlaylistObjs = [];
  if (aggregateType == "UserCreated") {
    filteredPlaylistObjs = allPlaylistObjs.value.filter(
      (item) => item["owner"]["id"] == user.id
    );
  } else {
    filteredPlaylistObjs = allPlaylistObjs.value.filter(
      (item) => item["owner"]["id"] != user.id
    );
  }

  for (let playlistObj of filteredPlaylistObjs) {
    filteredPlaylistIds.push(playlistObj["id"]);
  }

  if (checkbox) {
    for (let playlistId of filteredPlaylistIds) {
      if (!checkedPlaylists.value.includes(playlistId)) {
        checkedPlaylists.value.push(playlistId);
      }
    }
  }

  if (!checkbox) {
    checkedPlaylists.value = checkedPlaylists.value.filter(
      (item) => !filteredPlaylistIds.includes(item)
    );
  }
}
const allAlbumsCheck = ref<boolean>(false);
function allAlbumsCheckBoxEvent() {
  const allAlbumIds: string[] = [];
  for (let albumObj of allAlbumObjs.value) {
    allAlbumIds.push(albumObj["id"]);
  }

  if (allAlbumsCheck.value) {
    for (let albumId of allAlbumIds) {
      if (!checkedAlbums.value.includes(albumId)) {
        checkedAlbums.value.push(albumId);
      }
    }
  }
  if (!allAlbumsCheck.value) {
    checkedAlbums.value = [];
  }
}

const likedSongsBox = ref<boolean>(false);
const checkedPlaylists = ref<string[]>([]);
const checkedAlbums = ref<string[]>([]);
const inputValue = ref<string>("tes");
async function generatePlaylist() {
  const playlistObject = {
    nameOfPlaylist: inputValue.value,
    playlistsToAdd: checkedPlaylists.value,
    addLikedSongs: likedSongsBox.value,
    albumsToAdd: checkedAlbums.value,
  };
  playlistUI.value = false;
  playlistSelection.value = false;
  loadingMessage.value = "Generating Playlist...";
  loadingScreen.value = true;
  const newPlaylistId: string = await services.generatePlaylist(
    playlistObject
  );
  router.push({ name: "results-page", params: { newPlaylistId } });
}

const allAlbumObjs = ref([]);
const allPlaylistObjs = ref([]);
const user = reactive({ id: String, display_name: String });
onMounted(async () => {
  const userObj = await services.getUser()
  user.id = userObj.id;
  user.display_name = userObj.display_name;
  allPlaylistObjs.value = await services.getPlaylists();
  console.log("Number of playlists returned: " + allPlaylistObjs.value.length);
  console.log(allPlaylistObjs.value);

  allAlbumObjs.value = await services.getAlbums();
  loadingScreen.value = false;
  playlistUI.value = true;
  playlistSelection.value = true;
  console.log("Number of albums returned: " + allAlbumObjs.value.length);
  console.log(allAlbumObjs.value);
})
</script>
<style scoped>
.button {
  margin: 5px;
}

.centerInputText {
  width: 89%;
}

.selectionParent {
  margin-right: 25%;
  margin-left: 25%;
  display: flex;
}

.selectionElement {
  text-align: left;
  width: 350px;
  background: rgba(248, 249, 250, 255);
}
</style>