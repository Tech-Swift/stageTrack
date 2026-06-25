import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bus,
  Sun,
  Moon,
} from "lucide-react";

import  LoginModal  from "@/features/auth/components/LoginModal";

interface NavLink {
  label: string;
  targetId: string;
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] =
    useState<boolean>(false);

  const [isScrolled, setIsScrolled] =
    useState<boolean>(false);

  const [isLoginOpen, setIsLoginOpen] =
    useState(false);

  const [isDark, setIsDark] =
    useState<boolean>(() => {
      if (typeof window !== "undefined") {
        return (
          localStorage.getItem("theme") ===
            "dark" ||
          (!("theme" in localStorage) &&
            window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches)
        );
      }

      return false;
    });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const navLinks: NavLink[] = [
    {
      label: "Features",
      targetId: "features",
    },
    {
      label: "How It Works",
      targetId: "how-it-works",
    },
    {
      label: "Benefits",
      targetId: "benefits",
    },
    {
      label: "About",
      targetId: "about",
    },
  ];

  const handleNavClick = (
    targetId: string
  ) => {
    setIsOpen(false);

    if (location.pathname !== "/") {
      navigate("/", {
        replace: true,
      });

      setTimeout(() => {
        const element =
          document.getElementById(
            targetId
          );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element =
        document.getElementById(
          targetId
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          isScrolled ||
          location.pathname !== "/"
            ? "bg-[#0F172A]/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-lg"
            : "bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                navigate("/")
              }
            >
              <div className="bg-[#2563EB] p-2 rounded-xl text-white flex items-center justify-center shadow-sm">
                <Bus size={22} />
              </div>

              <span
                className={`text-xl font-black tracking-tight transition-colors duration-300 ${
                  isScrolled ||
                  location.pathname !== "/"
                    ? "text-white"
                    : "text-[#0F172A] dark:text-white"
                }`}
              >
                Stage
                <span className="text-[#2563EB]">
                  Track
                </span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.targetId}
                  onClick={() =>
                    handleNavClick(
                      link.targetId
                    )
                  }
                  className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                    isScrolled ||
                    location.pathname !== "/"
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() =>
                  setIsDark(!isDark)
                }
                className={`p-2 rounded-xl transition-all border active:scale-95 cursor-pointer ${
                  isScrolled ||
                  location.pathname !== "/"
                    ? "text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800"
                    : "text-slate-600 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isDark ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <button
                onClick={() =>
                  setIsLoginOpen(true)
                }
                className={`font-semibold text-sm px-5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isScrolled ||
                  location.pathname !== "/"
                    ? "border-slate-700 text-white hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                }`}
              >
                Login
              </button>

              <button
                onClick={() =>
                  navigate("/register")
                }
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-95 cursor-pointer"
              >
                Book a Demo
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() =>
                  setIsDark(!isDark)
                }
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled ||
                  location.pathname !== "/"
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {isDark ? (
                  <Sun size={22} />
                ) : (
                  <Moon size={22} />
                )}
              </button>

              <button
                onClick={() =>
                  setIsOpen(!isOpen)
                }
                className={`focus:outline-none p-2 rounded-lg ${
                  isScrolled ||
                  location.pathname !== "/"
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {isOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div
            className={`md:hidden px-4 pt-4 pb-6 space-y-3 absolute w-full left-0 border-b shadow-xl ${
              isScrolled ||
              location.pathname !== "/"
                ? "bg-[#0F172A] border-slate-800"
                : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800"
            }`}
          >
            {navLinks.map((link) => (
              <button
                key={link.targetId}
                onClick={() =>
                  handleNavClick(
                    link.targetId
                  )
                }
                className={`block w-full text-left text-base font-medium py-2 transition-colors ${
                  isScrolled ||
                  location.pathname !== "/"
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.label}
              </button>
            ))}

            <div
              className={`pt-4 border-t ${
                isScrolled ||
                location.pathname !== "/"
                  ? "border-slate-800"
                  : "border-slate-100 dark:border-slate-800"
              }`}
            >
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
                className="w-full text-center border border-slate-300 dark:border-slate-700 font-semibold py-3 rounded-xl mb-3"
              >
                Login
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register");
                }}
                className="w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      <LoginModal
        open={isLoginOpen}
        onClose={() =>
          setIsLoginOpen(false)
        }
      />
    </>
  );
};