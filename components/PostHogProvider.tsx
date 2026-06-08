"use client";

import posthog from "@/lib/posthog";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
