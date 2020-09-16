<template>
  <v-main>
    <v-container>
      <v-row v-if="loading">
        <v-responsive>
          <v-skeleton-loader
            v-for="n in 6"
            :key="n"
            class="mx-auto"
            type="list-item-avatar-three-line"
          ></v-skeleton-loader>
        </v-responsive>
      </v-row>

      <v-row no-gutters v-else>
        <v-col cols="12">
          <div v-if="contacts.length == 0">
            <h1 class="text-center">No Contacts Yet</h1>
          </div>
          <div v-else-if="filterdContacts.length == 0">
            <h1 class="text-center">No Search Results Found</h1>
          </div>
          <v-card flat tile v-for="contact in filterdContacts" :key="contact.id" v-else>
            <ViewContact :contact="contact" />
            <v-divider></v-divider>
          </v-card>
        </v-col>
      </v-row>

      <AddContact />
    </v-container>
  </v-main>
</template>

<script>
import { firestore } from "@/firebase/init";
import ViewContact from "./dashboard-dialog/ViewContact";
import AddContact from "./dashboard-dialog/AddContact";
export default {
  name: "Dashboard",
  components: { AddContact, ViewContact },

  data() {
    return {
      contacts: [],
      loading: true,
    };
  },

  computed: {
    filterdContacts() {
      return this.contacts.filter((contact) => {
        return (
          contact.name
            .toLowerCase()
            .match(this.$store.state.searchText.toLowerCase()) ||
          contact.location
            .toLowerCase()
            .match(this.$store.state.searchText.toLowerCase()) ||
          contact.description
            .toLowerCase()
            .match(this.$store.state.searchText.toLowerCase()) ||
          contact.selectedTagsString
            .toLowerCase()
            .match(this.$store.state.searchText.toLowerCase())
        );
      });
    },
  },

  created() {
    if (!this.$store.state.user) {
      this.$store.commit("setUser");
    }

    firestore
      .collection("data")
      .doc(this.$store.state.user.uid)
      .collection("contacts")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let doc = change.doc;
          let selectedTagsString = "";
          doc.data().selectedTags.forEach((tag) => {
            selectedTagsString += tag + " ";
          });
          let index = this.contacts.findIndex((contact) => {
            return contact.id === doc.id;
          });
          if (change.type == "added") {
            this.$store.state.searchText = "";
            this.contacts.unshift({
              id: doc.id,
              name: doc.data().name ? doc.data().name : "",
              location: doc.data().location ? doc.data().location : "",
              description: doc.data().description ? doc.data().description : "",
              imageSource: doc.data().imageSource ? doc.data().imageSource : "",
              selectedTags: doc.data().selectedTags
                ? doc.data().selectedTags
                : "",
              show: false,
              selectedTagsString: selectedTagsString,
            });
          } else if (change.type == "modified") {
            this.$store.state.searchText = "";
            this.contacts.splice(index, 1);
            this.contacts.splice(index, 0, {
              id: doc.id,
              name: doc.data().name ? doc.data().name : "",
              location: doc.data().location ? doc.data().location : "",
              description: doc.data().description ? doc.data().description : "",
              imageSource: doc.data().imageSource ? doc.data().imageSource : "",
              selectedTags: doc.data().selectedTags
                ? doc.data().selectedTags
                : "",
              show: false,
              selectedTagsString: selectedTagsString,
            });
          } else if (change.type == "removed") {
            this.contacts.splice(index, 1);
          }
        });
        this.loading = false;
      });
  },
};
</script>



        