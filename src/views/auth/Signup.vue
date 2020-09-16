<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="text-center pa-0">
          <h2>Signup, It's Free!!</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card outlined max-width="320px" max-height="320px" class="mx-auto" elevation="4">
            <v-form ref="signupForm" class="ma-4" autocomplete="off">
              <v-text-field v-model="name" label="Name" :rules="[rules.required]" outlined dense></v-text-field>
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
                :rules="[rules.required, rules.password]"
                @click:append="show = !show"
                outlined
                dense
              ></v-text-field>

              <span class="error--text mb-0" v-if="errorMessage">{{errorMessage}}</span>

              <v-card-actions class="pa-0 mt-2">
                <v-layout row class="justify-center">
                  <v-card-actions>
                    <v-btn
                      primary
                      elevation="0"
                      class="primary px-8"
                      @click="signup"
                      :loading="signupLoading"
                      :disabled="signupLoading"
                    >Signup</v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template> 

<script>
import { fb, firestore } from "@/firebase/init";
export default {
  name: "Signup",
  data() {
    return {
      name: null,
      email: null,
      errorMessage: null,
      password: null,
      show: false,
      signupLoading: false,

      rules: {
        required: value => !!value || "Required.",
        email: v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "Invalid Email.";
        },
        password: v => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return (
            pattern.test(v) ||
            "Min. 8 characters with at least one capital letter, a number and a special character."
          );
        }
      }
    };
  },
  methods: {
    signup() {
      if (this.$refs.signupForm.validate()) {
        this.signupLoading = true;
        fb.auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            let firestoreRef = firestore.collection("data").doc(cred.user.uid);
            firestoreRef.set({
              tags: ["Friend", "Family", "Work"],
              darkMode: false
            });
            cred.user.updateProfile({
              displayName: this.name
            });
            localStorage.setItem("darkMode", false);
            this.$vuetify.theme.dark =
              localStorage.getItem("darkMode") === "true";
          })
          .then(() => {
            fb.auth()
              .currentUser.sendEmailVerification()
              .then(() => {
                this.$router.replace({ name: "notVerified" });
              });
          })
          .then(() => {
            this.$refs.signupForm.reset();
            this.signupLoading = false;
          })
          .catch(error => {
            this.signupLoading = false;
            this.errorMessage = error.message;
          });
      }
    }
  }
};
</script>