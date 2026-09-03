// A persistent per-browser identifier used to scope content history.
// Stored in localStorage so it survives refreshes but is unique per device/browser.
const KEY = "learnkins_device_id";

export function getDeviceId() {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
