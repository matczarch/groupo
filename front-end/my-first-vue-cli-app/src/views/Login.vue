<template>
  <div class="login-contener">
    <body class="connexion">
      <div class="connexion__wrapper">
        <form class="bloc" @submit.prevent="logIntoAccount">
          <div class="container">
            <label for="emailLogin">adresse e-mail</label>
            <input
              type="text"
              placeholder="Adresse e-mail"
              name="email"
              id="emailLogin"
              v-model="user.email"
              required
            />

            <label for="passwordLogin">mot de passe</label>
            <input
              type="password"
              placeholder="Mot de passe"
              name="mot de passe"
              id="passwordLogin"
              v-model="user.password"
              required
            />
            <button class="formSubmit">Connexion</button>
          </div>

          <div class="container">
            <span class="formQuestion">Pas de compte ?</span>
            <router-link to="signup"
              ><button class="formExit" type="button">
                Inscription
              </button></router-link
            >
          </div>
        </form>
      </div>
    </body>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    logIntoAccount() {
      fetch("http://localhost:3000/api/user/login", {
        body: JSON.stringify({
          pwd: this.user.password,
          email: this.user.email,
        }),
        method: "post",
        headers: {
          "Content-Type": "Application.json;charset=UTF-8",
        },
      })
        .then((reponse) => reponse.json())
        .then((data) => {
          //defining token from the datat that's sent by the backend as token
          let token = data.token;

          //if no backend didn't send token, alert the user that their password or email is wrong
          if (token == null) {
            alert("E-mail ou mot de passe éronné");
          } else {
            localStorage.setItem("token", token); //pushing token to localStorage

            //redirecting to the feed
            window.location.href = "http://localhost:3000/feed";
          }
        })
        .catch((err) => console.log("Fetch Error :-S", err));
    },
  },
};

//Pour les fonctions
// methods: {
// logIntoAccount: function() {
// console.log('la fonction en elle même');
//}
//}
</script>
<style lang="scss">
</style> 
