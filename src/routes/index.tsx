import { createFileRoute } from "@tanstack/react-router";
import { LurkGuardApp } from "@/components/LurkGuardApp";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LurkGuard-AI · Detect Fraud Calls with Google AI" },
      {
        name: "description",
        content:
          "LurkGuard-AI uses Google Gemini to transcribe phone calls and instantly classify them as Safe, Suspicious, or Fraud. Built for the Google Solution Challenge.",
      },
      { property: "og:title", content: "LurkGuard-AI · AI Call Fraud Detection" },
      {
        property: "og:description",
        content: "Upload a call recording and let Google AI analyze it for fraud in seconds.",
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <LurkGuardApp />
      <Toaster theme="dark" richColors position="top-center" />
    </>
  );
}
