import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  Code2,
} from "lucide-react";
import { TIER_FEATURES, getTierColorClasses } from "@/lib/constants";
import { Header } from "@/components/Header";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">
              Simple, transparent pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Choose your{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              learning path
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. Unlock Pro for advanced
            content or go Ultra for AI-powered learning, exclusive
            masterclasses, and 1-on-1 access.
          </p>
        </div>

        {/* What's Included Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {TIER_FEATURES.map((plan) => {
            const colorClasses = getTierColorClasses(plan.color);
            return (
              <div
                key={plan.tier}
                className={`p-6 rounded-xl bg-zinc-900/30 border ${colorClasses.border}`}
              >
                <h3 className={`text-lg font-bold mb-4 ${colorClasses.text}`}>
                  {plan.tier} includes:
                </h3>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${colorClasses.text}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Clerk Pricing Table */}
        <div className="clerk-pricing-wrapper rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 md:p-10">
          <PricingTable
            appearance={{
              elements: {
                pricingTable: {
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                },
                pricingTableCard: {
                  borderRadius: "1rem",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  boxShadow: "0 10px 40px rgba(16, 185, 129, 0.1)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  background: "rgba(24, 24, 27, 0.8)",
                  backdropFilter: "blur(10px)",
                },
                pricingTableCardHeader: {
                  background:
                    "linear-gradient(135deg, rgb(16 185 129), rgb(52 211 153))",
                  color: "white",
                  borderRadius: "1rem 1rem 0 0",
                  padding: "2rem",
                },
                pricingTableCardTitle: {
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "0.25rem",
                },
                pricingTableCardDescription: {
                  fontSize: "0.9rem",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: "500",
                },
                pricingTableCardFee: {
                  color: "white",
                  fontWeight: "800",
                  fontSize: "2.5rem",
                },
                pricingTableCardFeePeriod: {
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "1rem",
                },
                pricingTableCardBody: {
                  padding: "1.5rem",
                  background: "rgba(24, 24, 27, 0.9)",
                },
                pricingTableCardFeatures: {
                  marginTop: "1rem",
                  gap: "0.75rem",
                },
                pricingTableCardFeature: {
                  fontSize: "0.9rem",
                  padding: "0.5rem 0",
                  fontWeight: "500",
                  color: "rgba(255, 255, 255, 0.8)",
                },
                pricingTableCardButton: {
                  marginTop: "1.5rem",
                  borderRadius: "0.75rem",
                  fontWeight: "700",
                  padding: "0.875rem 2rem",
                  transition: "all 0.2s ease",
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, rgb(16 185 129), rgb(52 211 153))",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                },
                pricingTableCardPeriodToggle: {
                  color: "white",
                },
              },
            }}
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
                  <p className="text-zinc-400 text-lg font-medium">
                    Loading pricing options...
                  </p>
                </div>
              </div>
            }
          />
        </div>

        {/* FAQ or extra info */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400">
            Questions?{" "}
            <Link
              href="#"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Contact us
            </Link>{" "}
            or check out our{" "}
            <Link
              href="#"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              FAQ
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-zinc-800/50 max-w-7xl mx-auto mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Sonny&apos;s Academy</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-zinc-600">
            2024 Sonny&apos;s Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}