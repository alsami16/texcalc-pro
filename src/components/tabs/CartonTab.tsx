/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface CartonTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const DIM_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
];

const WEIGHT_UNITS = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lbs' },
];

const PACK_UNITS = [{ value: 'pcs', label: 'pcs/carton' }];

const QTY_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'doz', label: 'doz' },
];

export const CartonTab: React.FC<CartonTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateCarton(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'cm') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="carton" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Carton Dimension, CBM & Freight Logistics</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculate total cubic meters (CBM), cubic feet, carton quantity, and air freight volumetric chargeable weight.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Master Carton Outer Dimensions</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldWithUnit
                id="ct_len"
                label="Carton Length (L)"
                value={getVal('ct_len', 60)}
                unit={getUnit('ct_len', 'cm')}
                unitOptions={DIM_UNITS}
                onChangeValue={(v) => onChangeField('ct_len', v)}
                onChangeUnit={(u) => onChangeField('ct_len', getVal('ct_len', 60), u)}
              />

              <FieldWithUnit
                id="ct_wid"
                label="Carton Width (W)"
                value={getVal('ct_wid', 40)}
                unit={getUnit('ct_wid', 'cm')}
                unitOptions={DIM_UNITS}
                onChangeValue={(v) => onChangeField('ct_wid', v)}
                onChangeUnit={(u) => onChangeField('ct_wid', getVal('ct_wid', 40), u)}
              />

              <FieldWithUnit
                id="ct_hgt"
                label="Carton Height (H)"
                value={getVal('ct_hgt', 30)}
                unit={getUnit('ct_hgt', 'cm')}
                unitOptions={DIM_UNITS}
                onChangeValue={(v) => onChangeField('ct_hgt', v)}
                onChangeUnit={(u) => onChangeField('ct_hgt', getVal('ct_hgt', 30), u)}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Packaging Ratio & Weight Parameters</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ct_pack_ratio"
                label="Garments per Carton"
                value={getVal('ct_pack_ratio', 48)}
                unit={getUnit('ct_pack_ratio', 'pcs')}
                unitOptions={PACK_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('ct_pack_ratio', v)}
                onChangeUnit={(u) => onChangeField('ct_pack_ratio', getVal('ct_pack_ratio', 48), u)}
              />

              <FieldWithUnit
                id="ct_order_qty"
                label="Total Garments to Pack"
                value={getVal('ct_order_qty', 4800)}
                unit={getUnit('ct_order_qty', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('ct_order_qty', v)}
                onChangeUnit={(u) => onChangeField('ct_order_qty', getVal('ct_order_qty', 4800), u)}
              />

              <FieldWithUnit
                id="ct_weight"
                label="Gross Weight per Carton"
                value={getVal('ct_weight', 12.5)}
                unit={getUnit('ct_weight', 'kg')}
                unitOptions={WEIGHT_UNITS}
                onChangeValue={(v) => onChangeField('ct_weight', v)}
                onChangeUnit={(u) => onChangeField('ct_weight', getVal('ct_weight', 12.5), u)}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ct_divisor" className="text-xs font-medium text-slate-300">
                  Air Freight Volumetric Divisor
                </label>
                <div className="bg-[#090d16] border border-[#1f293d] rounded-lg overflow-hidden focus-within:border-blue-500">
                  <select
                    id="ct_divisor"
                    value={getVal('ct_divisor', 6000)}
                    onChange={(e) => onChangeField('ct_divisor', parseFloat(e.target.value))}
                    className="w-full bg-transparent px-3 py-2 text-xs font-medium text-blue-200 outline-none cursor-pointer"
                  >
                    <option value={6000} className="bg-[#0f172a] text-slate-200">
                      IATA Standard: 6000 cm³/kg
                    </option>
                    <option value={5000} className="bg-[#0f172a] text-slate-200">
                      Courier / Express: 5000 cm³/kg
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Express Volume As:</span>
              <select
                value={getUnit('ct_target_convention', 'total_cbm')}
                onChange={(e) => onChangeField('ct_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="total_cbm">Total Order CBM (Cubic Meters - m³)</option>
                <option value="cbm_per_carton">CBM per Carton (m³/ctn)</option>
                <option value="total_cuft">Total Cubic Feet (ft³)</option>
                <option value="total_air_vol_kg">Total Air Volumetric Weight (kg)</option>
                <option value="total_cartons">Total Number of Cartons</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Freight & Packaging Logistics Audit"
          description="CBM volume calculations, actual weight vs volumetric air weight comparison."
          result={result}
        />
      </div>
    </div>
  );
};
