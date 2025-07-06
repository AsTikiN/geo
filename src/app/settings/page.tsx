"use client";

import { useState, useEffect } from "react";

function SettingsContent() {
  const [storagePath, setStoragePath] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadCurrentPath();
  }, []);

  const loadCurrentPath = async () => {
    try {
      const response = await fetch("/api/config/storage-path");
      const data = await response.json();
      
      if (response.ok) {
        setStoragePath(data.storagePath);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to load current path" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load current path" });
    }
  };

  const handleUpdatePath = async () => {
    if (!storagePath.trim()) {
      setMessage({ type: "error", text: "Please enter a valid path" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/config/storage-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storagePath: storagePath.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update path" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update path" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-medium text-blue-900 mb-2">Ustawienia</h1>
        <p className="text-gray-500">Konfiguracja projektu</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
        <h3 className="text-2xl font-medium text-blue-900 mb-6">Ścieżka magazynowania</h3>
        
        <div className="space-y-4 flex flex-col">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wybierz lokalizację
            </label>
            <input
              type="text"
              value={storagePath}
              onChange={(e) => setStoragePath(e.target.value)}
              placeholder="np. /Users/yourusername/Projects/geo-app/src/storage"
              className="w-full px-6 py-4 text-base text-[#1D1D1F] bg-[#F5F7FA] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-[#1D1D1F]/60"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.type === "success" 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleUpdatePath}
            disabled={isLoading}
            className="px-6 py-3 text-base font-medium text-white bg-[#0071E3] rounded-2xl hover:bg-[#0077ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(0,113,227,0.15)] ml-auto"
          >
            {isLoading ? "Aktualizowanie..." : "Aktualizuj ścieżkę"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return <SettingsContent />;
}