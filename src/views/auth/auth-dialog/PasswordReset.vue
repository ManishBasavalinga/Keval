<template>
  <v-dialog max-width="480px" v-model="dialog">
    <template v-slot:activator="{ on }">
      <div
        class="primary--text"
        style="cursor:pointer; text-decoration:underline"
        v-on="on"
      >Forgot Password?</div>
    </template>

    <v-card>
      <v-card-title primary-title>
        <v-subheader class="display-1 primary--text pa-0">Reset Password</v-subheader>
      </v-card-title>
      <v-form ref="resetForm" class="mx-4" autocomplete="off">
        <v-text-field
          v-model="email"
          label="Email"
          :rules="[rules.required, rules.email]"
          outlined
          dense
        ></v-text-field>
        <v-row class="justify-center">
          <v-card-actions>
            <v-btn primary elevation="0" block class="primary" @click="resetPassword">Reset Password</v-btn>
          </v-card-actions>
        </v-row>
      </v-form>
      <p class="error--text text-center mb-0" v-if="errorMessage">{{errorMessage}}</p>
    </v-card>
  </v-dialog>
</template>

<script>
import { fb } from "@/firebase/init";

export default {
  name: "PasswordReset",

  data() {
    return {
      email: null,
      errorMessage: null,
      dialog: false,
      rules: {
        required: value => !!value || "Required.",
        email: v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "Invalid Email.";
        }
      }
    };
  },
  methods: {
    resetPassword() {
      this.errorMessage = null;
      if (this.$refs.resetForm.validate()) {
        fb.auth()
          .sendPasswordResetEmail(this.email)
          .then(() => {
            this.sucessMessage = "Password Reset Email Sent";
            this.$refs.resetForm.reset();
            this.dialog = false;
            this.$emit("openSnackbar");
          })
          .catch(() => {
            this.errorMessage = "Invalid Email";
          });
      }
    }
  }
};
</script>