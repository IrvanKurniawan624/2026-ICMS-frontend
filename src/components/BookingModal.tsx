import { useEffect, useState } from "react"
import type { RoomBooking } from "../types/roombooking"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<RoomBooking>) => void
  initialData?: RoomBooking | null
}

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setShow(false)
      return
    }

    const now = new Date()

    const formatDate = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0]

    const formatTime = (d: Date) =>
      new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .substring(11, 16)


    if (initialData) {
      const start = new Date(initialData.startTime)
      const end = new Date(initialData.endTime)

      setForm({
        bookerName: initialData.bookerName,
        roomName: initialData.roomName,
        startDate: formatDate(start),
        startTime: formatTime(start),
        endDate: formatDate(end),
        endTime: formatTime(end),
        status: initialData.status,
      })
    } else {
      setForm({
        bookerName: "",
        roomName: "",
        startDate: formatDate(now),
        startTime: formatTime(now),
        endDate: formatDate(now),
        endTime: formatTime(new Date(now.getTime() + 60 * 60 * 1000)),
        status: 1,
      })
    }

    setTimeout(() => setShow(true), 10)
  }, [isOpen, initialData])

  if (!isOpen || !form) return null

  const combineDateTime = (date: string, time: string) => {
    const local = new Date(`${date}T${time}`)
    const utc = new Date(local.getTime() - local.getTimezoneOffset() * 60000)
    return utc.toISOString()
  }


  const startISO = combineDateTime(form.startDate, form.startTime)
  const endISO = combineDateTime(form.endDate, form.endTime)

  const isInvalid = new Date(endISO) <= new Date(startISO)

  const handleSubmit = () => {
    if (isInvalid) return

    onSubmit({
      bookerName: form.bookerName,
      roomName: form.roomName,
      startTime: startISO,
      endTime: endISO,
      status: form.status,
    })
  }

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all duration-300 ${
          show ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          {initialData ? "Edit Booking" : "Create Booking"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Booker Name"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={form.bookerName}
            onChange={(e) =>
              setForm({ ...form, bookerName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Room Name"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={form.roomName}
            onChange={(e) =>
              setForm({ ...form, roomName: e.target.value })
            }
          />

          {initialData && (
            <div>
              <label className="text-sm font-semibold">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: Number(e.target.value) })
                }
                className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>Pending</option>
                <option value={2}>Approved</option>
                <option value={3}>Rejected</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold">Start</label>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                value={form.startDate}
                className="flex-1 border p-2 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
              <input
                type="time"
                value={form.startTime}
                className="flex-1 border p-2 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">End</label>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                min={form.startDate}
                value={form.endDate}
                className="flex-1 border p-2 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
              <input
                type="time"
                value={form.endTime}
                className="flex-1 border p-2 rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, endTime: e.target.value })
                }
              />
            </div>
          </div>

          {isInvalid && (
            <p className="text-red-500 text-sm">
              End time must be later than start time.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-pointer hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            disabled={isInvalid}
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
