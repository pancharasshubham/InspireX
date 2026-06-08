import posthog from "./posthog";

type EventName =
  | "app_open"
  | "reel_view"
  | "install_clicked"
  | "install_success"
  | "session_duration"
  | "library_opened";

export const track = (
  event: EventName,
  data?: Record<string, unknown>
) => {
  const payload = {
    event,
    timestamp: Date.now(),
    ...data,
  };

  console.log(payload);

  posthog.capture(
    event,
    data
  );

  const existing =
    JSON.parse(
      localStorage.getItem(
        "inspirexEvents"
      ) || "[]"
    );

  existing.push(payload);

  localStorage.setItem(
    "inspirexEvents",
    JSON.stringify(existing)
  );
};