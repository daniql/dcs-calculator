"use client";
import { useState } from "react";
import { Button } from "@mui/material";
import { Debt } from "@/app/types/debt";
import Row from "@/app/ui/row";

interface InputViewProps {
  debts: Debt[];
  setDebts: (debts: Debt[]) => void;
  onCalculate?: () => void;
}

export default function InputView({
  debts,
  setDebts,
  onCalculate,
}: InputViewProps) {
  const [invalidRows, setInvalidRows] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDebtChange = (idx: number, field: keyof Debt, value: string) => {
    const updated = [...debts];
    updated[idx] = { ...updated[idx], [field]: value };
    setDebts(updated);
  };

  const addRow = () => {
    setDebts([...debts, { name: "", amount: "", apr: "", payment: "" }]);
  };

  const deleteRow = (idx: number) => {
    setDebts(debts.filter((_, i) => i !== idx));
  };

  const handleCalculate = () => {
    const invalid: number[] = debts
      .map((debt, idx) =>
        debt.name.trim() === "" ||
        debt.amount.trim() === "" ||
        debt.apr.trim() === "" ||
        debt.payment.trim() === ""
          ? idx
          : -1
      )
      .filter((idx) => idx !== -1);
    setInvalidRows(invalid);
    setShowTooltip(invalid.length > 0);
    if (invalid.length > 0) {
      setTimeout(() => {
        setInvalidRows([]);
      }, 1000);
    }
    if (invalid.length === 0 && onCalculate) {
      onCalculate();
    }
  };

  return (
    <div className="bg-white max-w-3xl mx-2">
      <div className="font-bold mb-3 tracking-tight">
        ENTER YOUR CURRENT DEBTS
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-2 mb-1">
        <div className="text-[11px] text-gray-700 tracking-wide leading-tight whitespace-nowrap">
          DEBT NAME
        </div>
        <div className="text-[11px] text-gray-700 tracking-wide leading-tight whitespace-nowrap">
          REMAINING DEBT AMOUNT
        </div>
        <div className="text-[11px] text-gray-700 tracking-wide leading-tight whitespace-nowrap">
          CURRENT APR
        </div>
        <div className="text-[10px] text-gray-700 tracking-wide leading-tight whitespace-nowrap">
          CURRENT MONTHLY PAYMENT
        </div>
        <div></div>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        {debts.map((_, idx) => (
          <Row
            key={idx}
            showDelete={idx > 0}
            onDelete={() => deleteRow(idx)}
            values={debts[idx]}
            onChange={(field, value) =>
              handleDebtChange(idx, field as keyof Debt, value)
            }
            highlight={invalidRows.includes(idx)}
          />
        ))}
      </div>
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center text-sky-500 font-semibold focus:outline-none cursor-pointer"
        >
          <span className="mr-2 text-2xl font-bold">+</span>
          Add Another Debt
        </button>
      </div>
      <div className="w-full relative">
        <Button
          variant="contained"
          onClick={handleCalculate}
          sx={{
            textTransform: "none",
            backgroundColor: "#00AEEF",
            fontWeight: 600,
            fontSize: "1.25rem",
            paddingY: 1.5,
            borderRadius: 1,
            boxShadow: "none",
            width: "100%",
            "&:hover": { backgroundColor: "#0096D6", boxShadow: "none" },
          }}
        >
          Calculate Savings
        </Button>
        {showTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 text-sky-500 text-xs px-3 py-1 z-10">
            Please make sure all fields are properly filled
          </div>
        )}
      </div>
    </div>
  );
}
