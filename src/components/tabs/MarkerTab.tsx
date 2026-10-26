/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface MarkerTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const LENGTH_UNITS = [
  { value: 'm', label: 'm' },
  { value: 'yd', label: 'yd' },
  { value: 'in', label: 'inches' },
  { value: 'cm', label: 'cm' },
];

const WIDTH_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
  { value: 'm', label: 'm' },
  { value: 'mm', label: 'mm' },
];

const AREA_UNITS = [
  { value: 'm2', label: 'm²' },
  { value: 'ft2', label: 'ft²' },
  { value: 'in2', label: 'in²' },
  { value: 'yd2', label: 'yd²' },
];

const RATIO_UNITS = [{ value: 'pcs', label: 'garments' }];

const GSM_UNITS = [
  { value: 'gsm', label: 'GSM (g/m²)' },
  { value: 'oz_yd2', label: 'oz/yd²' },
];

const END_LOSS_UNITS = [
  { value: 'in', label: 'inches' },
  { value: 'cm', label: 'cm' },
  { value: 'mm', label: 'mm' },
];

const PLY_UNITS = [{ value: 'plies', label: 'plies' }];

const QTY_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'doz', label: 'doz' },
];

export const MarkerTab: React.FC<MarkerTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateMarker(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'm') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="marker" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Marker Planning & Cut Efficiency</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze marker table efficiency, calculate required plies, lay count, and total roll yardage.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Marker Table & Pattern Geometry</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="mk_length"
                label="Marker Length"
                value={getVal('mk_length', 6.5)}
                unit={getUnit('mk_length', 'm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('mk_length', v)}
                onChangeUnit={(u) => onChangeField('mk_length', getVal('mk_length', 6.5), u)}
              />

              <FieldWithUnit
                id="mk_width"
                label="Marker Cuttable Width"
                value={getVal('mk_width', 150)}
                unit={getUnit('mk_width', 'cm')}
                unitOptions={WIDTH_UNITS}
                onChangeValue={(v) => onChangeField('mk_width', v)}
                onChangeUnit={(u) => onChangeField('mk_width', getVal('mk_width', 150), u)}
              />

              <FieldWithUnit
                id="mk_garment_ratio"
                label="Garments in Marker (Ratio)"
                value={getVal('mk_garment_ratio', 4)}
                unit={getUnit('mk_garment_ratio', 'pcs')}
                unitOptions={RATIO_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('mk_garment_ratio', v)}
                onChangeUnit={(u) => onChangeField('mk_garment_ratio', getVal('mk_garment_ratio', 4), u)}
              />

              <FieldWithUnit
                id="mk_pattern_area"
                label="Net Pattern Area (Per Garment)"
                value={getVal('mk_pattern_area', 1.8)}
                unit={getUnit('mk_pattern_area', 'm2')}
                unitOptions={AREA_UNITS}
                onChangeValue={(v) => onChangeField('mk_pattern_area', v)}
                onChangeUnit={(u) => onChangeField('mk_pattern_area', getVal('mk_pattern_area', 1.8), u)}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Cut Order & Table Capacity</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="mk_total_pcs"
                label="Total Order Garments"
                value={getVal('mk_total_pcs', 2400)}
                unit={getUnit('mk_total_pcs', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('mk_total_pcs', v)}
                onChangeUnit={(u) => onChangeField('mk_total_pcs', getVal('mk_total_pcs', 2400), u)}
              />

              <FieldWithUnit
                id="mk_gsm"
                label="Fabric GSM"
                value={getVal('mk_gsm', 190)}
                unit={getUnit('mk_gsm', 'gsm')}
                unitOptions={GSM_UNITS}
                onChangeValue={(v) => onChangeField('mk_gsm', v)}
                onChangeUnit={(u) => onChangeField('mk_gsm', getVal('mk_gsm', 190), u)}
              />

              <FieldWithUnit
                id="mk_end_loss"
                label="End Loss / Lay End Allowance"
                value={getVal('mk_end_loss', 2)}
                unit={getUnit('mk_end_loss', 'in')}
                unitOptions={END_LOSS_UNITS}
                onChangeValue={(v) => onChangeField('mk_end_loss', v)}
                onChangeUnit={(u) => onChangeField('mk_end_loss', getVal('mk_end_loss', 2), u)}
              />

              <FieldWithUnit
                id="mk_plies"
                label="Plies per Lay (Max Table Capacity)"
                value={getVal('mk_plies', 100)}
                unit={getUnit('mk_plies', 'plies')}
                unitOptions={PLY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('mk_plies', v)}
                onChangeUnit={(u) => onChangeField('mk_plies', getVal('mk_plies', 100), u)}
              />
            </div>
          </div>

          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Express Fabric Total As:</span>
              <select
                value={getUnit('mk_target_convention', 'total_meters')}
                onChange={(e) => onChangeField('mk_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="total_meters">Total Linear Meters (m)</option>
                <option value="total_yards">Total Linear Yards (yd)</option>
                <option value="total_kg">Total Weight Required (kg)</option>
                <option value="total_lbs">Total Weight Required (lbs)</option>
                <option value="consumption_per_pc_m">Consumption per Garment (m/pc)</option>
                <option value="consumption_per_pc_yd">Consumption per Garment (yd/pc)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Marker Planning & Cut Audit"
          description="Surface efficiency percentage, lay schedules, and fabric yardage requirements."
          result={result}
        />
      </div>
    </div>
  );
};
