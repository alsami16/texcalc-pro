/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface WovenShirtTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const LENGTH_UNITS = [
  { value: 'in', label: 'inches' },
  { value: 'cm', label: 'cm' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
  { value: 'yd', label: 'yd' },
];

const FABRIC_WIDTH_UNITS = [
  { value: 'in', label: 'inches' },
  { value: 'cm', label: 'cm' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
];

const GSM_UNITS = [
  { value: 'gsm', label: 'GSM (g/m²)' },
  { value: 'oz_yd2', label: 'oz/yd²' },
  { value: 'kg_m2', label: 'kg/m²' },
];

const PERCENT_UNITS = [{ value: '%', label: '%' }];

const QTY_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'doz', label: 'doz' },
];

export const WovenShirtTab: React.FC<WovenShirtTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateWovenShirt(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'in') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="woven" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Woven Shirt Fabric Consumption</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculate linear yards and meters required based on cuttable fabric width and pattern allowance.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Garment Component Measurements</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ws_body_len"
                label="Body Length (Center Back)"
                value={getVal('ws_body_len', 31)}
                unit={getUnit('ws_body_len', 'in')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ws_body_len', v)}
                onChangeUnit={(u) => onChangeField('ws_body_len', getVal('ws_body_len', 31), u)}
              />

              <FieldWithUnit
                id="ws_chest_width"
                label="Chest Width (Full Circumference)"
                value={getVal('ws_chest_width', 44)}
                unit={getUnit('ws_chest_width', 'in')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ws_chest_width', v)}
                onChangeUnit={(u) => onChangeField('ws_chest_width', getVal('ws_chest_width', 44), u)}
              />

              <FieldWithUnit
                id="ws_sleeve_len"
                label="Sleeve Length"
                value={getVal('ws_sleeve_len', 25)}
                unit={getUnit('ws_sleeve_len', 'in')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ws_sleeve_len', v)}
                onChangeUnit={(u) => onChangeField('ws_sleeve_len', getVal('ws_sleeve_len', 25), u)}
              />

              <FieldWithUnit
                id="ws_parts_allowance"
                label="Collar, Cuffs & Pocket Allowance"
                value={getVal('ws_parts_allowance', 12)}
                unit={getUnit('ws_parts_allowance', 'in')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('ws_parts_allowance', v)}
                onChangeUnit={(u) => onChangeField('ws_parts_allowance', getVal('ws_parts_allowance', 12), u)}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Fabric Specifications & Roll Parameters</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ws_fabric_width"
                label="Cuttable Fabric Width"
                value={getVal('ws_fabric_width', 58)}
                unit={getUnit('ws_fabric_width', 'in')}
                unitOptions={FABRIC_WIDTH_UNITS}
                onChangeValue={(v) => onChangeField('ws_fabric_width', v)}
                onChangeUnit={(u) => onChangeField('ws_fabric_width', getVal('ws_fabric_width', 58), u)}
              />

              <FieldWithUnit
                id="ws_fabric_gsm"
                label="Fabric Weight / GSM"
                value={getVal('ws_fabric_gsm', 120)}
                unit={getUnit('ws_fabric_gsm', 'gsm')}
                unitOptions={GSM_UNITS}
                onChangeValue={(v) => onChangeField('ws_fabric_gsm', v)}
                onChangeUnit={(u) => onChangeField('ws_fabric_gsm', getVal('ws_fabric_gsm', 120), u)}
              />

              <FieldWithUnit
                id="ws_wastage"
                label="Cutting & Marker Wastage"
                value={getVal('ws_wastage', 5)}
                unit={getUnit('ws_wastage', '%')}
                unitOptions={PERCENT_UNITS}
                onChangeValue={(v) => onChangeField('ws_wastage', v)}
                onChangeUnit={(u) => onChangeField('ws_wastage', getVal('ws_wastage', 5), u)}
              />

              <FieldWithUnit
                id="ws_order_qty"
                label="Order Quantity"
                value={getVal('ws_order_qty', 1200)}
                unit={getUnit('ws_order_qty', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('ws_order_qty', v)}
                onChangeUnit={(u) => onChangeField('ws_order_qty', getVal('ws_order_qty', 1200), u)}
              />
            </div>
          </div>

          {/* Target Convention */}
          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Express Output As:</span>
              <select
                value={getUnit('ws_target_convention', 'yds_per_pc')}
                onChange={(e) => onChangeField('ws_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="yds_per_pc">Yards per Piece (yd/pc)</option>
                <option value="yds_per_doz">Yards per Dozen (yd/doz)</option>
                <option value="m_per_pc">Meters per Piece (m/pc)</option>
                <option value="m_per_doz">Meters per Dozen (m/doz)</option>
                <option value="total_yds">Total Yards for Order (yd)</option>
                <option value="total_m">Total Meters for Order (m)</option>
                <option value="total_kg">Total Fabric Weight (kg)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Woven Shirt Yardage Audit"
          description="Standard cutting length, lay width multiplier, and linear yardage schedule."
          result={result}
        />
      </div>
    </div>
  );
};
