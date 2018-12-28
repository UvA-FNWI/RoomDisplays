import Booking from '@/models/Booking';

export default interface Day {
    Bookings: Booking[] | null;
    Index: number;
    FormattedDate: string | null;
}