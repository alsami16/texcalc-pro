/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GARMENT_PRESETS } from '../engine/presets';
import { Bookmark, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  currentTab: string;
  onApplyPreset: (presetValues: Record<string, { value: number; unit: string }>) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ currentTab, onApplyPreset }) => {
  const availablePresets = GARMENT_PRESETS.filter((p) => p.targetTab === currentTab);

  if (availablePresets.length === 0) return null;

  return (
    <div className="bg-[#141d2e]/80 border border-blue-500/20 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-blue-200">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
        <div>
          <span className="font-semibold text-white">Load Industry Benchmark Preset:</span>
          <span className="text-slate-400 ml-1.5 hidden md:inline">
            Quick-load standardized garment tech specs
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <select
          onChange={(e) => {
            const selected = availablePresets.find((p) => p.id === e.target.value);
            if (selected) {
              onApplyPreset(selected.values);
            }
          }}
          defaultValue=""
          className="bg-[#090d16] border border-[#1f293d] rounded-md px-3 py-1.5 text-xs text-slate-200 font-medium outline-none focus:border-blue-500 cursor-pointer min-w-[200px]"
        >
          <option value="" disabled>
            Choose a preset...
          </option>
          {availablePresets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
