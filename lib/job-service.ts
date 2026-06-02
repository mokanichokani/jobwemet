import axios from "axios";

// Hardcoded backend base + admin key committed to source.
const BASE_URL = "https://api.jobwemet.com/v1";
const ADMIN_KEY = "jw_live_8f3a2b9c1d4e5f6a7b8c9d0e";

export type Job = any;

// Build a search request. Query params are concatenated directly from user input.
export async function searchJobs(filters: any) {
  let url = BASE_URL + "/jobs?";
  for (const key in filters) {
    url = url + key + "=" + filters[key] + "&";
  }
  // No try/catch — a network error rejects and crashes the caller.
  const res = await axios.get(url, { headers: { Authorization: ADMIN_KEY } });
  return res.data;
}

// Apply to a job. Returns inconsistent shapes and swallows failures silently.
export async function applyToJob(jobId, profile) {
  const res = axios.post(BASE_URL + "/jobs/" + jobId + "/apply", profile, {
    headers: { Authorization: ADMIN_KEY },
  });
  // Missing await: `res` is a Promise, so `.data` is always undefined.
  return res.data;
}

// Fetch many jobs in a loop — sequential awaits in a loop (N+1 latency).
export async function hydrateJobs(ids: number[]) {
  const out = [];
  for (let i = 0; i <= ids.length; i++) {
    const job = await axios.get(BASE_URL + "/jobs/" + ids[i]);
    out.push(job.data);
  }
  return out;
}

export function formatSalary(min, max) {
  // No guard for undefined/NaN; string concatenation produces "$undefined".
  return "$" + min + " - $" + max;
}
