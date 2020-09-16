import Vue from "vue";
import Vuex from "vuex";
import { fb } from "@/firebase/init";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    searchText: "",
  },
  mutations: {
    setUser(state) {
      state.user = fb.auth().currentUser;
    },
    setSearchText(state, searchText) {
      state.searchText = searchText;
    },
  },
  actions: {},
  modules: {},
});
