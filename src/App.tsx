/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculatorTabId, CalculationResult } from './engine/types';
import { Calculators } from './engine/calculators';
import { TShirtTab } from './components/tabs/TShirtTab';
import { WovenShirtTab } from './components/tabs/WovenShirtTab';
import { TrouserTab } from './components/tabs/TrouserTab';
import { MarkerTab } from './components/tabs/MarkerTab';
import { FabricYieldTab } from './components/tabs/FabricYieldTab';
import { ThreadTab } from './components/tabs/ThreadTab';
import { CartonTab } from './components/tabs/CartonTab';
import { CostingTab } from './components/tabs/CostingTab';
import { ExportModal } from './components/ExportModal';
import {
  FileSpreadsheet,
  RotateCcw,
  CheckCircle,
  Layers,
} from 'lucide-react';

interface TabDefinition {
  id: CalculatorTabId;
  label: string;
  badge: string;
}

const TABS: TabDefinition[] = [
  { id: 'tshirt', label: 'T-Shirt & Polo', badge: 'Knit' },
  { id: 'woven', label: 'Woven Shirt', badge: 'Woven' },
  { id: 'trouser', label: 'Trousers & Bottoms', badge: 'Bottoms' },
  { id: 'marker', label: 'Marker Planning', badge: 'Cutting' },
  { id: 'yield', label: 'Fabric Yield & GSM', badge: 'Yield' },
  { id: 'thread', label: 'Sewing Thread', badge: 'Stitching' },
  { id: 'carton', label: 'Carton & Freight CBM', badge: 'Logistics' },
  { id: 'costing', label: 'Garment Costing Engine', badge: 'FOB/CM' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<CalculatorTabId>('tshirt');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global inputs state across all tabs
  const [allInputs, setAllInputs] = useState<
    Record<CalculatorTabId, Record<string, { value: number; unit: string }>>
  >({
    tshirt: {
      ts_body_length: { value: 72, unit: 'cm' },
      ts_half_chest: { value: 52, unit: 'cm' },
      ts_sleeve_length: { value: 22, unit: 'cm' },
      ts_sleeve_width: { value: 23, unit: 'cm' },
      ts_len_allowance: { value: 6, unit: 'cm' },
      ts_wid_allowance: { value: 4, unit: 'cm' },
      ts_gsm: { value: 180, unit: 'gsm' },
      ts_wastage: { value: 7, unit: '%' },
      ts_collar_len: { value: 44, unit: 'cm' },
      ts_collar_wid: { value: 5, unit: 'cm' },
      ts_rib_gsm: { value: 220, unit: 'gsm' },
      ts_order_qty: { value: 1000, unit: 'pcs' },
      ts_target_convention: { value: 0, unit: 'kg_per_doz' },
    },
    woven: {
      ws_body_len: { value: 31, unit: 'in' },
      ws_chest_width: { value: 44, unit: 'in' },
      ws_sleeve_len: { value: 25, unit: 'in' },
      ws_parts_allowance: { value: 12, unit: 'in' },
      ws_fabric_width: { value: 58, unit: 'in' },
      ws_fabric_gsm: { value: 120, unit: 'gsm' },
      ws_wastage: { value: 5, unit: '%' },
      ws_order_qty: { value: 1200, unit: 'pcs' },
      ws_target_convention: { value: 0, unit: 'yds_per_pc' },
    },
    trouser: {
      tr_outseam: { value: 105, unit: 'cm' },
      tr_thigh: { value: 32, unit: 'cm' },
      tr_hip: { value: 54, unit: 'cm' },
      tr_waistband: { value: 10, unit: 'cm' },
      tr_pocket: { value: 28, unit: 'cm' },
      tr_allowance: { value: 8, unit: 'cm' },
      tr_fab_width: { value: 56, unit: 'in' },
      tr_gsm: { value: 280, unit: 'gsm' },
      tr_wastage: { value: 8, unit: '%' },
      tr_order_qty: { value: 500, unit: 'pcs' },
      tr_target_convention: { value: 0, unit: 'yds_per_pc' },
    },
    marker: {
      mk_length: { value: 6.5, unit: 'm' },
      mk_width: { value: 150, unit: 'cm' },
      mk_garment_ratio: { value: 4, unit: 'pcs' },
      mk_pattern_area: { value: 1.8, unit: 'm2' },
      mk_total_pcs: { value: 2400, unit: 'pcs' },
      mk_gsm: { value: 190, unit: 'gsm' },
      mk_end_loss: { value: 2, unit: 'in' },
      mk_plies: { value: 100, unit: 'plies' },
      mk_target_convention: { value: 0, unit: 'total_meters' },
    },
    yield: {
      fy_gsm: { value: 200, unit: 'gsm' },
      fy_width: { value: 60, unit: 'in' },
      fy_target_convention: { value: 0, unit: 'm_per_kg' },
    },
    thread: {
      th_seam_len: { value: 380, unit: 'cm' },
      th_spi: { value: 12, unit: 'spi' },
      th_stitch_type: { value: 0, unit: '504_overlock' },
      th_thickness: { value: 1.5, unit: 'mm' },
      th_wastage: { value: 15, unit: '%' },
      th_order_qty: { value: 2500, unit: 'pcs' },
      th_cone_len: { value: 5000, unit: 'm' },
      th_target_convention: { value: 0, unit: 'm_per_pc' },
    },
    carton: {
      ct_len: { value: 60, unit: 'cm' },
      ct_wid: { value: 40, unit: 'cm' },
      ct_hgt: { value: 30, unit: 'cm' },
      ct_pack_ratio: { value: 48, unit: 'pcs' },
      ct_order_qty: { value: 4800, unit: 'pcs' },
      ct_weight: { value: 12.5, unit: 'kg' },
      ct_divisor: { value: 6000, unit: 'cm3_kg' },
      ct_target_convention: { value: 0, unit: 'total_cbm' },
    },
    costing: {
      ce_consumption: { value: 2.6, unit: 'kg_per_doz' },
      ce_fab_price: { value: 7.5, unit: 'USD' },
      ce_currency: { value: 0, unit: 'USD' },
      ce_trims: { value: 3.5, unit: 'per_doz' },
      ce_cm: { value: 6.0, unit: 'per_doz' },
      ce_embellish: { value: 2.0, unit: 'per_doz' },
      ce_overhead: { value: 1.2, unit: 'per_doz' },
      ce_profit: { value: 12, unit: '%' },
      ce_order_qty: { value: 5000, unit: 'pcs' },
      ce_target_convention: { value: 0, unit: 'fob_per_pc' },
    },
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (
    tabId: CalculatorTabId,
    fieldId: string,
    value: number,
    unit?: string
  ) => {
    setAllInputs((prev) => {
      const currentTabState = prev[tabId] || {};
      const currentField = currentTabState[fieldId] || { value: 0, unit: 'cm' };
      return {
        ...prev,
        [tabId]: {
          ...currentTabState,
          [fieldId]: {
            value,
            unit: unit !== undefined ? unit : currentField.unit,
          },
        },
      };
    });
  };

  const handleApplyPreset = (
    tabId: CalculatorTabId,
    presetValues: Record<string, { value: number; unit: string }>
  ) => {
    setAllInputs((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        ...presetValues,
      },
    }));
    showToast('Loaded benchmark industry spec preset');
  };

  // Compute active result for export
  const computeActiveResult = (): CalculationResult => {
    const activeInputs = allInputs[activeTab];
    switch (activeTab) {
      case 'tshirt':
        return Calculators.calculateTShirt(activeInputs);
      case 'woven':
        return Calculators.calculateWovenShirt(activeInputs);
      case 'trouser':
        return Calculators.calculateTrouser(activeInputs);
      case 'marker':
        return Calculators.calculateMarker(activeInputs);
      case 'yield':
        return Calculators.calculateFabricYield(activeInputs);
      case 'thread':
        return Calculators.calculateThread(activeInputs);
      case 'carton':
        return Calculators.calculateCarton(activeInputs);
      case 'costing':
        return Calculators.calculateCosting(activeInputs);
    }
  };

  const activeResult = computeActiveResult();
  const activeTabDef = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar (adhering strictly to Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#0d131f]/90 backdrop-blur-md border-b border-[#1f293d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              AE
            </div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Apparel Engineering & Costing Calculator
            </span>
          </div>

          {/* Zone 2: Informational trust indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <span>Independent Field Unit Normalization</span>
            <span aria-hidden="true">·</span>
            <span>Mathematical Audit Trail</span>
            <span aria-hidden="true">·</span>
            <span>ISO Standard Stitching</span>
          </div>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm whitespace-nowrap active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Tech Pack</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Navigation Tabs (Functional button controls with scrollable bar) */}
        <nav
          className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1f293d] scrollbar-thin"
          role="tablist"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 border border-blue-500/40 text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Tab View Container */}
        <div className="flex-1">
          {activeTab === 'tshirt' && (
            <TShirtTab
              state={allInputs.tshirt}
              onChangeField={(id, v, u) => handleFieldChange('tshirt', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('tshirt', vals)}
            />
          )}

          {activeTab === 'woven' && (
            <WovenShirtTab
              state={allInputs.woven}
              onChangeField={(id, v, u) => handleFieldChange('woven', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('woven', vals)}
            />
          )}

          {activeTab === 'trouser' && (
            <TrouserTab
              state={allInputs.trouser}
              onChangeField={(id, v, u) => handleFieldChange('trouser', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('trouser', vals)}
            />
          )}

          {activeTab === 'marker' && (
            <MarkerTab
              state={allInputs.marker}
              onChangeField={(id, v, u) => handleFieldChange('marker', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('marker', vals)}
            />
          )}

          {activeTab === 'yield' && (
            <FabricYieldTab
              state={allInputs.yield}
              onChangeField={(id, v, u) => handleFieldChange('yield', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('yield', vals)}
            />
          )}

          {activeTab === 'thread' && (
            <ThreadTab
              state={allInputs.thread}
              onChangeField={(id, v, u) => handleFieldChange('thread', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('thread', vals)}
            />
          )}

          {activeTab === 'carton' && (
            <CartonTab
              state={allInputs.carton}
              onChangeField={(id, v, u) => handleFieldChange('carton', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('carton', vals)}
            />
          )}

          {activeTab === 'costing' && (
            <CostingTab
              state={allInputs.costing}
              onChangeField={(id, v, u) => handleFieldChange('costing', id, v, u)}
              onApplyPreset={(vals) => handleApplyPreset('costing', vals)}
            />
          )}
        </div>
      </main>

      {/* Subtle Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#111827] border border-blue-500/40 text-blue-300 text-xs px-4 py-2.5 rounded-lg shadow-xl animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Export Tech Pack Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeTab={activeTab}
        tabTitle={activeTabDef.label}
        inputs={allInputs[activeTab]}
        result={activeResult}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-[#1f293d] py-4 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            Apparel Engineering & Mathematical Fabric Computation Engine · Verified Industrial Engineering Formulations
          </p>
          <div className="flex items-center gap-3">
            <span>ISO 301/504/514 Compliant</span>
            <span>·</span>
            <span>IATA Freight Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
