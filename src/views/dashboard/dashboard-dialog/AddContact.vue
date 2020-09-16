<template>
  <v-dialog max-width="360px" height v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn fixed fab bottom right v-on="on" @click="onDisplay">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-img class="black" contain v-if="imagePreviewUrl" height="200" :src="imagePreviewUrl"></v-img>
      <v-form ref="addContactForm" class="mx-4 py-2" autocomplete="off">
        <v-text-field
          v-model="name"
          label="Name"
          :rules="[rules.required]"
          prepend-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          v-model="location"
          label="Where did you meet this person?"
          prepend-icon="mdi-map-marker"
        ></v-text-field>
        <v-textarea
          label="Description"
          auto-grow
          rows="1"
          prepend-icon="mdi-format-list-bulleted"
          v-model="description"
        ></v-textarea>
        <v-combobox
          v-model="selectedTags"
          :items="tags"
          :search-input.sync="searchTags"
          hide-selected
          label="Add some tags"
          multiple
          persistent-hint
          small-chips
          deletable-chips
          prepend-icon="mdi-account-multiple"
        >
          <template v-slot:no-data>
            <v-list-item>
              <span>
                Press
                <kbd>enter</kbd> to create a new tag
              </span>
            </v-list-item>
          </template>

          <template v-slot:item="{ item }">
            <span>{{ item }}</span>
            <v-spacer></v-spacer>
            <v-list-item-action @click.stop>
              <v-btn icon @click="deleteTag(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-combobox>
        <v-file-input accept="image/*" label="Image" v-model="image" @change="onFileChange"></v-file-input>
        <span class="error--text mb-0" v-if="errorMessage">{{errorMessage}}</span>
        <v-card-actions>
          <v-layout row class="justify-center">
            <v-card-actions>
              <v-btn
                primary
                elevation="2"
                class="primary"
                @click="addContact"
                :loading="loading"
              >Add Contact</v-btn>
            </v-card-actions>
          </v-layout>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { firestore, storage } from "@/firebase/init";
import firebase from "firebase";
export default {
  name: "AddContact",
  data() {
    return {
      name: null,
      description: null,
      loading: false,
      location: "",
      dialog: false,
      image: null,
      imageSource: null,
      imagePreviewUrl: null,
      errorMessage: null,
      searchTags: null,
      dataRef: null,
      tags: [],
      selectedTags: [],

      rules: {
        required: value => !!value || "Required."
      }
    };
  },
  methods: {
    onDisplay() {
      this.name = null;
      this.location = null;
      this.description = null;
      this.selectedTags = [];
      this.image = null;
    },
    deleteTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.dataRef
        .update({
          tags: firebase.firestore.FieldValue.arrayRemove(tag)
        })
        .then(() => {
          let idArray = [];
          this.dataRef
            .collection("contacts")
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                idArray.push(doc.id);
              });
            })
            .then(() => {
              idArray.forEach(id => {
                this.dataRef
                  .collection("contacts")
                  .doc(id)
                  .update({
                    selectedTags: firebase.firestore.FieldValue.arrayRemove(tag)
                  });
              });
            });
        });
    },
    addContact() {
      if (this.$refs.addContactForm.validate()) {
        this.selectedTags.forEach(tag => {
          if (!this.tags.includes(tag)) {
            this.dataRef.update({
              tags: firebase.firestore.FieldValue.arrayUnion(tag)
            });
          }
        });
        if (this.image != null) {
          this.loading = true;

          var storageRef = storage.ref();
          var uploadTask = storageRef
            .child(`${this.$store.state.user.uid}/${this.name}`)
            .put(this.image);

          uploadTask.on(
            "state_changed",
            snapshot => {
              if (snapshot.state == "running") {
                this.loading = true;
              }
            },
            error => {
              if (error) {
                this.loading = false;
                this.errorMessage = "Error uploading image";
              }
            },
            () => {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then(downloadURL => {
                  this.imageSource = downloadURL;
                })
                .then(() => {
                  var imageRef = storageRef.child(
                    `${this.$store.state.user.uid}/${this.name}`
                  );
                  var newMetadata = {
                    cacheControl: "public,max-age=1814400000",
                    contentType: "image/jpeg"
                  };
                  imageRef
                    .updateMetadata(newMetadata)

                    .catch(() => {});
                })
                .then(() => {
                  this.dataRef.collection("contacts").add({
                    name: this.name,
                    location: this.location,
                    description: this.description,
                    imageSource: this.imageSource,
                    selectedTags: this.selectedTags,
                    timestamp: Date.now()
                  });
                })
                .then(() => {
                  this.loading = false;
                  this.$refs.addContactForm.reset();
                  this.dialog = false;
                })
                .catch(() => {});
            }
          );
        } else {
          this.dataRef
            .collection("contacts")
            .add({
              name: this.name,
              location: this.location,
              description: this.description,
              imageSource: this.imageSource,
              selectedTags: this.selectedTags,
              timestamp: Date.now()
            })
            .then(() => {
              this.loading = false;
              this.$refs.addContactForm.reset();
              this.dialog = false;
            })
            .catch(() => {});
        }
      }
    },
    onFileChange(e) {
      e
        ? (this.imagePreviewUrl = URL.createObjectURL(e))
        : (this.imagePreviewUrl = null);
    }
  },
  created() {
    this.dataRef = firestore.collection("data").doc(this.$store.state.user.uid);
    this.dataRef.get().then(doc => {
      this.tags = doc.data().tags;
    });
  }
};
</script>