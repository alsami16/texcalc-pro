/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface UnitOption {
  value: string;
  label: string;
}

interface FieldWithUnitProps {
  id: string;
  label: string;
  value: number;
  unit: string;
  unitOptions: UnitOption[];
  onChangeValue: (newVal: number) => void;
  onChangeUnit: (newUnit: string) => void;
  min?: number;
  step?: number | string;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export const FieldWithUnit: React.FC<FieldWithUnitProps> = ({
  id,
  label,
  value,
  unit,
  unitOptions,
  onChangeValue,
  onChangeUnit,
  min = 0,
  step = 'any',
  placeholder,
  hint,
  error,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
        <label htmlFor={id} className="cursor-pointer">
          {label}
        </label>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>

      <div
        className={`flex items-stretch rounded-lg overflow-hidden border transition-all duration-150 ${
          error
            ? 'border-red-500/70 bg-red-950/10 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
            : 'border-[#1f293d] bg-[#090d16] focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-blue-500/20'
        }`}
      >
        <input
          type="number"
          id={id}
          value={isNaN(value) ? '' : value}
          min={min}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onChangeValue(isNaN(val) ? 0 : val);
          }}
          className="flex-1 min-w-0 bg-transparent border-0 outline-none px-3.5 py-2 font-mono text-sm text-slate-100 placeholder-slate-600 focus:ring-0"
        />

        <select
          id={`${id}_unit`}
          value={unit}
          disabled={disabled || unitOptions.length === 1}
          onChange={(e) => onChangeUnit(e.target.value)}
          className="bg-[#141d2e] border-0 border-l border-[#1f293d] outline-none px-3 py-2 text-xs font-medium text-blue-300 hover:bg-[#1b263b] cursor-pointer min-w-[76px] transition-colors focus:ring-0"
        >
          {unitOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0f172a] text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
    </div>
  );
};
