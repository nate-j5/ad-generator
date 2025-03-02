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
      // Set the content parts received from the API response
      setAdContent(data.adContent);
    } catch (error) {
      console.error("Error fetching response:", error);
      // Handle error if ad content generation fails
      setAdContent({
        headline: "Error",
        tagline: "Failed to generate ad content",
        description: "Please try again later.",
        callToAction: "Retry",
      });
    }
    setLoading(false); // Reset loading state
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-light mb-4 tracking-tight">Dynamic Ad Generator</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Type a phrase in the text box to generate an AI-powered ad.
        </p>
      </div>
      
      <div className="flex mb-10 gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter product description..."
          className="flex-1 p-4 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-200 focus:border-transparent focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
        >
          GENERATE
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">GENERATING...</div>
      ) : (
        adContent && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <div className="p-10">
              <div className="flex items-center gap-5 mb-5">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-light tracking-tight">{adContent.headline}</h2>
              </div>
              <h3 className="text-sm uppercase text-gray-500 mb-8 tracking-widest font-medium">
                {adContent.tagline}
              </h3>
              <p className="text-gray-600 mb-10 leading-relaxed">{adContent.description}</p>
              <button className="border-2 border-black px-8 py-3 text-sm uppercase font-medium hover:bg-black hover:text-white transition-colors duration-200 rounded-md">
                {adContent.callToAction}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}