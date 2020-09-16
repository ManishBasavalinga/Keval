<template>
  <v-dialog max-width="360px" height v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click="onDisplay">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-img class="black" contain height="200px" v-if="imagePreviewUrl" :src="imagePreviewUrl"></v-img>
      <v-form ref="editContactForm" class="mx-4 py-2" autocomplete="off">
        <v-text-field
          v-model="newName"
          label="Name"
          :rules="[rules.required]"
          prepend-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          v-model="newLocation"
          label="Where did you meet this person?"
          prepend-icon="mdi-map-marker"
        ></v-text-field>
        <v-textarea
          label="Description"
          auto-grow
          rows="1"
          prepend-icon="mdi-format-list-bulleted"
          v-model="newDescription"
        ></v-textarea>
        <v-combobox
          v-model="newSelectedTags"
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
        <v-layout row class="justify-space-around">
          <DeleteContact :id="contact.id" :name="contact.name" :hasImage="contact.imageSource" />

          <v-btn
            class="primary"
            @click="editContact"
            :loading="loading"
            :disabled="isChanged"
          >Save Changes</v-btn>
        </v-layout>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { firestore, storage } from "@/firebase/init";
import firebase from "firebase";
import DeleteContact from "./DeleteContact";

export default {
  name: "EditContact",
  props: ["contact"],
  components: { DeleteContact },
  data() {
    return {
      newName: this.contact.name,
      newDescription: this.contact.description,
      newLocation: this.contact.location,
      newSelectedTags: this.contact.selectedTags,
      imagePreviewUrl: this.contact.imageSource,
      dataRef: null,
      searchTags: null,
      image: null,
      imageSource: null,
      errorMessage: null,
      tags: [],
      dialog: false,
      loading: false,
      rules: {
        required: value => !!value || "Required."
      }
    };
  },
  computed: {
    isChanged() {
      if (
        this.newName === this.contact.name &&
        this.newDescription === this.contact.description &&
        this.newLocation === this.contact.location &&
        this.image == null &&
        JSON.stringify(this.newSelectedTags) ==
          JSON.stringify(this.contact.selectedTags)
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    onDisplay() {
      this.newName = this.contact.name;
      this.newDescription = this.contact.description;
      this.newLocation = this.contact.location;
      this.newSelectedTags = this.contact.selectedTags;
      this.imagePreviewUrl = this.contact.imageSource;
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
    editContact() {
      if (this.$refs.editContactForm.validate()) {
        this.loading = true;

        this.newSelectedTags.forEach(tag => {
          if (!this.tags.includes(tag)) {
            this.dataRef.update({
              tags: firebase.firestore.FieldValue.arrayUnion(tag)
            });
          }
        });
        if (this.image != null) {
          var storageRef = storage.ref();
          var uploadTask = storageRef
            .child(`${this.$store.state.user.uid}/${this.newName}`)
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
                    `${this.$store.state.user.uid}/${this.newName}`
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
                  if (this.newName !== this.contact.name) {
                    storageRef
                      .child(
                        `${this.$store.state.user.uid}/${this.contact.name}`
                      )
                      .delete();
                  }
                })
                .then(() => {
                  this.dataRef
                    .collection("contacts")
                    .doc(this.contact.id)
                    .update({
                      name: this.newName,
                      location: this.newLocation,
                      description: this.newDescription,
                      imageSource: this.imageSource,
                      selectedTags: this.newSelectedTags,
                      timestamp: Date.now()
                    });
                })
                .then(() => {
                  this.loading = false;
                  this.$refs.editContactForm.reset();
                  this.dialog = false;
                });
            }
          );
        } else {
          this.dataRef
            .collection("contacts")
            .doc(this.contact.id)
            .update({
              name: this.newName,
              location: this.newLocation,
              description: this.newDescription,
              selectedTags: this.newSelectedTags,
              timestamp: Date.now()
            })
            .then(() => {
              this.loading = false;
              this.$refs.editContactForm.reset();
              this.dialog = false;
            });
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