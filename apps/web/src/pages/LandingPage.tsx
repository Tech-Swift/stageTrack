import React, { useState } from "react";

import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../features/landing/Hero";
import { Problems } from "../features/landing/Problems";
import { FeaturesGrid } from "../features/landing/FeaturesGrid";
import { HowItWorks } from "../features/landing/HowItWorks";
import { Benefits } from "../features/landing/Benefits";
import { About } from "../features/landing/About";
import { ContactForm } from "../features/landing/ContactForm";

import TenantApplicationModal from "../features/tenantApplication/TenantApplicationModal";

export const LandingPage: React.FC = () => {
  const [isTenantApplicationOpen, setIsTenantApplicationOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0F172A] dark:text-white">
      <Navbar
        onTenantApplication={() =>
          setIsTenantApplicationOpen(true)
        }
      />

      <main className="flex-grow pt-20">
        <Hero
          onTenantApplication={() =>
            setIsTenantApplicationOpen(true)
          }
        />

        <Problems />
        <FeaturesGrid />
        <HowItWorks />
        <Benefits />
        <About />
        <ContactForm />
      </main>

      <Footer />

      <TenantApplicationModal
        open={isTenantApplicationOpen}
        onClose={() =>
          setIsTenantApplicationOpen(false)
        }
      />
    </div>
  );
};
