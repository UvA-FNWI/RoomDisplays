import Booking from '@/models/Booking';
import Room from '@/models/Room';
import Day from '@/models/Day';

export default interface RootState {
    Days: Day[];
    Room: Room | null;
}
