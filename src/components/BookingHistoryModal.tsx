import { useEffect, useState } from "react"
import DataTable, { type TableColumn } from "react-data-table-component"
import type { RoomBooking } from "../types/roombooking"
import { getAllBookings } from "../api/roombooking.api"
import { formatDateTimeID } from "../utils/dateFormatter"
import StatusBadge from "./StatusBadge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"

interface Props {
  isOpen: boolean
  onClose: () => void
  onEdit: (row: RoomBooking) => void
  onDelete: (id: string) => Promise<void>
}

export default function BookingHistoryModal({
  isOpen,
  onClose,
  onEdit,
  onDelete
}: Props) {
  const [data, setData] = useState<RoomBooking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) fetchHistory()
  }, [isOpen])

  const fetchHistory = async () => {
    setLoading(true)
    const result = await getAllBookings()
    setData(result)
    setLoading(false)
  }

  const handleDeleteInternal = async (id: string) => {
    await onDelete(id)
    await fetchHistory()
  }

  const columns: TableColumn<RoomBooking>[] = [
    {
      name: "Booker",
      selector: row => row.bookerName
    },
    {
      name: "Room",
      selector: row => row.roomName
    },
    {
      name: "Start",
      cell: row => {
        const formatted = formatDateTimeID(row.startTime)
        return (
          <div>
            <div>{formatted.date}</div>
            <div className="text-xs text-gray-500">
              {formatted.time} WIB
            </div>
          </div>
        )
      }
    },
    {
      name: "End",
      cell: row => {
        const formatted = formatDateTimeID(row.endTime)
        return (
          <div>
            <div>{formatted.date}</div>
            <div className="text-xs text-gray-500">
              {formatted.time} WIB
            </div>
          </div>
        )
      }
    },
    {
      name: "Status",
      cell: row => <StatusBadge status={row.status} />
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => onEdit(row)}
            className="text-brand hover:text-brand-dark transition cursor-pointer"
            title="Edit"
          >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
          </button>

          <button
            onClick={() => handleDeleteInternal(row.id)}
            className="text-red-600 hover:text-red-800 transition cursor-pointer"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </button>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-5/6 max-w-5xl p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Booking History</h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Close
          </button>
        </div>

        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  )
}
