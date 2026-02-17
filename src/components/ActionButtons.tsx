interface Props {
  status: number;
  onApprove: () => void;
  onReject: () => void;
}

export default function ActionButtons({
  status,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="flex gap-2">
      <button
        disabled={status === 1}
        onClick={onApprove}
        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
      >
        Approve
      </button>

      <button
        disabled={status === 2}
        onClick={onReject}
        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
