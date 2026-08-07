import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../features/landing/Hero';
import { Features } from '../features/landing/Features';
import { HowItWorks } from '../features/landing/HowItWorks';
import { About } from '../features/landing/About';
import { FAQ } from '../features/landing/FAQ';
import { CTA } from '../features/landing/CTA';
import { Footer } from '../components/layout/Footer';

export const LandingPage = ({ onLaunchApp }) => {
  // Force scroll to top on refresh/mount for Landing Page only
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar onNavigateApp={onLaunchApp} />
      <main>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <Hero onLaunchApp={onLaunchApp} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <Features />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <HowItWorks onLaunchApp={onLaunchApp} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <About />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <FAQ />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <CTA onLaunchApp={onLaunchApp} />
        </motion.div>
      </main>

      <Footer onNavigateApp={onLaunchApp} />
    </div>
  );
};
