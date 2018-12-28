export default interface Booking {
    StartTime: number;
    Duration: number;
    Description: string;
    Type: string | null;
    Staff: string[];
}
