import React, { useState } from "react";
import axios from "axios";

const MaliciousDetector = () => {
  const [url, setUrl] = useState(""); // store URL input
  const [result, setResult] = useState(null); // store the result of the API
  const [loading, setLoading] = useState(false); // to show loading state

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const detectMaliciousness = async () => {
    setLoading(true);
    try {
      if (!url) {
        alert("Please enter a URL to check.");
        setLoading(false);
        return;
      }

      // Google Safe Browsing API Key (put it in .env for better security)
      const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
      const apiEndpoint = "https://safebrowsing.googleapis.com/v4/threatMatches:find";

      const body = {
        client: {
          clientId: "your-client-id", // Set this as per your needs
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "POTENTIALLY_HARMFUL_APPLICATION",
            "UNWANTED_SOFTWARE",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: url }],
        },
      };

      const response = await axios.post(`${apiEndpoint}?key=${API_KEY}`, body);
      if (response.data.matches) {
        setResult({ malicious: true, threatLevel: 90 }); // assume threatLevel is 90 if malicious
      } else {
        setResult({ malicious: false, threatLevel: 10 }); // assume threatLevel is 10 if safe
      }
    } catch (error) {
      console.error("Error detecting maliciousness:", error);
      setResult({ malicious: false, threatLevel: 0 }); // Error scenario
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Malicious URL Detector</h2>
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter URL to check"
        className="w-full p-4 border border-gray-300 rounded-lg mb-4"
      />
      <button
        onClick={detectMaliciousness}
        disabled={loading}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Checking..." : "Check URL"}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Result:</h3>
          {result.malicious ? (
            <div className="p-4 mt-2 bg-red-100 text-red-700 border border-red-500 rounded">
              <p>This URL is potentially malicious!</p>
              <p>Threat Level: {result.threatLevel}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${result.threatLevel}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="p-4 mt-2 bg-green-100 text-green-700 border border-green-500 rounded">
              <p>This URL seems safe!</p>
              <p>Threat Level: {result.threatLevel}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${result.threatLevel}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MaliciousDetector;
