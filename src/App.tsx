import { useEffect } from "react";
import { getAllBookings } from "./api/roombooking.api";

function App() {
  useEffect(() => {
    getAllBookings().then(console.log).catch(console.error);
  }, []);

  return <h1 className="text-2xl font-bold">ICMS Frontend</h1>;
}

export default App;
