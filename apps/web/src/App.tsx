import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<string>("loading");
  const [service, setService] = useState<string>("");

  useEffect(() => {
    const testHealth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/health`
        );

        if (!res.ok) {
          throw new Error("Health check failed");
        }

        const data = await res.json();

        console.log("HEALTH RESPONSE:", data);

        setStatus(data.status);
        setService(data.service);
      } catch (err) {
        console.error("Health error:", err);
        setStatus("error");
      }
    };

    testHealth();
  }, []);

  return (
      <div className="min-h-screen bg-blue-100 p-5">
    <h1 className="text-3xl font-bold">StageTrack Web</h1>

    <p className="mt-4">
      Status:{" "}
      {status === "loading"
        ? "Checking..."
        : status === "error"
        ? "🔴 Failed"
        : "🟢 Connected"}
    </p>

    {service && <p className="mt-2">Service: {service}</p>}
  </div>
  );
}

export default App;