import { api } from "./axios";
import type { RoomBooking } from "../types/roombooking";

export const getAllBookings = async (): Promise<RoomBooking[]> => {
  const response = await api.get("/RoomBooking");
  return response.data;
};

export const createBooking = async (data: Partial<RoomBooking>) => {
  return await api.post("/RoomBooking", data);
};

export const updateBooking = async (id: string, data: Partial<RoomBooking>) => {
  return await api.put(`/RoomBooking/${id}`, data);
};

export const deleteBooking = async (id: string) => {
  return await api.delete(`/RoomBooking/${id}`);
};

export const getDeletedBookings = async () => {
  const response = await api.get("/RoomBooking/deleted");
  return response.data;
};

export const restoreBooking = async (id: string) => {
  return await api.put(`/RoomBooking/restore/${id}`);
};

export const getActiveBookings = async () => {
  const response = await api.get("/RoomBooking/active")
  return response.data
}

export const approveBooking = async (id: string) => {
  await api.patch(`/RoomBooking/${id}/approve`)
}

export const rejectBooking = async (id: string) => {
  await api.patch(`/RoomBooking/${id}/reject`)
}

