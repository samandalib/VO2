import React from "react";
import { useNavigate } from "react-router-dom";
import { VO2MaxForm } from "@/components/VO2MaxForm";
import { VO2MaxData } from "@shared/api";

export function ProtocolPicker() {
  const navigate = useNavigate();

  const handleFormSubmit = (data: VO2MaxData) => {
    // Check if a protocol was selected (indicated by selectedProtocol in data)
    if (data.selectedProtocol) {
      // VO2MaxForm has already navigated to dashboard with protocol, no need to navigate again
      return;
    }
    // If no protocol selected, navigate to dashboard without protocol
    navigate("/dashboard");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <VO2MaxForm
      onSubmit={handleFormSubmit}
      onBack={handleBackToHome}
      isLoading={false}
    />
  );
}
