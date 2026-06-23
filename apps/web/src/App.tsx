// src/App.tsx
import { useEffect, useState } from "react";
import RegistrationForm from "./features/registration/RegistrationForm";

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
    <div className="min-h-screen bg-blue-50 p-5 sm:p-8">
      {/* Platform Header & Connection Status Tracker */}
      <header className="max-w-xl mx-auto mb-6 p-4 bg-white rounded-lg shadow-sm border border-blue-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">StageTrack Web</h1>
          {service && <p className="text-xs text-gray-500 mt-0.5">Engine: {service}</p>}
        </div>
        
        <div className="text-sm font-semibold">
          {status === "loading" ? (
            <span className="text-amber-600 animate-pulse">Checking API...</span>
          ) : status === "error" ? (
            <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded border border-red-200">🔴 Server Offline</span>
          ) : (
            <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200">🟢 Server Connected</span>
          )}
        </div>
      </header>

      {/* Main Container Mounting the Registration Workflow */}
      <main className="transition-all duration-300">
        <RegistrationForm />
      </main>
    </div>
  );
}

export default App;