<template>
  <v-dialog max-width="360px" height v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-responsive v-on="on">
        <v-row>
          <v-col cols="5">
            <v-row class="my-auto">
              <v-col class="d-md-none">
                <v-avatar class="ml-5 my-auto">
                  <v-img :alt="contact.name" :src="contact.imageSource" v-if="contact.imageSource"></v-img>
                  <v-icon v-else size="52">mdi-account-circle</v-icon>
                </v-avatar>
                <v-card-title>{{contact.name}}</v-card-title>
              </v-col>
              <v-avatar class="ml-5 my-auto d-none d-sm-none d-md-block">
                <v-img :alt="contact.name" :src="contact.imageSource" v-if="contact.imageSource"></v-img>
                <v-icon v-else size="52">mdi-account-circle</v-icon>
              </v-avatar>
              <v-card-title class="d-none d-sm-none d-md-block">{{contact.name}}</v-card-title>
            </v-row>
          </v-col>
          <v-col cols="5" v-if="contact.location || contact.selectedTags.length > 0">
            <v-row>
              <div v-if="contact.location">
                <v-card-subtitle class="pl-0">
                  <v-icon>mdi-map-marker</v-icon>
                  {{contact.location}}
                </v-card-subtitle>
              </div>

              <div class="my-auto" v-if="contact.selectedTags.length <= 2">
                <v-chip class="ma-1" v-for="tag in contact.selectedTags" :key="tag">{{tag}}</v-chip>
              </div>

              <div class="my-auto" v-else>
                <v-chip class="ma-1">{{contact.selectedTags[0]}}</v-chip>
                <v-chip class="ma-1">{{contact.selectedTags[1]}}</v-chip>
                <span
                  class="grey--text caption ml-1"
                >(+{{ contact.selectedTags.length - 2 }} others)</span>
              </div>
            </v-row>
          </v-col>
          <v-spacer></v-spacer>
          <v-card-actions class="pr-4">
            <EditContact :contact="contact" />
          </v-card-actions>
        </v-row>
      </v-responsive>
    </template>
    <v-card>
      <v-img
        class="black"
        contain
        height="200px"
        v-if="contact.imageSource"
        :src="contact.imageSource"
      ></v-img>

      <div class="ma-1">
        <span>Name: {{contact.name}}</span>
      </div>
      <div class="ma-1">
        <span>Met At: {{contact.location}}</span>
      </div>
      <div>
        <v-chip small class="ma-1" v-for="tag in contact.selectedTags" :key="tag">{{tag}}</v-chip>
      </div>
      <v-divider></v-divider>
      <div class="ma-1">
        <span>{{contact.description}}</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import EditContact from "./EditContact";

export default {
  name: "ViewContact",
  props: ["contact"],
  components: { EditContact },
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style scoped>
</style>