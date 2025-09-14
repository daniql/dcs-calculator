import { useState } from "react";
import { Debt } from "@/app/types/debt";
import { Slider } from "@mui/material";
import { nper, pmt } from "financial";

interface CalculationComponentProps {
  debts: Debt[];
}

export default function CalculationComponent({
  debts,
}: CalculationComponentProps) {
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
                color: "#E5E8EF",
                height: 8,
                "& .MuiSlider-thumb": {
                  backgroundColor: "#fff",
                  border: "2px solid #00AEEF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#00AEEF",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#E5E8EF",
                  opacity: 1,
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
                color: "#E5E8EF",
                height: 8,
                "& .MuiSlider-thumb": {
                  backgroundColor: "#fff",
                  border: "2px solid #00AEEF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#00AEEF",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#E5E8EF",
                  opacity: 1,
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
            <div className="px-7 pt-8 pb-0">
              <div className="mb-7 flex justify-between items-center gap-4">
                <span className="whitespace-nowrap flex items-center text-sm">
                  New Total Repayment
                </span>
                <span className="text-[#00AEEF] text-xl font-bold whitespace-nowrap flex items-center">
                  {formatCurrency(newTotalRepayment.toFixed(0))}
                </span>
              </div>
              <div className="mb-7 flex justify-between items-center gap-4">
                <span className="whitespace-nowrap flex items-center text-sm">
                  Current Total Repayment
                </span>
                <span className="text-[#18193F] text-xl font-bold whitespace-nowrap flex items-center">
                  {formatCurrency(currentTotalRepayment.toFixed(0))}
                </span>
              </div>
            </div>
            <div
              className="flex justify-between items-center gap-4 px-7 py-6"
              style={{ background: savingsBgColor(repaymentSavings) }}
            >
              <span className="font-bold whitespace-nowrap flex items-center text-sm">
                Total Repayment Savings
              </span>
              <span
                className="text-xl font-bold whitespace-nowrap flex items-center"
                style={{ color: savingsColor(repaymentSavings) }}
              >
                {formatCurrency(repaymentSavings.toFixed(0))}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="px-7 pt-8 pb-0">
              <div className="mb-7 flex justify-between items-center gap-4">
                <span className="whitespace-nowrap flex items-center text-sm">
                  New Monthly Payment
                </span>
                <span className="text-[#00AEEF] text-xl font-bold whitespace-nowrap flex items-center">
                  {formatCurrency(newMonthlyPayment.toFixed(2))}
                </span>
              </div>
              <div className="mb-7 flex justify-between items-center gap-4">
                <span className="whitespace-nowrap flex items-center text-sm">
                  Current Monthly Payment
                </span>
                <span className="text-[#18193F] text-xl font-bold whitespace-nowrap flex items-center">
                  {formatCurrency(currentTotalMonthlyPayments.toFixed(0))}
                </span>
              </div>
            </div>
            <div
              className="flex justify-between items-center gap-4 px-7 py-6"
              style={{ background: savingsBgColor(monthlySavings) }}
            >
              <span className="font-bold whitespace-nowrap flex items-center text-sm">
                Total Monthly Savings
              </span>
              <span
                className="text-xl font-bold whitespace-nowrap flex items-center"
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
