export const API_BASE = import.meta.env.VITE_API_URL || "";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "X-API-Key": "ak_demo_public_key_for_presentations" }
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const body = await response.json();
  return body.data;
}
