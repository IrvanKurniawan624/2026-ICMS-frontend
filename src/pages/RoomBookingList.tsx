import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import BookingHistoryModal from "../components/BookingHistoryModal"
import type { TableColumn } from "react-data-table-component";
import type { RoomBooking } from "../types/roombooking";
import {
  getActiveBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking
} from "../api/roombooking.api";
import { bookingStatusLabel } from "../constants/bookingStatus";
import StatusBadge from "../components/StatusBadge";
import BookingModal from "../components/BookingModal";
import DeletedBookingsModal from "../components/DeletedBookingsModal";
import Swal from "sweetalert2";
import { formatDateTimeID } from "../utils/dateFormatter";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function RoomBookingList() {
  const [data, setData] = useState<RoomBooking[]>([]);
  const [filteredData, setFilteredData] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<RoomBooking | null>(null);
  const [deletedModalOpen, setDeletedModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...data];

    if (search) {
      result = result.filter(
        item =>
          item.bookerName.toLowerCase().includes(search.toLowerCase()) ||
          item.roomName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        item => bookingStatusLabel(item.status) === statusFilter
      );
    }

    setFilteredData(result);
  }, [search, statusFilter, data]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getActiveBookings();
    setData(result);
    setFilteredData(result);
    setLoading(false);
  };

  const handleCreate = async (form: Partial<RoomBooking>) => {
    await createBooking(form);
    toast.success("Booking created");
    setModalOpen(false);
    fetchData();
  };

  const handleApprove = async (row: RoomBooking) => {
    await approveBooking(row.id)
    toast.success("Booking approved");
    fetchData();
  };

  const handleReject = async (row: RoomBooking) => {
    await rejectBooking(row.id)
    toast.success("Booking rejected");
    fetchData();
  };



  const handleEdit = async (form: Partial<RoomBooking>) => {
    if (!selected) return;
    await updateBooking(selected.id, form);
    toast.success("Booking updated");
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      await deleteBooking(id);
      toast.success("Booking deleted");
      fetchData();
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
                {formatted.time} WIB
                </div>
            </div>
            );
        },
    },
    {
        name: "End",
        cell: (row) => {
            const formatted = formatDateTimeID(row.endTime);
            return (
            <div>
                <div>{formatted.date}</div>
                <div className="text-xs text-gray-500">
                {formatted.time} WIB
                </div>
            </div>
            );
        },
    },
    {
      name: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3 items-center">

          {bookingStatusLabel(row.status) === "Pending" && (
            <>
              <button
                onClick={() => handleApprove(row)}
                className="text-green-600 hover:text-green-800 transition cursor-pointer"
                title="Approve"
              >
                <FontAwesomeIcon icon={faCheck} size="lg" />
              </button>

              <button
                onClick={() => handleReject(row)}
                className="text-yellow-600 hover:text-yellow-800 transition cursor-pointer"
                title="Reject"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </>
          )}

          <button
            onClick={() => {
              setSelected(row);
              setModalOpen(true);
            }}
            className="text-brand hover:text-brand-dark transition cursor-pointer"
            title="Edit"
          >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 transition cursor-pointer"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </button>

        </div>
      ),
    }




  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100">



        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Room Booking Management
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setHistoryOpen(true)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              View History
            </button>

            <button
                onClick={() => setDeletedModalOpen(true)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-900 cursor-pointer"
                >
                Restore Deleted
            </button>

            <button
              onClick={() => {
                setSelected(null);
                setModalOpen(true);
              }}
              className="bg-purple hover:bg-dark-purple font-semibold text-white px-3 py-2 rounded-lg hover:bg-brand-dark transition flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              Create Booking
            </button>
          </div>

        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center relative my-1 w-64">
            <span className="absolute left-4 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  opacity="0.5"
                  x="17.0365"
                  y="15.1223"
                  width="8.15546"
                  height="2"
                  rx="1"
                  transform="rotate(45 17.0365 15.1223)"
                  fill="currentColor"
                />
                <path
                  d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search Booking"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          </div>


          <div className="relative inline-block text-left">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                        bg-gray-100 hover:bg-gray-200
                        text-gray-700 font-medium
                        transition duration-200"
            >
              {statusFilter}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute mt-2 hover:cursor-pointer w-48 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-10">
                {["All", "Pending", "Approved", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      statusFilter === status ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>


          </div>

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
        />
      </div>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={selected ? handleEdit : handleCreate}
        initialData={selected}
      />

      <DeletedBookingsModal
        isOpen={deletedModalOpen}
        onClose={() => setDeletedModalOpen(false)}
      />

      <BookingHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onEdit={(row) => {
          setSelected(row)
          setModalOpen(true)
          setHistoryOpen(false)
        }}
        onDelete={handleDelete}
      />




    </div>
  );
}
