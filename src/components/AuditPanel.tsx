/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculationResult } from '../engine/types';
import { Check, Copy, FileText } from 'lucide-react';

interface AuditPanelProps {
  title: string;
  description: string;
  result: CalculationResult;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({ title, description, result }) => {
  const [copiedFormula, setCopiedFormula] = useState(false);

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(result.formulaAudit);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  return (
    <div className="bg-[#111827] border border-[#1f293d] rounded-xl p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between pb-3.5 border-b border-[#1f293d]">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Result Hero */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-blue-950/15 to-transparent p-5">
        <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Engineered Metric Output</span>
        </div>

        <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-baseline gap-2.5 flex-wrap">
          <span>{result.heroValue}</span>
          <span className="text-lg sm:text-xl font-medium text-emerald-300 font-sans">
            {result.heroUnit}
          </span>
        </div>

        {/* Secondary Equivalents */}
        {result.secondaryBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3.5 mt-3.5 border-t border-white/10">
            {result.secondaryBadges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300"
              >
                <span className="text-slate-400 font-sans mr-1">{badge.label}:</span>
                <span className="font-semibold text-slate-100">{badge.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Audit Steps */}
      <div className="flex flex-col gap-4">
        {/* Step 1: Normalization */}
        <div className="bg-[#0d131f] border border-[#1f293d] rounded-lg p-3.5">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <span>Step 1: Input Normalization</span>
            <span className="text-[11px] text-slate-500 font-normal">
              (Standardized to base equation units)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1f293d] text-slate-400">
                  <th className="py-2 px-2 font-medium">Measurement</th>
                  <th className="py-2 px-2 font-medium">Raw Input</th>
                  <th className="py-2 px-2 font-medium">Factor</th>
                  <th className="py-2 px-2 font-medium">Normalized Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f293d]/50">
                {result.normalizationTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-1.5 px-2 text-slate-300 font-medium">{row.name}</td>
                    <td className="py-1.5 px-2 text-slate-400 font-mono">{row.raw}</td>
                    <td className="py-1.5 px-2 text-slate-400 font-mono">{row.factor}</td>
                    <td className="py-1.5 px-2 text-blue-300 font-mono font-medium">
                      {row.normalized}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2: Formula Box */}
        <div className="bg-[#0d131f] border border-[#1f293d] rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step 2: Applied Mathematical Formula
            </div>
            <button
              onClick={handleCopyFormula}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-white/5"
              title="Copy mathematical equation"
            >
              {copiedFormula ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-[#090d16] border border-[#1f293d]/70 rounded-md p-3 font-mono text-xs text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border-l-2 border-l-blue-500">
            {result.formulaAudit}
          </pre>
        </div>

        {/* Step 3: Breakdown Table */}
        <div className="bg-[#0d131f] border border-[#1f293d] rounded-lg p-3.5">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Step 3: Component Breakdown & Wastage Schedule
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <tbody className="divide-y divide-[#1f293d]/60">
              {result.breakdownRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-white/[0.02] ${
                    row.highlight ? 'bg-emerald-500/10 font-semibold' : ''
                  }`}
                >
                  <td
                    className={`py-2 px-2.5 ${
                      row.highlight ? 'text-emerald-300 font-medium' : 'text-slate-300'
                    }`}
                  >
                    {row.label}
                  </td>
                  <td
                    className={`py-2 px-2.5 text-right font-mono ${
                      row.highlight ? 'text-emerald-300 font-bold text-sm' : 'text-blue-300'
                    }`}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
