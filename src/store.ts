import Vue from 'vue';
import Vuex from 'vuex';
import axios, { AxiosResponse } from 'axios';
import Booking from '@/models/Booking';
import RootState from '@/models/RootState';
import Room from '@/models/Room';

Vue.use(Vuex);

const endpoint = 'https://api.datanose.nl/Rooms';
const targetRoom = 'SPD1.112';

export default new Vuex.Store<RootState>({
  state: {
    Bookings: null,
    Room: null,
  },
  mutations: {
    setBookings: (state, data: Booking[]) => state.Bookings = data,
    setRoom: (state, data: Room) => state.Room = data,
  },
  actions: {
    retrieveBookings({ commit }) {
      axios.get(`${endpoint}/${targetRoom}/?date=2019-01-8`).then((r: AxiosResponse<Booking[]>) => {
        commit('setBookings', r.data);
      });
    },

    retrieveRoom({ commit }) {
      axios.get(`${endpoint}/${targetRoom}/Info`).then((r: AxiosResponse<Room>) => {
        commit('setRoom', r.data);
      });
    }
  },
});
