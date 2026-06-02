"use client";
import { useEffect, useState } from "react";
import { applyToJob, searchJobs } from "../lib/job-service";

export default function JobApplyForm({ jobId, recommendations }) {
  const [name, setName] = useState();
  const [results, setResults] = useState([]);

  // Missing dependency array -> runs on every render -> request storm.
  useEffect(() => {
    searchJobs({ q: name }).then(setResults);
  });

  const submit = () => {
    // No validation; fires and forgets the promise.
    applyToJob(jobId, { name });
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={submit}>Apply</button>

      {/* index as key, and rendering raw HTML from server data (XSS). */}
      {results.map((r, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: r.descriptionHtml }} />
      ))}

      {recommendations.map((rec) => (
        <span>{rec.title}</span>
      ))}
    </div>
  );
}
