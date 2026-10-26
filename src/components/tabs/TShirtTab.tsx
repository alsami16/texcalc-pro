/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface TShirtTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const LENGTH_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
  { value: 'yd', label: 'yd' },
];

const ALLOWANCE_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
  { value: 'mm', label: 'mm' },
];

const GSM_UNITS = [
  { value: 'gsm', label: 'GSM (g/m²)' },
  { value: 'kg_m2', label: 'kg/m²' },
  { value: 'oz_yd2', label: 'oz/yd²' },
];

const PERCENT_UNITS = [{ value: '%', label: '%' }];

const QTY_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'doz', label: 'doz' },
];

export const TShirtTab: React.FC<TShirtTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateTShirt(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'cm') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="tshirt" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Knit T-Shirt & Polo Fabric Consumption</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Input garment dimensions with independent units to compute fabric consumption per piece, dozen, and order.
            </p>
          </div>

          {/* Section: Body & Sleeves */}
          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Body & Sleeve Dimensions</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ts_body_length"
                label="Body Length (HPS to Hem)"
                value={getVal('ts_body_length', 72)}
                unit={getUnit('ts_body_length', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ts_body_length', v)}
                onChangeUnit={(u) => onChangeField('ts_body_length', getVal('ts_body_length', 72), u)}
              />

              <FieldWithUnit
                id="ts_half_chest"
                label="Half Chest (1/2 Chest width)"
                value={getVal('ts_half_chest', 52)}
                unit={getUnit('ts_half_chest', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ts_half_chest', v)}
                onChangeUnit={(u) => onChangeField('ts_half_chest', getVal('ts_half_chest', 52), u)}
              />

              <FieldWithUnit
                id="ts_sleeve_length"
                label="Sleeve Length"
                value={getVal('ts_sleeve_length', 22)}
                unit={getUnit('ts_sleeve_length', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ts_sleeve_length', v)}
                onChangeUnit={(u) => onChangeField('ts_sleeve_length', getVal('ts_sleeve_length', 22), u)}
              />

              <FieldWithUnit
                id="ts_sleeve_width"
                label="1/2 Armhole or Sleeve Width"
                value={getVal('ts_sleeve_width', 23)}
                unit={getUnit('ts_sleeve_width', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ts_sleeve_width', v)}
                onChangeUnit={(u) => onChangeField('ts_sleeve_width', getVal('ts_sleeve_width', 23), u)}
              />
            </div>
          </div>

          {/* Section: Allowances & Fabric */}
          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Seam Allowances & Fabric Weight</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ts_len_allowance"
                label="Seam & Hem Length Allowance"
                value={getVal('ts_len_allowance', 6)}
                unit={getUnit('ts_len_allowance', 'cm')}
                unitOptions={ALLOWANCE_UNITS}
                onChangeValue={(v) => onChangeField('ts_len_allowance', v)}
                onChangeUnit={(u) => onChangeField('ts_len_allowance', getVal('ts_len_allowance', 6), u)}
              />

              <FieldWithUnit
                id="ts_wid_allowance"
                label="Seam Width Allowance"
                value={getVal('ts_wid_allowance', 4)}
                unit={getUnit('ts_wid_allowance', 'cm')}
                unitOptions={ALLOWANCE_UNITS}
                onChangeValue={(v) => onChangeField('ts_wid_allowance', v)}
                onChangeUnit={(u) => onChangeField('ts_wid_allowance', getVal('ts_wid_allowance', 4), u)}
              />

              <FieldWithUnit
                id="ts_gsm"
                label="Fabric Weight / GSM"
                value={getVal('ts_gsm', 180)}
                unit={getUnit('ts_gsm', 'gsm')}
                unitOptions={GSM_UNITS}
                onChangeValue={(v) => onChangeField('ts_gsm', v)}
                onChangeUnit={(u) => onChangeField('ts_gsm', getVal('ts_gsm', 180), u)}
              />

              <FieldWithUnit
                id="ts_wastage"
                label="Cutting & Process Wastage"
                value={getVal('ts_wastage', 7)}
                unit={getUnit('ts_wastage', '%')}
                unitOptions={PERCENT_UNITS}
                onChangeValue={(v) => onChangeField('ts_wastage', v)}
                onChangeUnit={(u) => onChangeField('ts_wastage', getVal('ts_wastage', 7), u)}
              />
            </div>
          </div>

          {/* Section: Collar & Rib */}
          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Collar Rib & Production Quantity</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ts_collar_len"
                label="Collar / Rib Length"
                value={getVal('ts_collar_len', 44)}
                unit={getUnit('ts_collar_len', 'cm')}
                unitOptions={ALLOWANCE_UNITS}
                onChangeValue={(v) => onChangeField('ts_collar_len', v)}
                onChangeUnit={(u) => onChangeField('ts_collar_len', getVal('ts_collar_len', 44), u)}
              />

              <FieldWithUnit
                id="ts_collar_wid"
                label="Collar / Rib Width (Height × 2)"
                value={getVal('ts_collar_wid', 5)}
                unit={getUnit('ts_collar_wid', 'cm')}
                unitOptions={ALLOWANCE_UNITS}
                onChangeValue={(v) => onChangeField('ts_collar_wid', v)}
                onChangeUnit={(u) => onChangeField('ts_collar_wid', getVal('ts_collar_wid', 5), u)}
              />

              <FieldWithUnit
                id="ts_rib_gsm"
                label="Rib Weight / GSM"
                value={getVal('ts_rib_gsm', 220)}
                unit={getUnit('ts_rib_gsm', 'gsm')}
                unitOptions={GSM_UNITS}
                onChangeValue={(v) => onChangeField('ts_rib_gsm', v)}
                onChangeUnit={(u) => onChangeField('ts_rib_gsm', getVal('ts_rib_gsm', 220), u)}
              />

              <FieldWithUnit
                id="ts_order_qty"
                label="Production Order Size"
                value={getVal('ts_order_qty', 1000)}
                unit={getUnit('ts_order_qty', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('ts_order_qty', v)}
                onChangeUnit={(u) => onChangeField('ts_order_qty', getVal('ts_order_qty', 1000), u)}
              />
            </div>
          </div>

          {/* Convention Selector */}
          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Express Output As:</span>
              <select
                value={getUnit('ts_target_convention', 'kg_per_doz')}
                onChange={(e) => onChangeField('ts_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="kg_per_doz">Kilograms per Dozen (kg/doz)</option>
                <option value="g_per_pc">Grams per Piece (g/pc)</option>
                <option value="kg_per_pc">Kilograms per Piece (kg/pc)</option>
                <option value="lb_per_doz">Pounds per Dozen (lb/doz)</option>
                <option value="lb_per_pc">Pounds per Piece (lb/pc)</option>
                <option value="total_kg">Total Order Fabric Weight (kg)</option>
                <option value="total_lbs">Total Order Fabric Weight (lbs)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Audit & Results Column */}
      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Knit Consumption Engineering Audit"
          description="Standardized Solinger/Textile equation with normalized dimensions and wastage audit."
          result={result}
        />
      </div>
    </div>
  );
};
