import React from "react";
import FacturaFormComponent from "@/components/forms/FacturaForm";

const FacturasPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Facturación</h1>

      <FacturaFormComponent />
    </div>
  );
};

export default FacturasPage;
