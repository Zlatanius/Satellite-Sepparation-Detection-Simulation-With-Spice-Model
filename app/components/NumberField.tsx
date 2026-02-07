import React, { useState, useEffect } from "react";

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;

  min: number;
  max: number;
  step: number;

  icon?: React.ReactNode;
  suffix?: string;
  help?: string;
  displayValue?: string;
};

export default function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  icon,
  suffix,
  help,
  displayValue,
}: NumberFieldProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only call onChange if the value is a valid number
    if (newValue !== "" && !isNaN(Number(newValue))) {
      onChange(Number(newValue));
    }
  };

  const handleBlur = () => {
    // On blur, ensure we have a valid value
    if (inputValue === "" || isNaN(Number(inputValue))) {
      setInputValue(value.toString());
    }
  };

  return (
    <div className="rounded-xl border border-purple-500/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            {icon ? <span className="text-purple-200">{icon}</span> : null}
            <span>{label}</span>
          </div>
          {help ? (
            <div className="mt-1 text-[11px] text-zinc-500">{help}</div>
          ) : null}
        </div>

        <div className="text-xs text-zinc-400">
          {displayValue ?? value}
          {suffix ? ` ${suffix}` : ""}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full rounded-lg border border-purple-500/15 bg-[#070312] px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-purple-400/35"
        />
        {suffix ? (
          <div className="rounded-lg border border-purple-500/15 bg-[#070312] px-2 py-2 text-xs text-zinc-300">
            {suffix}
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span>min {min}</span>
        <span>max {max}</span>
      </div>
    </div>
  );
}
