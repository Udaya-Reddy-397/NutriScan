/**
 * NutriScan API configuration & helpers
 * --------------------------------------
 * Central place to configure the backend URL and call the /predict endpoint.
 */

const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Upload a food image to the backend and return the prediction + nutrition.
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} The prediction response
 */
export async function predictFood(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Server error (${res.status})`);
  }

  return res.json();
}

/**
 * Check if the backend is running and model is loaded.
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

/**
 * Get the list of supported food classes.
 * @returns {Promise<Object>}
 */
export async function getClasses() {
  const res = await fetch(`${API_BASE}/classes`);
  if (!res.ok) throw new Error("Could not fetch classes");
  return res.json();
}

export default API_BASE;
