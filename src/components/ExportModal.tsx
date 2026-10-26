/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculationResult } from '../engine/types';
import { X, Printer, Download, Copy, Check, FileSpreadsheet, FileCode, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  tabTitle: string;
  inputs: Record<string, { value: number; unit: string }>;
  result: CalculationResult;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  tabTitle,
  inputs,
  result,
}) => {
  const [activeView, setActiveView] = useState<'sheet' | 'csv' | 'json'>('sheet');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Generate CSV string
  const generateCSV = (): string => {
    const lines: string[] = [];
    lines.push(`"APPAREL ENGINEERING SPECIFICATION & COSTING SHEET"`);
    lines.push(`"Module:","${tabTitle}"`);
    lines.push(`"Export Date:","${timestamp}"`);
    lines.push(`"Calculated Output:","${result.heroValue} ${result.heroUnit}"`);
    lines.push('');
    lines.push(`"--- STEP 1: INPUT MEASUREMENTS & NORMALIZATION ---"`);
    lines.push(`"Parameter","Raw Value","Unit","Conversion Factor","Normalized Value"`);
    result.normalizationTable.forEach((row) => {
      lines.push(`"${row.name}","${row.raw}","","${row.factor}","${row.normalized}"`);
    });
    lines.push('');
    lines.push(`"--- STEP 2: MATHEMATICAL EQUATIONS ---"`);
    const formulaLines = result.formulaAudit.split('\n');
    formulaLines.forEach((fl) => {
      lines.push(`"${fl.replace(/"/g, '""')}"`);
    });
    lines.push('');
    lines.push(`"--- STEP 3: BREAKDOWN & YIELD SCHEDULE ---"`);
    lines.push(`"Item","Engineered Value"`);
    result.breakdownRows.forEach((br) => {
      lines.push(`"${br.label}","${br.value}"`);
    });
    return lines.join('\n');
  };

  const csvContent = generateCSV();

  // Generate JSON Tech Pack
  const jsonObject = {
    docType: 'ApparelEngineeringTechPack',
    version: '2.0-verified',
    exportedAt: timestamp,
    module: activeTab,
    moduleTitle: tabTitle,
    primaryResult: {
      value: result.heroValue,
      unit: result.heroUnit,
      rawGross: result.rawGrossValue,
      rawGrossUnit: result.rawGrossUnit,
    },
    secondaryBadges: result.secondaryBadges,
    normalizedInputs: result.normalizationTable,
    formulaAudit: result.formulaAudit,
    breakdownSchedule: result.breakdownRows,
    rawInputs: inputs,
  };
  const jsonContent = JSON.stringify(jsonObject, null, 2);

  const handleDownloadCSV = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `techpack_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `techpack_${activeTab}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#111827] border border-[#1f293d] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f293d] bg-[#0d131f]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Export Tech Pack & Costing Sheet
              </h2>
              <p className="text-xs text-slate-400">{tabTitle} · Verified Textile Engineering</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#1f293d] bg-[#141d2e]/50 gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#090d16] p-1 rounded-lg border border-[#1f293d]">
            <button
              onClick={() => setActiveView('sheet')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'sheet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Printable Spec Sheet</span>
            </button>
            <button
              onClick={() => setActiveView('csv')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'csv'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV Spreadsheet</span>
            </button>
            <button
              onClick={() => setActiveView('json')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'json'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Schema</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeView === 'sheet' && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Spec Sheet (PDF)</span>
              </button>
            )}

            {activeView === 'csv' && (
              <>
                <button
                  onClick={() => handleCopy(csvContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy CSV'}</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV</span>
                </button>
              </>
            )}

            {activeView === 'json' && (
              <>
                <button
                  onClick={() => handleCopy(jsonContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .JSON</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#090d16]">
          {activeView === 'sheet' && (
            <div className="print-area bg-white text-slate-900 p-8 rounded-xl shadow-inner font-sans border border-slate-300">
              {/* Tech Pack Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-blue-600">
                    Apparel Technical Specification Sheet
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                    {tabTitle} Engineering Audit
                  </h1>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span>Date: {dateStr}</span>
                    <span>·</span>
                    <span>Spec ID: TP-{(activeTab.toUpperCase())}-{Date.now().toString().slice(-4)}</span>
                    <span>·</span>
                    <span>Status: Verified</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs uppercase font-semibold text-slate-500">Calculated Output</div>
                  <div className="text-2xl font-bold font-mono text-emerald-600">
                    {result.heroValue} <span className="text-base font-sans">{result.heroUnit}</span>
                  </div>
                </div>
              </div>

              {/* Step 1 Table */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Input Measurements & Standardized Normalization
                </h3>
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-2 border border-slate-200">Measurement Parameter</th>
                      <th className="p-2 border border-slate-200">Raw Input</th>
                      <th className="p-2 border border-slate-200">Conversion Factor</th>
                      <th className="p-2 border border-slate-200">Normalized Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.normalizationTable.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-200 font-medium text-slate-800">
                          {row.name}
                        </td>
                        <td className="p-2 border border-slate-200 font-mono text-slate-600">
                          {row.raw}
                        </td>
                        <td className="p-2 border border-slate-200 font-mono text-slate-500">
                          {row.factor}
                        </td>
                        <td className="p-2 border border-slate-200 font-mono font-semibold text-blue-700">
                          {row.normalized}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Step 2 Formula */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Applied Mathematical Engineering Formulation
                </h3>
                <pre className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {result.formulaAudit}
                </pre>
              </div>

              {/* Step 3 Breakdown */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  3. Net vs. Gross Wastage & Consumption Schedule
                </h3>
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-2 border border-slate-200">Line Item Description</th>
                      <th className="p-2 border border-slate-200 text-right">Engineered Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdownRows.map((br, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-slate-200 ${
                          br.highlight ? 'bg-emerald-50 font-bold' : ''
                        }`}
                      >
                        <td className="p-2 border border-slate-200 text-slate-800 font-medium">
                          {br.label}
                        </td>
                        <td className="p-2 border border-slate-200 text-right font-mono text-slate-900">
                          {br.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sign-off Strip */}
              <div className="pt-6 mt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-xs text-slate-600">
                <div>
                  <div className="font-semibold text-slate-800 mb-6">Technical Designer:</div>
                  <div className="border-b border-slate-400 pb-1">Sign: ___________________</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 mb-6">Cutting Master:</div>
                  <div className="border-b border-slate-400 pb-1">Sign: ___________________</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 mb-6">Merchandiser Approval:</div>
                  <div className="border-b border-slate-400 pb-1">Sign: ___________________</div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'csv' && (
            <div className="relative">
              <pre className="p-4 bg-[#0d131f] border border-[#1f293d] rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                {csvContent}
              </pre>
            </div>
          )}

          {activeView === 'json' && (
            <div className="relative">
              <pre className="p-4 bg-[#0d131f] border border-[#1f293d] rounded-lg font-mono text-xs text-blue-300 overflow-x-auto whitespace-pre leading-relaxed">
                {jsonContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
