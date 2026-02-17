import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { RoomBooking } from "../types/roombooking";
import { getDeletedBookings, restoreBooking } from "../api/roombooking.api";
import { formatDateTimeID } from "../utils/dateFormatter";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeletedBookingsModal({
  isOpen,
  onClose,
}: Props) {
  const [data, setData] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchDeleted();
  }, [isOpen]);

  const fetchDeleted = async () => {
    setLoading(true);
    const result = await getDeletedBookings();
    setData(result);
    setLoading(false);
  };

  const handleRestore = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Restore booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
    });

    if (confirm.isConfirmed) {
      await restoreBooking(id);
      toast.success("Booking restored");
      fetchDeleted();
    }
  };

  const columns: TableColumn<RoomBooking>[] = [
    {
      name: "Booker",
      selector: (row) => row.bookerName,
    },
    {
      name: "Room",
      selector: (row) => row.roomName,
    },
    {
      name: "Start",
      cell: (row) => {
        const formatted = formatDateTimeID(row.startTime);
        return (
          <div>
            <div>{formatted.date}</div>
            <div className="text-xs text-gray-500">
              {formatted.time}
            </div>
          </div>
        );
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleRestore(row.id)}
          className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 cursor-pointer"
        >
          Restore
        </button>
      ),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">
            Deleted Bookings
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Close
          </button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          striped
        />
      </div>
    </div>
  );
}
