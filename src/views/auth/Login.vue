<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="text-center pa-0">
          <v-btn
            :loading="googleSigninLoading"
            :disabled="googleSigninLoading"
            color="blue"
            class="my-2 white--text mx-auto"
            @click="googleSignIn"
            width="300px"
          >
            <v-icon left>mdi-google</v-icon>Continue with google
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-center pa-0">
          <span>OR</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card outlined max-width="300px" max-height="300px" class="mx-auto pa-0" elevation="4">
            <v-form ref="loginForm" class="pa-2" autocomplete="off">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="[rules.required, rules.email]"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                label="Password"
                :rules="[rules.required]"
                @click:append="show = !show"
                outlined
                dense
              ></v-text-field>

              <span class="error--text mb-0">{{errorMessage}}</span>

              <PasswordReset v-on:openSnackbar="openSnackbar" />

              <v-card-actions class="pa-0">
                <v-row class="justify-center">
                  <v-card-actions>
                    <v-btn
                      elevation="0"
                      class="primary px-8"
                      @click="login"
                      :loading="loginLoading"
                      :disabled="loginLoading"
                    >Login</v-btn>
                  </v-card-actions>
                </v-row>
              </v-card-actions>
            </v-form>
            <span class="px-2">
              Don't have an account?
              <router-link to="/signup">Sign up</router-link>
            </span>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" timeout="3000">
        Password Reset Email Sent
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
import PasswordReset from "./auth-dialog/PasswordReset";
import firebase from "firebase";
import { fb, firestore } from "@/firebase/init";
export default {
  name: "Login",
  components: { PasswordReset },
  data() {
    return {
      email: null,
      password: null,
      errorMessage: null,
      show: false,
      googleSigninLoading: false,
      loginLoading: false,
      snackbar: false,

      rules: {
        required: value => !!value || "Required.",
        email: v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "Invalid Email.";
        }
      }
    };
  },
  methods: {
    login() {
      if (this.$refs.loginForm.validate()) {
        this.loginLoading = true;
        fb.auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            firestore
              .collection("data")
              .doc(cred.user.uid)
              .get()
              .then(doc => {
                localStorage.setItem("darkMode", doc.data().darkMode);
                this.$vuetify.theme.dark =
                  localStorage.getItem("darkMode") === "true";
              });
            this.$router.replace({ name: "dashboard" });
            this.loginLoading = false;
            this.$refs.loginForm.reset();
          })
          .catch(error => {
            this.loginLoading = false;

            if (error.code == "auth/user-not-found") {
              this.errorMessage = "Invalid Email";
            } else if (error.code == "auth/wrong-password") {
              this.errorMessage = "Wrong Password";
            } else {
              this.errorMessage = error.message;
            }
          });
      }
    },
    googleSignIn() {
      this.googleSigninLoading = true;
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(cred => {
          let firestoreRef = firestore.collection("data").doc(cred.user.uid);
          firestoreRef.get().then(docSnapshot => {
            if (!docSnapshot.exists) {
              firestoreRef.set({
                tags: ["Friend", "Family", "Work"],
                darkMode: false
              });
              localStorage.setItem("darkMode", false);
              this.$vuetify.theme.dark =
                localStorage.getItem("darkMode") === "true";
            } else {
              firestoreRef.get().then(doc => {
                localStorage.setItem("darkMode", doc.data().darkMode);
                this.$vuetify.theme.dark =
                  localStorage.getItem("darkMode") === "true";
              });
            }
          });

          this.googleSigninLoading = false;
          this.$router.replace({ name: "dashboard" });
        })
        .catch(() => {
          this.googleSigninLoading = false;
          this.errorMessage = "Could not continue with Google";
        });
    },
    openSnackbar() {
      this.snackbar = true;
    }
  }
};
</script>
