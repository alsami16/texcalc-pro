/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LengthUnit = 'cm' | 'in' | 'mm' | 'm' | 'yd';
export type AreaUnit = 'm2' | 'ft2' | 'in2' | 'yd2';
export type WeightUnit = 'g' | 'kg' | 'lb' | 'oz';
export type GsmUnit = 'gsm' | 'kg_m2' | 'oz_yd2';
export type StitchDensityUnit = 'spi' | 'spc';
export type QtyUnit = 'pcs' | 'doz';
export type CostUnit = 'per_pc' | 'per_doz';

export interface MeasurementField {
  value: number;
  unit: string;
}

export interface NormalizationRow {
  name: string;
  raw: string;
  factor: string;
  normalized: string;
}

export interface AuditBreakdownRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface SecondaryBadge {
  label: string;
  value: string;
}

export interface CalculationResult {
  heroValue: string;
  heroUnit: string;
  secondaryBadges: SecondaryBadge[];
  normalizationTable: NormalizationRow[];
  formulaAudit: string;
  breakdownRows: AuditBreakdownRow[];
  rawGrossValue: number;
  rawGrossUnit: string;
}

// Preset interface
export interface GarmentPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  targetTab: string;
  values: Record<string, { value: number; unit: string }>;
}

// Tab Identifier
export type CalculatorTabId =
  | 'tshirt'
  | 'woven'
  | 'trouser'
  | 'marker'
  | 'yield'
  | 'thread'
  | 'carton'
  | 'costing';
