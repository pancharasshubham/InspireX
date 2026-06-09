import posthog from "posthog-js";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_KEY,
    {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
    }
  );
}

export default posthog;