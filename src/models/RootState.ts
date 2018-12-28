import Booking from '@/models/Booking';
import Room from '@/models/Room';

export default interface RootState {
    Bookings: Booking[] | null;
    Room: Room | null;
}
