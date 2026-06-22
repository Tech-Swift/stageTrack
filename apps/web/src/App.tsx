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
    <div style={{ padding: 20 }}>
      <h1>StageTrack Web</h1>

      <p>
        Status:{" "}
        {status === "loading"
          ? "Checking..."
          : status === "error"
          ? "🔴 Failed"
          : "🟢 Connected"}
      </p>

      {service && <p>Service: {service}</p>}
    </div>
  );
}

export default App;