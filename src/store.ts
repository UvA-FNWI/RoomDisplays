import Vue from 'vue';
import Vuex from 'vuex';
import axios, { AxiosResponse } from 'axios';
import Booking from '@/models/Booking';
import RootState from '@/models/RootState';
import Room from '@/models/Room';

Vue.use(Vuex);

const endpoint = 'https://api.datanose.nl/Rooms';
const targetRoom = 'SPD1.112';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default new Vuex.Store<RootState>({
  state: {
    Bookings: null,
    Room: null,
    Days: [
      { Index: 0, Bookings: null, FormattedDate: null },
      { Index: 1, Bookings: null, FormattedDate: null },
      { Index: 2, Bookings: null, FormattedDate: null },
    ],
  },
  mutations: {
    setBookings: (state, data: { day: number, bookings: Booking[], date: string }) => {
      state.Days[data.day].FormattedDate = data.date;
      state.Days[data.day].Bookings = data.bookings;
    },
    setRoom: (state, data: Room) => state.Room = data,
  },
  actions: {
    retrieveBookings({ commit }, day: number) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      date.setHours(0, 0, 0, 0);
      axios.get(`${endpoint}/${targetRoom}/?date=${date.toISOString()}`).then((r: AxiosResponse<Booking[]>) => {
        commit('setBookings', { day, bookings: r.data, date: `${monthNames[date.getMonth()]} ${date.getDate()}` });
      });
    },

    retrieveRoom({ commit }) {
      axios.get(`${endpoint}/${targetRoom}/Info`).then((r: AxiosResponse<Room>) => {
        commit('setRoom', r.data);
      });
    }
  },
});
