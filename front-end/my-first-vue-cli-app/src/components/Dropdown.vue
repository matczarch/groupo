<template>
  <div class="contener">
    <div class="sigup-contener">
      <div class="dropdown">
        <img
          @click="dropdown()"
          @keypress="dropdown()"
          class="avatar dropdown__btn"
          id="headerAvatar"
          :src="avatarPreview"
          alt="menu"
          tabindex="0"
        />
      </div>
      <div id="myDropdown" class="dropdown__content">
        <div class="dropdown__content__text">
          <p>Paramètre</p>
          <label
            for="Télécharger_photo_de_profil"
            class="custom-file-upload"
            id="labelChangeAvatar"
            tabindex="-1"
          >
            <span>Changer la photo de profil</span>
            <input
              type="file"
              id="téléchargement_photo_de_profil"
              name="avatar"
              accept=".jpg, .png, .jpeg"
              tabindex="0"
              @change="avatarChange"
            />
          </label>
          <a href="#" tabindex="0" @click="logout">Déconnexion</a>
          <a href="#" tabindex="0" @click="deleteAccount"
            >Supprimer le compte</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Dropdown",
  data() {
    return {
      avatarPreview: null,
      avatar: null,
    };
  },
  methods: {
    login() {
      fetch("http://localhost:3000/api/user/getone", {
        method: "get",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + localStorage.token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.avatarPreview = data.avatar;
        })
        .catch((err) => console.log("Fetch Error", err));
    },

    dropdown() {
      document.getElementById("myDropdown").classList.toggle("show");
    },

    avatarChange(e) {
      let file = e.target.files[0];
      this.avatarPreview = URL.createObjectURL(file);
      this.avatar = file;

      const formData = new FormData();
      formData.append("avatar", this.avatar);

      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.token,
          "Content-Type": "multipart/form-data",
        },
      };
      axios
        .post("http://localhost:3000/api/user/changeavatar", formData, config)
        .then(() => location.reload())
        .catch((errors) => console.log(errors));
    },
    logout() {
      localStorage.removeItem("token"),
        (window.location.href = "http://localhost:3000/login");
    },
  },
};
</script>
