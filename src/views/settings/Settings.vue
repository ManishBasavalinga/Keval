<template>
  <v-main>
    <v-container>
      <v-row>
        <v-switch label="Dark Theme" v-model="darkMode" @change="setTheme" class="pl-4"></v-switch>
      </v-row>
      <v-row>
        <v-btn text @click="signout">Logout</v-btn>
      </v-row>
      <v-row>
        <ChangePassword
          v-if="this.$store.state.user.providerData[0].providerId == 'password' "
          v-on:openSnackbar="openSnackbar"
        />
      </v-row>
      <v-snackbar v-model="snackbar" timeout="3000">
        Password Reset Successful
        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" @click="snackbar = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script>
import { fb, firestore } from "@/firebase/init";
import ChangePassword from "./settings-dialog/ChangePassword";
export default {
  name: "Settings",
  components: { ChangePassword },
  data() {
    return {
      darkMode: localStorage.getItem("darkMode") === "true",
      dataRef: null,
      snackbar: false
    };
  },
  methods: {
    setTheme() {
      if (this.darkMode) {
        this.$vuetify.theme.dark = true;
        localStorage.setItem("darkMode", true);
        this.dataRef.update({
          darkMode: true
        });
      } else {
        this.$vuetify.theme.dark = false;
        localStorage.setItem("darkMode", false);
        this.dataRef.update({
          darkMode: false
        });
      }
    },
    signout() {
      fb.auth()
        .signOut()
        .then(() => {
          localStorage.removeItem("darkMode");
          this.$router.replace({ name: "home" });
        });
    },
    openSnackbar() {
      this.snackbar = true;
    }
  },

  created() {
    if (!this.$store.state.user) {
      this.$store.commit("setUser");
    }

    this.dataRef = firestore.collection("data").doc(this.$store.state.user.uid);
  }
};
</script>