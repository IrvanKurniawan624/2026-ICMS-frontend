import { bookingStatusLabel } from "../constants/bookingStatus";

interface Props {
  status: number;
}

export default function StatusBadge({ status }: Props) {
  const label = bookingStatusLabel(status);

  const base =
    "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200";

  const style =
    label === "Pending"
      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
      : label === "Approved"
      ? "bg-green-100 text-green-700 border border-green-300"
      : label === "Rejected"
      ? "bg-red-100 text-red-700 border border-red-300"
      : "bg-gray-100 text-gray-700 border border-gray-300";

  return (
    <span className={`${base} ${style}`}>
      {label}
    </span>
  );
}
