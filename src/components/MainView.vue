<template>
  <div id='container' v-if="bookings && room">
    <div class='header'>Room {{ room.Name.replace('SP ', '') }}</div>
    <div class='subheader'>{{ room.Capacity }} people<span v-if="room.Facilities">, {{ room.Facilities }}</span></div>

    <div class='days' @touchend="handleScroll">
      <div v-for='day in [1,2,3]' :key='day'>
        <div class='status' v-if='day == 1'>
          <span v-if="isFree" class='free'>Free</span><span v-if="!isFree" class='busy'>Occupied</span> for the {{ timeRemaining }}
        </div>
        <div class='status' v-if='day == 2'>
          Tomorrow, December 29
        </div>

        <div class='calendar'>
          <div class='row' v-for="hour in hours" :key="hour">
            <span> {{ hour }}:00 </span>
          </div>
          <div class='booking' :style="getBookingStyle(booking)" v-for="(booking, index) in bookings" :key="index">
            <div>
              {{ booking.Description }}
              <div :class="{ inlineStaff: booking.Duration < 1 }"> {{ booking.Staff[0] }}</div>
            </div>
          </div>
          <div class='time' :style="timeStyle"></div>
        </div> 
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Booking from '../models/Booking';
import Room from '../models/Room';

const blockHeight = 65;

export default Vue.extend({
  name: 'MainView',
  data() {
    return {
      currentTime: 8,
      isFullScreen: false,
      hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    };
  },

  created() {
    this.$store.dispatch('retrieveRoom');
    this.$store.dispatch('retrieveBookings');
  },

  methods: {
    test() {
      const body: any = document.body;
      body.webkitRequestFullScreen(); // vendor prefix madness
      this.isFullScreen = true;
    },
    updateTime() {
      const date = new Date();
      this.currentTime = date.getHours() + date.getMinutes() / 60.0;
    },
    getBookingStyle(book: Booking) {
      return {
        top: (book.StartTime - 8) * blockHeight + 'px',
        height: book.Duration * blockHeight + 'px',
      };
    },
    handleScroll() {
      const el = document.querySelector('.days');
      if (el === null) {
        return;
      }
      const width = window.innerWidth - 20;
      const target = Math.floor(el.scrollLeft / width + 0.5);

      el.scrollTo({ left: target * width, top: 0, behavior: 'smooth' });
    }
  },
  computed: {
    bookings(): Booking[] {
      return this.$store.state.Bookings;
    },

    room(): Room {
      return this.$store.state.Room;
    },

    timeRemaining(): string {
      let nextTime = this.bookings.filter(b => b.StartTime > this.currentTime).map(b => b.StartTime)[0];
      if (!this.isFree) {
        let book = this.bookings.filter(b => b.StartTime <= this.currentTime + 0.1 && b.StartTime + b.Duration >= this.currentTime)[0];
        while (true) {
          const next = this.bookings.filter(b => b.StartTime == book.StartTime + book.Duration)[0];
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
      return this.bookings.filter(b => b.StartTime <= this.currentTime + 0.1 && b.StartTime + b.Duration >= this.currentTime)[0] === undefined;
    },

    timeStyle(): any {
      return { top: (this.currentTime - 8) * blockHeight + 'px' };
    }
  },
  mounted() {
    window.setInterval(() => this.updateTime());
    window.setInterval(() => this.$store.dispatch('retrieveBookings'), 30000);
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

  div.row {
    height: 64px;
    border-top: 1px solid #444;
    margin-left: 50px;
    font-size: smaller;
    span {
      color: #aaa;
      text-align: right;
      position: relative;
      display: inline-block;
      left: -60px;
      top: -9px;
      width: 50px;
    }
  }

  div.calendar {
    position: relative;
  }

  div.booking {
    position: absolute;
    left: 50px;
    right: 0px;
    background-color:rgb(0, 64, 125);
    color: #cfe5fa;
    border: 1px solid rgb(29,29,27);

    > div {
      padding: 5px;
      padding-left: 8px;
      font-weight: 500;

      font-size: 15px;

      > div {
        font-size: 13px;
        margin-top: 2px;
        font-weight: 400;
      }
    }

    &::before {
      content: "";
      position: absolute;
      width: 2px;
      height: 100%;
      background-color:  #cfe5fa;
    }
  }

  div.time {
    position: absolute;
    left: 50px;
    right: 0px;
    border-top: 1px solid rgb(153, 88, 238);

    &::before {
      width: 8px;
      height: 8px;
      background-color: rgb(153, 88, 238);
      transform: rotate(45deg);
      content: "";
      display: block;
      // border-top: 7px solid transparent;
      // border-bottom: 7px solid transparent;
      // border-left: 7px solid yellow;
      position: relative;
      top: -4px;
      left: -4px;
    }
  }

  div.inlineStaff {
    display: inline-block;
    margin-left: 5px;
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
