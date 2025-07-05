"use client";

import { ReportGenerator } from "../shared/components/ReportGenerator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function ReportsContent() {
  const handleGenerateReport = async (filters: {
    year?: number;
    month?: string;
    city?: string;
    street?: string;
    noPdf?: boolean;
  }) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append("year", filters.year.toString());
      if (filters.month) queryParams.append("month", filters.month.toString());
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.street) queryParams.append("street", filters.street);
      if (filters.noPdf) queryParams.append("noPdf", "true");

      const response = await fetch(`/api/reports?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to generate report");

      // Get the blob from the response
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "road-works-report.xlsx";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-medium text-blue-900 mb-2">Raporty</h1>
        <p className="text-gray-500">Generowanie raportów z robót drogowych</p>
      </div>

      <ReportGenerator onGenerate={handleGenerateReport} />
    </div>
  );
}

export default function Reports() {
  return <ReportsContent />;
}
