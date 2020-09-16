<template>
  <nav class="pr-0">
    <v-app-bar app fixed elevate-on-scroll color="bar" scroll-threshold="50" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="pl-1">
        <router-link
          :to="this.$store.state.user ? '/dashboard' : '/'"
          class="link black--text"
        >KEVAL</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-col cols="8" md="4" xl="3" class="py-0 pr-0">
        <v-text-field
          placeholder="Search Your Contacts"
          single-line
          solo
          append-icon="mdi-magnify"
          hide-details
          flat
          v-model="searchText"
          @change="changeSearchText"
          @keyup="changeSearchText"
        ></v-text-field>
      </v-col>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense class="pt-0">
        <v-list-item link to="/dashboard">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/settings">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      drawer: false,
      searchText: ""
    };
  },
  methods: {
    changeSearchText() {
      this.$store.commit("setSearchText", this.searchText);
    }
  }
};
</script>

<style>
.link {
  text-decoration: none;
  cursor: pointer;
}
</style>