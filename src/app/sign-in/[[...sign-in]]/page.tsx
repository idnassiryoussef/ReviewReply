"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInCatchAllPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0d1117] px-4 py-10 font-sans text-white sm:px-6"
      style={{
        backgroundImage:
          "radial-gradient(900px 420px at 50% 105%, rgba(139, 92, 246, 0.3), transparent 62%)",
      }}
    >
      <CornerCircuit className="left-5 top-5" />
      <CornerCircuit className="right-5 top-5 rotate-90" />
      <CornerCircuit className="bottom-5 left-5 -rotate-90" />
      <CornerCircuit className="bottom-5 right-5 rotate-180" />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineTL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lineTR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lineBL" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lineBR" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
          </linearGradient>
          <filter id="blueGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <path id="pathTL" d="M74 74 L74 330 L355 330" />
          <path id="pathTR" d="M926 74 L926 330 L645 330" />
          <path id="pathBL" d="M74 926 L74 670 L355 670" />
          <path id="pathBR" d="M926 926 L926 670 L645 670" />
        </defs>

        <path d="M74 74 L74 330 L355 330" stroke="url(#lineTL)" strokeWidth="2" fill="none" filter="url(#blueGlow)" />
        <path d="M926 74 L926 330 L645 330" stroke="url(#lineTR)" strokeWidth="2" fill="none" filter="url(#blueGlow)" />
        <path d="M74 926 L74 670 L355 670" stroke="url(#lineBL)" strokeWidth="2" fill="none" filter="url(#blueGlow)" />
        <path d="M926 926 L926 670 L645 670" stroke="url(#lineBR)" strokeWidth="2" fill="none" filter="url(#blueGlow)" />

        <circle r="2.8" fill="#a855f7" fillOpacity="0.85" filter="url(#blueGlow)">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin="0s">
            <mpath href="#pathTL" />
          </animateMotion>
        </circle>
        <circle r="2.8" fill="#a855f7" fillOpacity="0.85" filter="url(#blueGlow)">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin="1.2s">
            <mpath href="#pathTR" />
          </animateMotion>
        </circle>
        <circle r="2.8" fill="#a855f7" fillOpacity="0.85" filter="url(#blueGlow)">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin="2.4s">
            <mpath href="#pathBL" />
          </animateMotion>
        </circle>
        <circle r="2.8" fill="#a855f7" fillOpacity="0.85" filter="url(#blueGlow)">
          <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin="3.6s">
            <mpath href="#pathBR" />
          </animateMotion>
        </circle>
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center justify-center">
        <div
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]"
          style={{
            boxShadow:
              "0 0 60px rgba(139,92,246,0.2), 0 0 2px rgba(139,92,246,0.5)",
            animation: "signinFloat 6s ease-in-out infinite",
          }}
        >
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
            forceRedirectUrl="/"
            appearance={{
              baseTheme: dark,
              variables: {
                colorBackground: "#131a27",
                colorInputBackground: "#0d1117",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#94a3b8",
                colorPrimary: "#a855f7",
                colorNeutral: "#ffffff",
                borderRadius: "8px",
              },
              elements: {
                card: { backgroundColor: "#131a27", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "none" },
                headerTitle: { color: "#ffffff" },
                headerSubtitle: { color: "#94a3b8" },
                formFieldInput: { backgroundColor: "#0d1117", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff" },
                socialButtonsBlockButton: { backgroundColor: "#0d1117", borderColor: "rgba(255,255,255,0.1)" },
                socialButtonsBlockButtonText: { color: "#ffffff" },
                dividerLine: { backgroundColor: "rgba(255,255,255,0.1)" },
                formButtonPrimary: {
                  backgroundImage: "linear-gradient(135deg, #a855f7, #6366f1, #3b82f6)",
                  color: "#ffffff",
                },
              },
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes signinFloat {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-6px);
          }

          100% {
            transform: translateY(0px);
          }
        }

        .cl-card {
          position: relative;
          background: #131a27 !important;
          border: 1px solid rgba(255, 255, 255, 0.07) !important;
          padding: 2rem !important;
        }

        .cl-card::before {
          content: "";
          display: block;
          width: 76px;
          height: 76px;
          margin: 0 auto 18px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 50%, transparent 50%, #a855f7 51%, #a855f7 56%, transparent 57%),
            conic-gradient(from 30deg, transparent 0deg, #a855f7 125deg, transparent 255deg, #3b82f6 340deg, transparent 360deg),
            #0f131a;
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow:
            inset 0 0 0 1px rgba(139, 92, 246, 0.22),
            0 0 30px rgba(139, 92, 246, 0.3);
        }

        .cl-formFieldInput[name="identifier"] {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237b8698' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='5' width='18' height='14' rx='2.5'/%3E%3Cpath d='m3.8 7 8.2 6 8.2-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 12px center;
          background-size: 16px;
          padding-left: 40px;
        }

        .cl-formFieldInput[name="password"] {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237b8698' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='11' width='16' height='9' rx='2'/%3E%3Cpath d='M8 11V8a4 4 0 1 1 8 0v3'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 12px center;
          background-size: 16px;
          padding-left: 40px;
        }

        .cl-formButtonPrimary,
        .cl-socialButtonsBlockButton {
          transition:
            transform 200ms ease,
            box-shadow 200ms ease,
            filter 200ms ease !important;
        }

        .cl-formButtonPrimary:hover,
        .cl-socialButtonsBlockButton:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 24px rgba(139, 92, 246, 0.25);
        }
      `}</style>
    </div>
  );
}

function CornerCircuit({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className="h-24 w-24 opacity-90"
        role="presentation"
      >
        <rect x="14" y="14" width="92" height="92" rx="9" fill="#121212" stroke="#1f1f1f" />
        <circle cx="35" cy="35" r="4.5" fill="#4da2ff" />
        <circle cx="35" cy="35" r="9" fill="none" stroke="#4da2ff" strokeOpacity="0.35" />
        <path d="M39 35 H86" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
        <path d="M39 35 V86" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
        <path d="M39 86 H74" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 35 V65" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
        <path d="M74 86 V98 H100" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 65 H100" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
