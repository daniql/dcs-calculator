"use client";

import { Debt } from "@/app/types/debt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalculationComponent from "@/app/ui/calculation_component";

interface ResultsViewProps {
  debts: Debt[];
  onBack?: () => void;
}

export default function ResultsView({ debts, onBack }: ResultsViewProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="flex items-center bg-transparent border-none text-[#00AEEF] text-[1.2rem] font-semibold cursor-pointer p-0 mb-6 focus:outline-none"
        >
          <ArrowBackIcon className="mr-2" />
          Update Your Current Debts
        </button>
      </div>
      <CalculationComponent debts={debts} />
    </div>
  );
}
