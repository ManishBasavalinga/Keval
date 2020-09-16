<template>
  <v-dialog v-model="dialog" persistent max-width="360px">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" class="error--text">Delete Contact</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Delete this contact?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="deleteContract">Yes</v-btn>
        <v-btn color="green darken-1" text @click="dialog = false">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { firestore, storage } from "@/firebase/init";
export default {
  name: "DeleteContact",
  props: ["id", "name", "hasImage"],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    deleteContract() {
      firestore
        .collection("data")
        .doc(this.$store.state.user.uid)
        .collection("contacts")
        .doc(this.id)
        .delete()
        .then(() => {
          if (this.hasImage) {
            storage
              .ref()
              .child(`${this.$store.state.user.uid}/${this.name}`)
              .delete();
          }
        })
        .then(() => {
          this.dialog = false;
        });
    }
  }
};
</script>