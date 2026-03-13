"use client";

import NavBar from "./NavBar";
import Hero from "./Hero";
import FeatureGrid from "./FeatureGrid";
import DemoSection from "./DemoSection";
import PricingSection from "./PricingSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div
      className="app-grain"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0f 0%, #12121c 40%, #0e0e16 100%)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Global warm ambient glow */}
      <div style={{
        position: "fixed",
        top: "15%",
        left: "50%",
        width: "80vw",
        height: "60vh",
        transform: "translateX(-50%)",
        background: "radial-gradient(ellipse at center, rgba(210,170,90,0.025) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar />
        <Hero />
        <FeatureGrid />
        <DemoSection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  );
}
