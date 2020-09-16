<template>
  <v-dialog v-model="changePasswordDialog" persistent max-width="360">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">Change Password</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Change Your Password</v-card-title>
      <v-form ref="changePasswordForm" class="pa-2" autocomplete="off">
        <v-text-field
          v-model="oldPassword"
          :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showOldPassword ? 'text' : 'password'"
          label="Old Password"
          :rules="[rules.required]"
          @click:append="showOldPassword = !showOldPassword"
        ></v-text-field>

        <v-text-field
          v-model="newPassword"
          :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showNewPassword ? 'text' : 'password'"
          label="New Password"
          :rules="[rules.required, rules.password]"
          @click:append="showNewPassword = !showNewPassword"
        ></v-text-field>
        <v-card-actions class="pb-0">
          <v-spacer></v-spacer>
          <v-btn text @click="changePasswordDialog = false">Cancel</v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="changePassword"
            :loading="changePasswordLoading"
            :disabled="changePasswordLoading"
          >Change</v-btn>
        </v-card-actions>
      </v-form>

      <p class="error--text text-center mb-0" v-if="errorMessage">{{errorMessage}}</p>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase";

export default {
  name: "ChangePassword",
  data() {
    return {
      changePasswordDialog: false,
      oldPassword: null,
      newPassword: null,
      showOldPassword: null,
      showNewPassword: null,
      changePasswordLoading: false,
      errorMessage: null,
      rules: {
        required: value => !!value || "Required.",
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
    changePassword() {
      this.errorMessage = null;
      if (this.$refs.changePasswordForm.validate()) {
        this.changePasswordLoading = true;
        const credential = firebase.auth.EmailAuthProvider.credential(
          this.$store.state.user.email,
          this.oldPassword
        );
        this.$store.state.user
          .reauthenticateWithCredential(credential)
          .then(() => {
            this.$store.state.user.updatePassword(this.newPassword);
          })
          .then(() => {
            this.$refs.changePasswordForm.reset();
            this.sucessMessage = "Password Reset Successfully";
            this.changePasswordLoading = false;
            this.changePasswordDialog = false;
            this.$emit("openSnackbar");
          })
          .catch(error => {
            this.changePasswordLoading = false;
            if (error.code == "auth/wrong-password") {
              this.errorMessage = "The password is invalid";
            } else {
              this.errorMessage = error.message;
            }
          });
      }
    }
  }
};
</script>