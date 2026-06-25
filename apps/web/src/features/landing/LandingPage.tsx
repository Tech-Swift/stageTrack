import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from './Hero';
import { Problems } from './Problems';
import { FeaturesGrid } from './FeaturesGrid';
import { HowItWorks } from './HowItWorks';
import { Benefits } from './Benefits';
import { About } from './About';
import { ContactForm } from './ContactForm';

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