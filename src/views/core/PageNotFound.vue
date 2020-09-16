<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <p style="font-size:4rem">404 Page Not Found</p>
          <v-btn text to="/">Go Back To Home</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "PageNotFound"
};
</script>