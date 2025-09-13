"use client";
import { useState } from "react";
import { Slider } from "@mui/material";
import { nper, pmt } from "financial";
import { Debt } from "@/app/types/debt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface CalculationComponentProps {
  debts: Debt[];
}

function CalculationComponent({ debts }: CalculationComponentProps) {
  const [aprValue, setAprValue] = useState(20);
  const [termValue, setTermValue] = useState(20);

  const apr_marks = [
    { value: 0, label: "4%" },
    { value: 100, label: "36%" },
  ];
  const aprStep = 100 / ((36 - 4) / 0.05);
  const term_marks = [
    { value: 0, label: "12 mo." },
    { value: 100, label: "60 mo." },
  ];
  const minApr = 4;
  const maxApr = 36;
  const displayApr = (minApr + (aprValue / 100) * (maxApr - minApr)).toFixed(2);
  const minTerm = 12;
  const maxTerm = 60;
  const displayTerm = Math.round(
    minTerm + (termValue / 100) * (maxTerm - minTerm)
  );

  const currentTotalRepayment = calculateTotalCostOfAllDebts(debts);
  const totalAmount = debts.reduce((sum, debt) => sum + Number(debt.amount), 0);
  const currentTotalMonthlyPayments = debts.reduce(
    (sum, debt) => sum + Number(debt.payment),
    0
  );

  const { newMonthlyPayment, newTotalRepayment } = calculateNewRepayment(
    totalAmount,
    aprValue,
    termValue
  );

  const repaymentSavings = currentTotalRepayment - newTotalRepayment;
  const monthlySavings = currentTotalMonthlyPayments - newMonthlyPayment;

  const savingsColor = (value: number) => (value >= 0 ? "#00A86B" : "#D32F2F");
  const savingsBgColor = (value: number) =>
    value >= 0 ? "#E6FAF7" : "#FDEAEA";

  function formatCurrency(numStr: string) {
    return (
      "$" +
      parseFloat(numStr)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  }

  function calculateCostOfSingleDebt(
    balance: number,
    apr: number,
    monthlyPayment: number
  ) {
    const monthlyRate = apr / 100 / 12;
    const numberOfPayments = Math.ceil(
      nper(monthlyRate, -monthlyPayment, balance)
    );
    const totalPayment = monthlyPayment * numberOfPayments;
    return totalPayment;
  }

  function calculateTotalCostOfAllDebts(debts: Debt[]) {
    return debts.reduce(
      (total, debt) =>
        total +
        calculateCostOfSingleDebt(
          Number(debt.amount),
          Number(debt.apr),
          Number(debt.payment)
        ),
      0
    );
  }

  function calculateNewRepayment(
    totalAmount: number,
    aprValue: number,
    termValue: number
  ) {
    const minApr = 4;
    const maxApr = 36;
    const realAprValue = (minApr + (aprValue / 100) * (maxApr - minApr)) / 100;
    const minTerm = 12;
    const maxTerm = 60;
    const realTermValue = Math.round(
      minTerm + (termValue / 100) * (maxTerm - minTerm)
    );
    const monthlyRate = realAprValue / 12;
    const newMonthlyPayment = Math.abs(
      pmt(monthlyRate, realTermValue, -totalAmount)
    );
    const newTotalRepayment = newMonthlyPayment * realTermValue;
    return { newMonthlyPayment, newTotalRepayment };
  }

  return (
    <>
      <div className="border border-[#E5E8EF] p-8">
        <h2 className="text-[#18193F] text-lg font-bold mb-2 tracking-tight">
          CONFIGURE YOUR CONSOLIDATED LOAN
        </h2>
        <p className="text-[#6B6C7E] text-base mb-6">
          Use the sliders below to simulate the new APR and loan term.
        </p>
        <div className="mb-6 flex items-center gap-8">
          <div className="flex flex-col min-w-[120px]">
            <div className="text-xs font-semibold text-[#18193F] mb-1 tracking-wide">
              DESIRED APR
            </div>
            <div className="text-2xl font-bold text-[#00AEEF] mb-2">
              {displayApr}%
            </div>
          </div>
          <div className="flex-1">
            <Slider
              aria-label="Desired APR"
              value={aprValue}
              onChange={(_, v) => setAprValue(typeof v === "number" ? v : v[0])}
              marks={apr_marks}
              step={aprStep}
              sx={{
                color: "#00AEEF",
                height: 8,
                "& .MuiSlider-thumb": {
                  backgroundColor: "#fff",
                  border: "2px solid #00AEEF",
                },
                "& .MuiSlider-markLabel": { fontWeight: 600, color: "#6B6C7E" },
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col min-w-[120px]">
            <div className="text-xs font-semibold text-[#18193F] mb-1 tracking-wide">
              DESIRED LOAN TERM
            </div>
            <div className="text-2xl font-bold text-[#00AEEF] mb-2">
              {displayTerm} months
            </div>
          </div>
          <div className="flex-1">
            <Slider
              aria-label="Desired Loan Term"
              value={termValue}
              onChange={(_, v) =>
                setTermValue(typeof v === "number" ? v : v[0])
              }
              marks={term_marks}
              sx={{
                color: "#00AEEF",
                height: 8,
                "& .MuiSlider-thumb": {
                  backgroundColor: "#fff",
                  border: "2px solid #00AEEF",
                },
                "& .MuiSlider-markLabel": { fontWeight: 600, color: "#6B6C7E" },
              }}
            />
          </div>
        </div>
      </div>
      <div className="border-l border-r border-b border-[#E5E8EF] bg-white">
        <div className="flex">
          <div className="flex flex-col flex-1 border-r border-[#E5E8EF]">
            <div className="px-10 pt-8 pb-0">
              <div className="mb-7 grid grid-cols-2">
                <span className="whitespace-nowrap flex items-center">
                  New Total Repayment
                </span>
                <span className="text-[#00AEEF] text-xl font-bold whitespace-nowrap flex items-center justify-end">
                  {formatCurrency(newTotalRepayment.toFixed(0))}
                </span>
              </div>
              <div className="mb-7 grid grid-cols-2">
                <span className="whitespace-nowrap flex items-center">
                  Current Total Repayment
                </span>
                <span className="text-[#18193F] text-xl font-bold whitespace-nowrap flex items-center justify-end">
                  {formatCurrency(currentTotalRepayment.toFixed(0))}
                </span>
              </div>
            </div>
            <div
              className="grid grid-cols-2 px-10 py-6"
              style={{ background: savingsBgColor(repaymentSavings) }}
            >
              <span className="font-bold whitespace-nowrap flex items-center">
                Total Repayment Savings
              </span>
              <span
                className="text-xl font-bold whitespace-nowrap flex items-center justify-end"
                style={{ color: savingsColor(repaymentSavings) }}
              >
                {formatCurrency(repaymentSavings.toFixed(0))}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="px-10 pt-8 pb-0">
              <div className="mb-7 grid grid-cols-2">
                <span className="whitespace-nowrap flex items-center">
                  New Monthly Payment
                </span>
                <span className="text-[#00AEEF] text-xl font-bold whitespace-nowrap flex items-center justify-end">
                  {formatCurrency(newMonthlyPayment.toFixed(2))}
                </span>
              </div>
              <div className="mb-7 grid grid-cols-2">
                <span className="whitespace-nowrap flex items-center">
                  Current Monthly Payment
                </span>
                <span className="text-[#18193F] text-xl font-bold whitespace-nowrap flex items-center justify-end">
                  {formatCurrency(currentTotalMonthlyPayments.toFixed(0))}
                </span>
              </div>
            </div>
            <div
              className="grid grid-cols-2 px-10 py-6"
              style={{ background: savingsBgColor(monthlySavings) }}
            >
              <span className="font-bold whitespace-nowrap flex items-center">
                Total Monthly Savings
              </span>
              <span
                className="text-xl font-bold whitespace-nowrap flex items-center justify-end"
                style={{ color: savingsColor(monthlySavings) }}
              >
                {formatCurrency(monthlySavings.toFixed(2))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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
