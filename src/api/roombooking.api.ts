import { api } from "./axios";
import type { RoomBooking } from "../types/roombooking";

export const getAllBookings = async (): Promise<RoomBooking[]> => {
  const response = await api.get("/RoomBooking");
  return response.data;
};
