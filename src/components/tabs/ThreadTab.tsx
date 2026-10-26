/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface ThreadTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const LENGTH_UNITS = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
  { value: 'm', label: 'm' },
  { value: 'yd', label: 'yd' },
];

const DENSITY_UNITS = [
  { value: 'spi', label: 'Stitches/Inch (SPI)' },
  { value: 'spc', label: 'Stitches/Centimeter (SPC)' },
];

const THICKNESS_UNITS = [
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'inches' },
];

const PERCENT_UNITS = [{ value: '%', label: '%' }];

const QTY_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'doz', label: 'doz' },
];

const CONE_UNITS = [
  { value: 'm', label: 'meters' },
  { value: 'yd', label: 'yards' },
];

const STITCH_OPTIONS = [
  { value: '301_lock', label: 'ISO 301 - Lockstitch (Base Factor ~ 2.8)' },
  { value: '401_chain', label: 'ISO 401 - Single Needle Chainstitch (Base Factor ~ 4.5)' },
  { value: '504_overlock', label: 'ISO 504 - 3-Thread Overlock (Base Factor ~ 14.0)' },
  { value: '514_safety', label: 'ISO 514 - 4-Thread Overlock Mock Safety (Base Factor ~ 18.0)' },
  { value: '602_cover', label: 'ISO 602 - 4-Thread Coverstitch / Flatlock (Base Factor ~ 22.0)' },
  { value: '605_cover', label: 'ISO 605 - 5-Thread Top & Bottom Coverstitch (Base Factor ~ 28.0)' },
];

export const ThreadTab: React.FC<ThreadTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateThread(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'cm') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="thread" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Sewing Thread Engineering & Cone Tally</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculate thread requirements per stitch type, seam density (SPI), seam length, and thread cones.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Seam Parameters & Stitch Class</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="th_seam_len"
                label="Total Garment Seam Length"
                value={getVal('th_seam_len', 380)}
                unit={getUnit('th_seam_len', 'cm')}
                unitOptions={LENGTH_UNITS}
                onChangeValue={(v) => onChangeField('th_seam_len', v)}
                onChangeUnit={(u) => onChangeField('th_seam_len', getVal('th_seam_len', 380), u)}
              />

              <FieldWithUnit
                id="th_spi"
                label="Stitch Density (SPI / SPC)"
                value={getVal('th_spi', 12)}
                unit={getUnit('th_spi', 'spi')}
                unitOptions={DENSITY_UNITS}
                onChangeValue={(v) => onChangeField('th_spi', v)}
                onChangeUnit={(u) => onChangeField('th_spi', getVal('th_spi', 12), u)}
              />

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="th_stitch_type" className="text-xs font-medium text-slate-300">
                  ISO Stitch Class & Factor
                </label>
                <div className="bg-[#090d16] border border-[#1f293d] rounded-lg overflow-hidden focus-within:border-blue-500">
                  <select
                    id="th_stitch_type"
                    value={getUnit('th_stitch_type', '504_overlock')}
                    onChange={(e) => onChangeField('th_stitch_type', 0, e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs font-medium text-blue-200 outline-none cursor-pointer"
                  >
                    {STITCH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0f172a] text-slate-200">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <FieldWithUnit
                id="th_thickness"
                label="Seam Thickness / Plies"
                value={getVal('th_thickness', 1.5)}
                unit={getUnit('th_thickness', 'mm')}
                unitOptions={THICKNESS_UNITS}
                onChangeValue={(v) => onChangeField('th_thickness', v)}
                onChangeUnit={(u) => onChangeField('th_thickness', getVal('th_thickness', 1.5), u)}
              />

              <FieldWithUnit
                id="th_wastage"
                label="Thread Wastage & Tail Allowance"
                value={getVal('th_wastage', 15)}
                unit={getUnit('th_wastage', '%')}
                unitOptions={PERCENT_UNITS}
                onChangeValue={(v) => onChangeField('th_wastage', v)}
                onChangeUnit={(u) => onChangeField('th_wastage', getVal('th_wastage', 15), u)}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Production Order & Spool Capacity</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="th_order_qty"
                label="Order Quantity"
                value={getVal('th_order_qty', 2500)}
                unit={getUnit('th_order_qty', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('th_order_qty', v)}
                onChangeUnit={(u) => onChangeField('th_order_qty', getVal('th_order_qty', 2500), u)}
              />

              <FieldWithUnit
                id="th_cone_len"
                label="Thread Cone / Spool Length"
                value={getVal('th_cone_len', 5000)}
                unit={getUnit('th_cone_len', 'm')}
                unitOptions={CONE_UNITS}
                onChangeValue={(v) => onChangeField('th_cone_len', v)}
                onChangeUnit={(u) => onChangeField('th_cone_len', getVal('th_cone_len', 5000), u)}
              />
            </div>
          </div>

          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Express Thread As:</span>
              <select
                value={getUnit('th_target_convention', 'm_per_pc')}
                onChange={(e) => onChangeField('th_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="m_per_pc">Meters per Garment (m/pc)</option>
                <option value="yd_per_pc">Yards per Garment (yd/pc)</option>
                <option value="total_cones">Total Thread Cones Required</option>
                <option value="total_m">Total Order Thread (m)</option>
                <option value="total_yd">Total Order Thread (yd)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Sewing Thread Consumption Audit"
          description="ISO stitch factor multipliers, seam thickness adjustments, and spool requirements."
          result={result}
        />
      </div>
    </div>
  );
};
