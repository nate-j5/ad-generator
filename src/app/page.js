"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [adContent, setAdContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // Send POST request to server for ad generation
      const { data } = await axios.post("/api/generate-ad", {
        userInput: input,
      });
      setAdContent(data.adContent);
    } catch (error) {
      console.error("Error fetching response:", error);

      setAdContent({
        headline: "Error",
        tagline: "Failed to generate ad content",
        description: "Please try again later.",
        callToAction: "Retry",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 max-w-4xl mx-auto font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-800 tracking-tight">
          Dynamic Ad Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Type a phrase in the text box to generate an AI-powered ad.
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-12 gap-4 md:items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter product description..."
          className="flex-1 p-5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent focus:outline-none text-gray-700"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          className="px-8 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md font-medium text-lg flex-shrink-0"
        >
          Generate
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Creating your ad...</p>
        </div>
      ) : (
        adContent && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100 shadow-md">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  {adContent.headline}
                </h2>
              </div>

              <div className="mb-8 inline-block bg-gray-100 px-4 py-2 rounded-full">
                <h3 className="text-sm uppercase text-gray-700 tracking-widest font-semibold">
                  {adContent.tagline}
                </h3>
              </div>

              <p className="text-gray-700 mb-10 leading-relaxed text-lg">
                {adContent.description}
              </p>

              <button className="bg-blue-600 px-10 py-4 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md transform hover:scale-105">
                {adContent.callToAction}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
