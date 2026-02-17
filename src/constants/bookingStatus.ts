export const bookingStatusLabel = (status: number): string => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Approved";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
};
