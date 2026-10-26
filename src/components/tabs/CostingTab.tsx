/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldWithUnit } from '../FieldWithUnit';
import { AuditPanel } from '../AuditPanel';
import { PresetSelector } from '../PresetSelector';
import { Calculators } from '../../engine/calculators';

interface CostingTabProps {
  state: Record<string, { value: number; unit: string }>;
  onChangeField: (id: string, value: number, unit?: string) => void;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

const CONSUMPTION_UNITS = [
  { value: 'kg_per_doz', label: 'kg/doz' },
  { value: 'yds_per_doz', label: 'yd/doz' },
  { value: 'm_per_doz', label: 'm/doz' },
  { value: 'kg_per_pc', label: 'kg/pc' },
  { value: 'yds_per_pc', label: 'yd/pc' },
];

const CURRENCY_UNITS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const COST_BASIS_UNITS = [
  { value: 'per_doz', label: '/dozen' },
  { value: 'per_pc', label: '/piece' },
];

const PERCENT_UNITS = [{ value: '%', label: '%' }];

const QTY_UNITS = [
  { value: 'pcs', label: 'pcs' },
  { value: 'doz', label: 'doz' },
];

export const CostingTab: React.FC<CostingTabProps> = ({ state, onChangeField, onApplyPreset }) => {
  const result = Calculators.calculateCosting(state);

  const getVal = (id: string, defaultVal: number = 0) => state[id]?.value ?? defaultVal;
  const getUnit = (id: string, defaultUnit: string = 'kg_per_doz') => state[id]?.unit ?? defaultUnit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
        <PresetSelector currentTab="costing" onApplyPreset={onApplyPreset} />

        <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
          <div className="border-b border-[#1f293d] pb-3">
            <h2 className="text-base font-semibold text-white">Garment Manufacturing Costing Engine</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive FOB / CM breakdown integrating physical fabric consumption with currency costing and margin analysis.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Fabric Material Cost Factor</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ce_consumption"
                label="Fabric Consumption Rate"
                value={getVal('ce_consumption', 2.6)}
                unit={getUnit('ce_consumption', 'kg_per_doz')}
                unitOptions={CONSUMPTION_UNITS}
                onChangeValue={(v) => onChangeField('ce_consumption', v)}
                onChangeUnit={(u) => onChangeField('ce_consumption', getVal('ce_consumption', 2.6), u)}
              />

              <FieldWithUnit
                id="ce_fab_price"
                label="Fabric Price Rate"
                value={getVal('ce_fab_price', 7.5)}
                unit={getUnit('ce_currency', 'USD')}
                unitOptions={CURRENCY_UNITS}
                onChangeValue={(v) => onChangeField('ce_fab_price', v)}
                onChangeUnit={(u) => onChangeField('ce_currency', 0, u)}
              />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>Trims, Assembly (CM), Embellishment & Margin</span>
              <div className="flex-1 h-px bg-[#1f293d]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithUnit
                id="ce_trims"
                label="Trims & Accessories"
                value={getVal('ce_trims', 3.5)}
                unit={getUnit('ce_trims', 'per_doz')}
                unitOptions={COST_BASIS_UNITS}
                onChangeValue={(v) => onChangeField('ce_trims', v)}
                onChangeUnit={(u) => onChangeField('ce_trims', getVal('ce_trims', 3.5), u)}
              />

              <FieldWithUnit
                id="ce_cm"
                label="CM (Labor & Making)"
                value={getVal('ce_cm', 6.0)}
                unit={getUnit('ce_cm', 'per_doz')}
                unitOptions={COST_BASIS_UNITS}
                onChangeValue={(v) => onChangeField('ce_cm', v)}
                onChangeUnit={(u) => onChangeField('ce_cm', getVal('ce_cm', 6.0), u)}
              />

              <FieldWithUnit
                id="ce_embellish"
                label="Embellishments (Wash, Print, Embroider)"
                value={getVal('ce_embellish', 2.0)}
                unit={getUnit('ce_embellish', 'per_doz')}
                unitOptions={COST_BASIS_UNITS}
                onChangeValue={(v) => onChangeField('ce_embellish', v)}
                onChangeUnit={(u) => onChangeField('ce_embellish', getVal('ce_embellish', 2.0), u)}
              />

              <FieldWithUnit
                id="ce_overhead"
                label="Commercial & Factory Overhead"
                value={getVal('ce_overhead', 1.2)}
                unit={getUnit('ce_overhead', 'per_doz')}
                unitOptions={COST_BASIS_UNITS}
                onChangeValue={(v) => onChangeField('ce_overhead', v)}
                onChangeUnit={(u) => onChangeField('ce_overhead', getVal('ce_overhead', 1.2), u)}
              />

              <FieldWithUnit
                id="ce_profit"
                label="Factory Profit Margin"
                value={getVal('ce_profit', 12)}
                unit={getUnit('ce_profit', '%')}
                unitOptions={PERCENT_UNITS}
                onChangeValue={(v) => onChangeField('ce_profit', v)}
                onChangeUnit={(u) => onChangeField('ce_profit', getVal('ce_profit', 12), u)}
              />

              <FieldWithUnit
                id="ce_order_qty"
                label="Order Quantity Context"
                value={getVal('ce_order_qty', 5000)}
                unit={getUnit('ce_order_qty', 'pcs')}
                unitOptions={QTY_UNITS}
                step={1}
                min={1}
                onChangeValue={(v) => onChangeField('ce_order_qty', v)}
                onChangeUnit={(u) => onChangeField('ce_order_qty', getVal('ce_order_qty', 5000), u)}
              />
            </div>
          </div>

          <div className="bg-[#131d2e] border border-blue-500/20 rounded-lg p-3.5 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
              Output Representation Convention
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 whitespace-nowrap">Calculate Cost Quote As:</span>
              <select
                value={getUnit('ce_target_convention', 'fob_per_pc')}
                onChange={(e) => onChangeField('ce_target_convention', 0, e.target.value)}
                className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs font-medium text-blue-200 outline-none focus:border-blue-500 cursor-pointer flex-1"
              >
                <option value="fob_per_pc">FOB Price per Piece ($/pc)</option>
                <option value="fob_per_doz">FOB Price per Dozen ($/doz)</option>
                <option value="total_fob_order">Total Order FOB Value ($)</option>
                <option value="total_factory_cost">Total Net Factory Production Cost ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 xl:col-span-5">
        <AuditPanel
          title="Garment FOB Quotation Schedule"
          description="Itemized cost head breakdown, profit contribution, and piece-to-order scalability."
          result={result}
        />
      </div>
    </div>
  );
};
