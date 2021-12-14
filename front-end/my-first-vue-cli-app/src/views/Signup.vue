<template>
    <div class="inscription">
      <div class="main">
        <div class="signup">
          <form
            method="POST"
            @submit.prevent="createNewAccount"
            enctype="multipart/form-data"
          >
            <div class="container">
              <section class="name">
                <div>
                  <label for="nom">Nom</label>
                  <input
                    type="text"
                    placeholder="ex : Smith"
                    name="nom"
                    id="nom"
                    required
                    v-model="user.lastname"
                  />
                </div>

                <div>
                  <label for="prenom">Prénom</label>
                  <input
                    type="text"
                    placeholder="ex: John"
                    name="prenom"
                    id="prenom"
                    required
                    v-model="user.firstname"
                  />
                </div>
              </section>

              <div class="email">
                <label for="email">E-mail</label>
                <input
                  type="text"
                  placeholder="ex : johnsmith@email.com"
                  name="email"
                  id="email"
                  required
                  v-model="user.email"
                />
              </div>

              <div>
                <label for="mot_de_passe">Mot de passe</label>
                <section class="passwordLine">
                  <input
                    id="mot_de_passe"
                    type="password"
                    placeholder="Mot de passe"
                    name="nom"
                    required
                    @blur="passwordCueBlur"
                    @focus="passwordCueFocus"
                    @keyup="passwordCueKeyup"
                    v-model="user.password"
                  />

                  <i
                    id="icon"
                    class="material-icons"
                    @click="seePassword()"
                    @keypress="seePassword()"
                    tabindex="0"
                    >visibility_off</i
                  >
                </section>
              </div>

              <ul id="message" class="message">
                <p id="validationTitle">Le mot de passe doit contenir :</p>
                <li id="letter" class="invalid">Une minuscule</li>
                <li id="capital" class="invalid">Une majuscule</li>
                <li id="number" class="invalid">Un chiffre</li>
                <li id="length" class="invalid">6 charactères minimum</li>
              </ul>

              <!-- <div class="imgUpload">
                <p class="label">
                  Photo de profil <b>(vous pourrez en changer)</b>
                </p>
                <div class="imgUpload__line">
                  <label
                    for="télécharger_avatar"
                    class="custom-file-upload"
                    id="labelUploadAvatar"
                    tabindex="-1"
                  >
                    Parcourir les fichiers
                    <input
                      type="file"
                      id="télécharger_avatar"
                      name="avatar"
                      accept=".jpg, .png, .jpeg"
                      tabindex="0"
                      @focus="focusBtnUploadAvatar"
                      @blur="blurBtnUploadAvatar"
                      @change="avatarChange"
                    />
                  </label>
                  This is the default avatar, replaced by user's avatar if there's one
                  <img class="avatar" :src="user.avatarPreview" alt="avatar" />
                </div>
              </div> -->
              <button class="formSubmit" id="formSubmit--signup">
                Inscription
              </button>
            </div>
            <div class="container">
              <span class="formQuestion">Déjà inscrit·e ?</span>
              <router-link to="login"
                ><button class="formExit" type="button">
                  Connexion
                </button></router-link
              >
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
</template>

<script>
//import Header from "../components/Header";
import { DefaultAvatar } from "@/assets/images/avatar_default.png";
import Footer from "../components/Footer.vue";
import { formValidation, passwordCueKeyup } from "vue";

export default {
  name: "signup",
  components: { Footer },
  data() {
    return {
      user: {
        lastname: "",
        firstname: "",
        email: "",
        password: "",
        avatar: null,
      },
      avatarPreview: DefaultAvatar,
    };
  },
  methods: {
    createNewAccount() {
      if (formValidation() == true) {
        //putting state.user infos in a formData
        const formData = new FormData();
        formData.append("lastname", this.user.lastname);
        formData.append("firstname", this.user.firstname);
        formData.append("email", this.user.email);
        formData.append("password", this.user.password);
        formData.append("avatar", this.user.avatar);

        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
            "Content-Type": "multipart/form-data",
          },
        }; //token is extracted from local storage (see Login.vue)}

        //sending data
        fetch("http://localhost:3000/api/user/login", {
          body: JSON.stringify(formData),
          headers: config,
        })
          .then((responce) => responce.json(), console.log("Succes"))
          .then((data) => {
            let token = data.token;
            if (token == null) {
              alert("Une erreur ces produites, veuillez reesayer");
            } else {
              window.location.href = "http://localhost:8080/login";
            }
          })
          .catch((err) => console.log("Erreur lors du fetch", err));
      }
    },
    formValidation() {
      // création des regex
      let nameRegex = /^[A-Za-zéèêëïàöô-]+$/;
      let emailRegex = /.+@.+\..+/;

      // inputs checking with the regex rules
      if (nameRegex.test(this.user.lastname) == false) {
        alert(
          "Votre nom doit être indiqué et ne doit pas contenir de chiffres"
        );
        return false;
      } else if (nameRegex.test(this.user.firstname) == false) {
        alert(
          "Votre prénom doit être indiqué et ne doit pas contenir de chiffres"
        );
        return false;
      } else if (emailRegex.test(this.user.email) == false) {
        alert(
          "Votre e-mail doit être indiqué et doit être au format xxx@yyy.zzz"
        );
        return false;
      } else if (passwordCueKeyup() == false) {
        //password is verified with the passwordCueKeyup() function, this adds an alert
        alert("Merci de respecter les consignes du mot de passe !");
        return false;
      } else {
        return true;
      }
    },
    seePassword() {
      let icon = document.getElementById("icon"); //this is the button
      let password = document.getElementById("mot_de_passe"); //this is the input
      //if password is hidden (with type=password in HTML)
      if (password.type === "password") {
        password.type = "text"; //show password with type=text
        icon.innerHTML = "visibility"; //change icon
      } else {
        //if password is visible
        password.type = "password"; //hide password
        icon.innerHTML = "visibility_off"; // change icon
      }
    },
    passwordCueBlur() {
      document.getElementById("message").style.display = "none";
    },
    passwordCueFocus() {
      document.getElementById("message").style.display = "block";
    },
    //this is the function that indicates what the password needs to contain, activates when user starts typing
    passwordCueKeyup() {
      let password = document.getElementById("mot_de_passe");
      let letter = document.getElementById("letter");
      let capital = document.getElementById("capital");
      let number = document.getElementById("number");
      let length = document.getElementById("length");

      // Validate lowercase letters
      var lowerCaseLetters = /[a-z]/g;
      if (password.value.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
      } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
      }

      // Validate capital letters
      var upperCaseLetters = /[A-Z]/g;
      if (password.value.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
      } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
      }

      // Validate numbers
      var numbers = /[0-9]/g;
      if (password.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
      } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
      }

      // Validate length
      if (password.value.length >= 6) {
        length.classList.remove("invalid");
        length.classList.add("valid");
      } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
      }

      //if everything is valid
      if (
        letter.classList.contains("valid") &&
        capital.classList.contains("valid") &&
        number.classList.contains("valid") &&
        length.classList.contains("valid")
      ) {
        //changing password message
        document.getElementById("validationTitle").textContent =
          "Le mot de passe est valide";
      } else {
        document.getElementById("validationTitle").textContent =
          "Le mot de passe doit contenir :";
        return false;
      }
    },
  },
};
</script>

<style lang="scss"></style>
