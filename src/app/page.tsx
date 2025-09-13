"use client";
import { useState } from "react";
import { Debt } from "@/app/types/debt";
import InputView from "@/app/ui/input_view";
import ResultsView from "@/app/ui/results_view";

export default function Main() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "", amount: "", apr: "", payment: "" },
  ]);
  const [prevDebts, setPrevDebts] = useState(debts);

  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setPrevDebts(debts);
    setShowResults(true);
  };

  const handleBack = () => {
    setDebts(prevDebts);
    setShowResults(false);
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col items-center justify-start py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-6 mx-2">
          <div className="text-2xl font-bold mb-2 tracking-tight">
            Debt Consolidation Savings Calculator
          </div>
          <div className="leading-relaxed">
            Enter the details of your current unsecured debt and see how much
            you may be able to save after consolidating the debts into a single
            loan. Only include credit card debt, medical debt, personal loan
            debt, and other types of unsecured debt.
          </div>
        </div>
        <div>
          {showResults ? (
            <ResultsView debts={debts} onBack={handleBack} />
          ) : (
            <InputView
              debts={debts}
              setDebts={setDebts}
              onCalculate={handleCalculate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
