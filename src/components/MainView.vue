<template>
  <div id='container' v-if="bookings && room">
    <div class='header'>Room {{ room.Name.replace('SP ', '') }}</div>
    <div class='subheader'>{{ room.Capacity }} people<span v-if="room.Facilities">, {{ room.Facilities }}</span></div>

    <div class='days' @touchend="handleScroll">
      <div v-for='day in days' :key='day.Index'>
        <div class='status' v-if='day.Index == 0'>
          <span v-if="isFree" class='free'>Free</span><span v-if="!isFree" class='busy'>Occupied</span> for the {{ timeRemaining }}
        </div>
        <div class='status' v-if='day.Index >0 '>
          <template v-if='day.Index == 1'>Tomorrow, </template>{{ day.FormattedDate }}
        </div>

        <CalendarView :bookings="day.Bookings" :currentTime="day.Index == 0 ? currentTime : 0"></CalendarView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Room from '../models/Room';
import Day from '../models/Day';
import Booking from '../models/Booking';
import CalendarView from './CalendarView.vue';

let scrollTimeout: number;

export default Vue.extend({
  name: 'MainView',

  data() {
    return {
      currentTime: 8,
    };
  },

  components: { CalendarView },

  created() {
    this.$store.dispatch('retrieveRoom');
    this.retrieveBookings();
  },

  methods: {
    retrieveBookings(day: number = 0) {
      this.$store.dispatch('retrieveBookings', day);
    },
    updateTime() {
      const date = new Date();
      this.currentTime = date.getHours() + date.getMinutes() / 60.0;
    },
    handleScroll() {
      const el = document.querySelector('.days');
      if (el === null) {
        return;
      }
      const width = window.innerWidth - 20;
      const target = Math.floor(el.scrollLeft / width + 0.5);
      this.retrieveBookings(target);

      el.scrollTo({ left: target * width, top: 0, behavior: 'smooth' });
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
        scrollTimeout = 0;
      }
      scrollTimeout = window.setTimeout(() => el.scrollTo({ left: 0, top: 0, behavior: 'smooth' }), 5000);
    },
  },
  computed: {
    days(): Day[] {
      return this.$store.state.Days;
    },

    bookings(): Booking[] | null {
      return this.days[0].Bookings;
    },

    room(): Room {
      return this.$store.state.Room;
    },

    timeRemaining(): string {
      if (this.bookings === null) {
        return '';
      }
      let nextTime = this.bookings.filter(b => b.StartTime > this.currentTime).map(b => b.StartTime)[0];
      if (!this.isFree) {
        let book = this.bookings.filter(b => b.StartTime <= this.currentTime + 0.1 && b.StartTime + b.Duration >= this.currentTime)[0];
        while (true) {
          const next = this.bookings.filter(b => b.StartTime === book.StartTime + book.Duration)[0];
          if (!next) { break; }
          book = next;
        }
        nextTime = book.StartTime + book.Duration;
      }

      if (!nextTime) {
        return 'rest of the day';
      } else if (nextTime - this.currentTime > 1) {
        const hours = Math.floor(nextTime - this.currentTime);
        return hours === 1 ? `next hour` : `next ${hours} hours`;
      } else {
        return `next ${Math.floor((nextTime - this.currentTime) * 60)} minutes`;
      }
    },

    isFree(): boolean {
      return this.bookings !== null && this.bookings.filter(b => b.StartTime <= this.currentTime + 0.1 && b.StartTime + b.Duration >= this.currentTime)[0] === undefined;
    },
  },
  mounted() {
    window.setInterval(() => this.updateTime());
    window.setInterval(() => this.retrieveBookings(), 30000);
  },
});
</script>

<style lang="scss" scoped>
  #container {
    margin-left: 5%;
    margin-right: 5%;
  }

  div.header {
    margin-top: 10px;
    font-size: 50px;
    margin-bottom: 5px;
    text-align: center;
  }

  div.subheader {
    font-size: 20px;
    color: #ccc;
    text-align: center;

    margin-bottom: 15px;
  }

  div.status {
    text-align: center;
    font-size: 25px;
    span {
      //display: block;
      font-size: 35px;

      &.free {
        color: lightgreen;
      }
      &.busy {
        color: lightcoral;
      }
    }

    margin-bottom: 40px;
  }

  div.days {
    white-space: nowrap;
    width: 100%;
    overflow-x: auto;

    > div {
      display: inline-block;
      width: 100%;
    }

    > div:not(:last-child) {
      margin-right: 10%;
    }
  }
</style>
