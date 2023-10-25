import axios from "axios";

export async function getUser() {
  const tokenObject = JSON.parse(localStorage.getItem("token") || "{}");
  const User = (
    await axios.get("http://localhost:8080/getUser", {
      headers: { Authorization: tokenObject.access_token },
    })
  ).data;
  return User;
}

export async function getToken(code: string) {
  const accessTokenObject = (
    await axios.post("http://localhost:8080/getAccessToken", code)
  ).data;
  const date = new Date();
  accessTokenObject.timeGenerated = date.getTime() / 1000;
  const parsed = JSON.stringify(accessTokenObject);
  localStorage.setItem("token", parsed);
}

export async function getPlaylists() {
  const tokenObject = JSON.parse(localStorage.getItem("token") || "{}");
  const allPlaylistObjs = (
    await axios.get("http://localhost:8080/getPlaylists", {
      headers: { Authorization: tokenObject.access_token },
    })
  ).data;
  return allPlaylistObjs;
}

export async function getAlbums() {
  const tokenObject = JSON.parse(localStorage.getItem("token") || "{}");
  const allAlbumObjs = (
    await axios.get("http://localhost:8080/getAlbums", {
      headers: { Authorization: tokenObject.access_token },
    })
  ).data;
  return allAlbumObjs;
}

export async function generatePlaylist(playlistObject: Object) {
  const tokenObject = JSON.parse(localStorage.getItem("token") || "{}");
  const newPlaylistId: string = (
    await axios.post(
      "http://localhost:8080/generateNewPlaylist",
      playlistObject,
      { headers: { Authorization: tokenObject.access_token } }
    )
  ).data;
  return newPlaylistId;
}
