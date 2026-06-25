import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../features/landing/Hero';
import { Problems } from '../features/landing/Problems';
import { FeaturesGrid } from '../features/landing/FeaturesGrid';
import { HowItWorks } from '../features/landing/HowItWorks';
import { Benefits } from '../features/landing/Benefits';
import { About } from '../features/landing/About';
import { ContactForm } from '../features/landing/ContactForm';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-500/20">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Work Area / Preview Section */}
      <main className="flex-grow pt-20"> 
        <Hero />
        <Problems />
        <FeaturesGrid />
        <HowItWorks />
        <Benefits />
        <About />
        <ContactForm />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
};