/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface TrouserTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const LENGTH_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
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

export const TrouserTab: React.FC<TrouserTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateTrouser(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'cm') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="trouser" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Pants, Joggers & Trouser Consumption</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Engineered multi-panel bottom consumption for denim jeans, twill chinos, and knit fleece joggers.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Trouser & Leg Dimensions</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="tr_outseam"
                label="Outseam Length (Waist to Hem)"
                value={getVal('tr_outseam', 105)}
                unit={getUnit('tr_outseam', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_outseam', v)}
                onChangeUnit={(u) => onChangeField('tr_outseam', getVal('tr_outseam', 105), u)}
              />

              <FieldWithUnit
                id="tr_thigh"
                label="1/2 Thigh / Leg Width"
                value={getVal('tr_thigh', 32)}
                unit={getUnit('tr_thigh', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_thigh', v)}
                onChangeUnit={(u) => onChangeField('tr_thigh', getVal('tr_thigh', 32), u)}
              />

              <FieldWithUnit
                id="tr_hip"
                label="1/2 Hip (Seat Width)"
                value={getVal('tr_hip', 54)}
                unit={getUnit('tr_hip', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_hip', v)}
                onChangeUnit={(u) => onChangeField('tr_hip', getVal('tr_hip', 54), u)}
              />

              <FieldWithUnit
                id="tr_waistband"
                label="Waistband Height (Folded × 2)"
                value={getVal('tr_waistband', 10)}
                unit={getUnit('tr_waistband', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_waistband', v)}
                onChangeUnit={(u) => onChangeField('tr_waistband', getVal('tr_waistband', 10), u)}
              />

              <FieldWithUnit
                id="tr_pocket"
                label="Pocket Bag Length (Shell Fabric)"
                value={getVal('tr_pocket', 28)}
                unit={getUnit('tr_pocket', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_pocket', v)}
                onChangeUnit={(u) => onChangeField('tr_pocket', getVal('tr_pocket', 28), u)}
              />

              <FieldWithUnit
                id="tr_allowance"
                label="Total Seam & Hem Allowance"
                value={getVal('tr_allowance', 8)}
                unit={getUnit('tr_allowance', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_allowance', v)}
                onChangeUnit={(u) => onChangeField('tr_allowance', getVal('tr_allowance', 8), u)}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Fabric Specs & Production Batch</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="tr_fab_width"
                label="Fabric Cuttable Width"
                value={getVal('tr_fab_width', 56)}
                unit={getUnit('tr_fab_width', 'in')}
                unitOptions={FABRIC_WIDTH_UNITS}
                onChangeValue={(v) => onChangeField('tr_fab_width', v)}
                onChangeUnit={(u) => onChangeField('tr_fab_width', getVal('tr_fab_width', 56), u)}
              />

              <FieldWithUnit
                id="tr_gsm"
                label="Fabric Weight / GSM"
                value={getVal('tr_gsm', 280)}
                unit={getUnit('tr_gsm', 'gsm')}
                unitOptions={GSM_UNITS}
                onChangeValue={(v) => onChangeField('tr_gsm', v)}
                onChangeUnit={(u) => onChangeField('tr_gsm', getVal('tr_gsm', 280), u)}
              />

              <FieldWithUnit
                id="tr_wastage"
                label="Cutting & End Wastage"
                value={getVal('tr_wastage', 8)}
                unit={getUnit('tr_wastage', '%')}
                unitOptions={PERCENT_UNITS}
                onChangeValue={(v) => onChangeField('tr_wastage', v)}
                onChangeUnit={(u) => onChangeField('tr_wastage', getVal('tr_wastage', 8), u)}
              />

              <FieldWithUnit
                id="tr_order_qty"
                label="Order Quantity"
                value={getVal('tr_order_qty', 500)}
                unit={getUnit('tr_order_qty', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('tr_order_qty', v)}
                onChangeUnit={(u) => onChangeField('tr_order_qty', getVal('tr_order_qty', 500), u)}
              />
            </div>
          </div>

          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Express Output As:</span>
              <select
                value={getUnit('tr_target_convention', 'yds_per_pc')}
                onChange={(e) => onChangeField('tr_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="yds_per_pc">Yards per Piece (yd/pc)</option>
                <option value="yds_per_doz">Yards per Dozen (yd/doz)</option>
                <option value="m_per_pc">Meters per Piece (m/pc)</option>
                <option value="kg_per_doz">Kilograms per Dozen (kg/doz)</option>
                <option value="total_yds">Total Yards for Order (yd)</option>
                <option value="total_kg">Total Fabric Weight (kg)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Bottoms Engineering Audit"
          description="4-panel lay width calculation, waistband allowance, and gross yield."
          result={result}
        />
      </div>
    </div>
  );
};
