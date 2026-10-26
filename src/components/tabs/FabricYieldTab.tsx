/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface FabricYieldTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const GSM_UNITS = [
  { value: 'gsm', label: 'GSM (g/m²)' },
  { value: 'oz_yd2', label: 'oz/yd²' },
  { value: 'kg_m2', label: 'kg/m²' },
];

const WIDTH_UNITS = [
  { value: 'in', label: 'inches' },
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'mm', label: 'mm' },
];

export const FabricYieldTab: React.FC<FabricYieldTabProps> = ({
  state,
  onChangeField,
  onApplyPreset,
}) => {
  const result = Calculators.calculateFabricYield(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'gsm') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="yield" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Fabric Weight & Yield Converter</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bidirectional conversion between areal weight (GSM), linear roll weight (GLM), and linear yield (m/kg, yd/kg, yd/lb).
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Fabric Roll Parameters</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="fy_gsm"
                label="Fabric Weight / Density"
                value={getVal('fy_gsm', 200)}
                unit={getUnit('fy_gsm', 'gsm')}
                unitOptions={GSM_UNITS}
                onChangeValue={(v) => onChangeField('fy_gsm', v)}
                onChangeUnit={(u) => onChangeField('fy_gsm', getVal('fy_gsm', 200), u)}
              />

              <FieldWithUnit
                id="fy_width"
                label="Cuttable Fabric Width"
                value={getVal('fy_width', 60)}
                unit={getUnit('fy_width', 'in')}
                unitOptions={WIDTH_UNITS}
                onChangeValue={(v) => onChangeField('fy_width', v)}
                onChangeUnit={(u) => onChangeField('fy_width', getVal('fy_width', 60), u)}
              />
            </div>
          </div>

          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Target Conversion Metric
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Compute:</span>
              <select
                value={getUnit('fy_target_convention', 'm_per_kg')}
                onChange={(e) => onChangeField('fy_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="m_per_kg">Linear Meters per Kilogram (m/kg)</option>
                <option value="yd_per_kg">Linear Yards per Kilogram (yd/kg)</option>
                <option value="yd_per_lb">Linear Yards per Pound (yd/lb)</option>
                <option value="g_per_m">Linear Weight: Grams per Linear Meter (g/m)</option>
                <option value="oz_per_yd">Linear Weight: Ounces per Linear Yard (oz/yd)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Fabric Yield Equivalents"
          description="Cross-converted metrics for production roll procurement and inspection."
          result={result}
        />
      </div>
    </div>
  );
};
