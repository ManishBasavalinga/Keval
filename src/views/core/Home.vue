<template>
  <v-main class="bg">
    <v-row class="mr-3">
      <v-spacer></v-spacer>
      <v-btn text to="/login" large>Login</v-btn>
    </v-row>
    <v-container fluid class="pt-0 mt-n16 fill-height">
      <v-row justify="center">
        <v-col class="text-center">
          <span style="font-size:6rem">KEVAL</span>
          <span class="d-none d-sm-none d-md-block">
            Store Rare Contacts &nbsp;&bull;&nbsp; Retrieve Anywhere(Even on a
            browser) &nbsp;&bull;&nbsp; Absolutely Free
          </span>
          <div class="d-md-none">
            <p class="mb-0">Store Rare Contacts</p>
            <p class="mb-0">Retrieve Anywhere</p>
            <p>Absolutely Free</p>
          </div>

          <v-btn outlined color="red" class="mt-5" to="/login"
            >Login to Continue</v-btn
          >
        </v-col>
      </v-row>
      <div class="footer pb-2">
        <a href="https://brigride.com">
          <span>&copy; Brigride Inc.</span>
        </a>
      </div>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  created() {
    this.$vuetify.theme.dark = false;
    this.$store.commit("setUser");
  },
};
</script>

<style scoped>
.bg {
  background-image: url("../../assets/background.jpg");
  background-size: cover;
  background-color: rgba(255, 255, 255, 0.6);
  background-blend-mode: lighten;
  overflow: hidden;
}

a:link,
a:visited {
  color: red;
  text-decoration: none;
}

a:hover {
  color: black;
}

.bg {
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
