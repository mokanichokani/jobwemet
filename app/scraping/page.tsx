//@ts-nocheck

"use client";

import { useState } from "react";
import { BarLoader } from "react-spinners";

const LinkedInDataFetcher = () => {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `https://li-data-scraper.p.rapidapi.com/get-profile-data-by-url?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F${username}%2F`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": "d1855f3d73msh329665f0245c16fp18fb82jsn82dc870788ad",
            "x-rapidapi-host": "li-data-scraper.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      fetchData();
    } else {
      setError("Please enter a LinkedIn username.");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        LinkedIn Data Fetcher
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter LinkedIn username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-72 px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Data
        </button>
      </form>

      {loading && <p className="text-lg text-blue-600 mt-4">Loading...</p>}
      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
      {data && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <img
              src={data.profilePicture}
              alt={`${data.firstName} ${data.lastName}`}
              className="w-24 h-24 rounded-full"
            />
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">
                {data.firstName} {data.lastName}
              </h2>
              <p className="text-gray-600">{data.headline}</p>
              <p className="text-gray-500">{data.geo.full}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Summary</h3>
            <p className="text-gray-700">{data.summary}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Positions</h3>
            {data.position.map((pos, index) => (
              <div key={index} className="mt-2">
                <div className="flex items-center">
                  <img
                    src={pos.companyLogo}
                    alt={pos.companyName}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <p className="font-semibold">{pos.title}</p>
                    <p className="text-gray-600">{pos.companyName}</p>
                    <p className="text-gray-500">
                      {pos.start.year} - {pos.end.year || "Present"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{pos.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Education</h3>
            {data.educations.map((edu, index) => (
              <div key={index} className="mt-2">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-gray-600">{edu.schoolName}</p>
                <p className="text-gray-500">
                  {edu.start.year} - {edu.end.year || "Present"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInDataFetcher;
