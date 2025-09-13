import { Debt } from "@/app/types/debt";

interface RowProps {
  showDelete?: boolean;
  onDelete?: () => void;
  values: Debt;
  onChange: (field: keyof Debt, value: string) => void;
  highlight?: boolean;
}

export default function Row({
  showDelete,
  onDelete,
  values,
  onChange,
  highlight,
}: RowProps) {
  const handleKeyPress = (event: any) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isValid = new RegExp("[0-9.]").test(keyValue);

    if (!isValid) {
      event.preventDefault();
    }
  };

  return (
    <div
      className={`grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-2 mb-2 items-center relative ${
        highlight ? "bg-blue-100" : ""
      }`}
    >
      <div>
        <div className="flex w-full h-10 border border-[#E5E8EF]">
          <input
            type="text"
            placeholder="e.g. Medical"
            className="bg-blue-50 px-4 py-2 text-[#18193F] w-full outline-none h-full"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
      </div>
      <div>
        <div className="flex w-full h-10 border border-[#E5E8EF]">
          <span className="flex items-center justify-center text-[#6B6C7E] px-3 bg-white border-r border-[#E5E8EF] h-full">
            $
          </span>
          <input
            type="number"
            placeholder="5000"
            className="bg-blue-50 outline-none border-none w-full text-[#18193F] h-full px-2"
            value={values.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <div>
        <div className="flex w-full h-10 border border-[#E5E8EF]">
          <input
            type="number"
            step="0.01"
            placeholder="15.99"
            className="bg-blue-50 outline-none border-none w-full text-[#18193F] h-full px-2"
            value={values.apr}
            onChange={(e) => onChange("apr", e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <span className="flex items-center justify-center text-[#6B6C7E] px-3 bg-white border-l border-[#E5E8EF] h-full">
            %
          </span>
        </div>
      </div>
      <div className="min-w-[120px]">
        <div className="flex w-full h-10 border border-[#E5E8EF]">
          <span className="flex items-center justify-center text-[#6B6C7E] px-3 bg-white border-r border-[#E5E8EF] h-full">
            $
          </span>
          <input
            type="number"
            placeholder="200"
            className="bg-blue-50 outline-none border-none w-full text-[#18193F] h-full px-2"
            value={values.payment}
            onChange={(e) => onChange("payment", e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <div className="justify-self-end">
        {showDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-3xl font-extrabold text-gray-500 hover:text-gray-700 outline-none flex items-center justify-center cursor-pointer"
            aria-label="Delete row"
            style={{ width: "32px", height: "32px" }}
          >
            <span
              className="inline-block align-middle"
              style={{ fontWeight: 900, fontSize: "2rem", lineHeight: "1" }}
            >
              &times;
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
