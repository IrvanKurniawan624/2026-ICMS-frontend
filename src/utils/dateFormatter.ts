export const formatDateTimeID = (value: string) => {
  const date = new Date(value);

  const datePart = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return {
    date: datePart,
    time: timePart,
  };
};
