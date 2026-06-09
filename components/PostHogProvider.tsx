"use client";

import { useEffect } from "react";
import posthog from "@/lib/posthog";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("POSTHOG CLIENT", posthog);

  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  );
}