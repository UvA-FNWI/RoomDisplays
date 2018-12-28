<template>
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
</template>

<script lang="ts">
import Vue from 'vue';
import Booking from '../models/Booking';

const blockHeight = 65;

export default Vue.extend({
  name: 'CalendarView',
  data() {
    return {
      hours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    };
  },
  props: [ 'bookings', 'currentTime' ],
  methods: {
    getBookingStyle(book: Booking) {
      return {
        top: (book.StartTime - 8) * blockHeight + 'px',
        height: book.Duration * blockHeight + 'px',
      };
    },
  },
  computed: {
    timeStyle(): any {
      return { top: (this.currentTime - 8) * blockHeight + 'px' };
    },
  },
});
</script>

<style lang="scss" scoped>
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
</style>

