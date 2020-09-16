<template>
  <v-app>
    <Navbar v-if="this.$store.state.user" />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  name: "App",
  components: { Navbar },
  data() {
    return {
      user: null,
    };
  },
};
</script>

<style>
div {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
</style>
