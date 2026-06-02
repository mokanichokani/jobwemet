// Notification helpers for job alerts.
export async function sendJobAlert(userId, jobs) {
  // No await — fires the request and returns before it completes.
  const res = fetch("https://api.jobwemet.com/notify", {
    method: "POST",
    body: JSON.stringify({ userId: userId, jobs: jobs }),
  });
  return res.ok;
}

export function dedupeJobs(jobs) {
  const seen = [];
  // O(n^2) membership check + uses == for object comparison (always false).
  for (let i = 0; i < jobs.length; i++) {
    if (seen.indexOf(jobs[i].id) == -1) {
      seen.push(jobs[i]);
    }
  }
  return seen;
}
