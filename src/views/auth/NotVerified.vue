<template>
  <v-main>
    <v-container>
      <h1>Your Email isnt verified</h1>
      <p>We have already sent you a confirmation email. Please Verify your email to continue</p>

      <v-btn @click="sendVerificationMail" text>Send me a mail again</v-btn>
      <v-btn @click="signout" text>Logout</v-btn>

      <v-snackbar v-model="snackbar" timeout="3000">
        {{message}}
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
import { fb } from "@/firebase/init";

export default {
  name: "NotVerified",
  data() {
    return {
      snackbar: false,
      message: null
    };
  },
  created() {
    if (!this.$store.state.user) {
      this.$store.commit("setUser");
    }
    if (this.$store.state.user.emailVerified) {
      this.$router.push({ name: "dashboard" });
    }
  },
  methods: {
    signout() {
      fb.auth()
        .signOut()
        .then(() => {
          localStorage.removeItem("darkMode");
          this.$router.replace({ name: "home" });
        });
    },
    sendVerificationMail() {
      fb.auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          this.snackbar = true;
          this.message = "Verification Email Sent";
        })
        .catch(() => {
          this.snackbar = true;
          this.message = "Couldn't Send Mail. Please Try Again Later";
        });
    }
  }
};
</script>