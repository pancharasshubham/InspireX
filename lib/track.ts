type EventName =
  | "app_open"
  | "reel_view"
  | "install_clicked"
  | "install_success"
  | "session_duration";

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