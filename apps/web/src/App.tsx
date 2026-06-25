import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../src/components/layout/theme-provider";

import { LandingPage } from "./pages/LandingPage";
import RegistrationForm from "./features/registration/RegistrationForm";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/register"
            element={
              <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl">
                  <header className="mb-6 text-center">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                      Stage<span className="text-[#2563EB]">Track</span> Registration
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Set up your platform profile and digitize your terminal operations.
                    </p>
                  </header>

                  <main className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <RegistrationForm />
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;