/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const UnitConverters = {
  // Base Length: Centimeters (cm)
  lengthToCm(val: number, unit: string): number {
    switch (unit) {
      case 'mm':
        return val * 0.1;
      case 'cm':
        return val;
      case 'm':
        return val * 100.0;
      case 'in':
        return val * 2.54;
      case 'yd':
        return val * 91.44;
      default:
        return val;
    }
  },

  cmToLength(cm: number, targetUnit: string): number {
    switch (targetUnit) {
      case 'mm':
        return cm / 0.1;
      case 'cm':
        return cm;
      case 'm':
        return cm / 100.0;
      case 'in':
        return cm / 2.54;
      case 'yd':
        return cm / 91.44;
      default:
        return cm;
    }
  },

  // Base Area: Square Meters (m²)
  areaToM2(val: number, unit: string): number {
    switch (unit) {
      case 'm2':
        return val;
      case 'ft2':
        return val * 0.09290304;
      case 'in2':
        return val * 0.00064516;
      case 'yd2':
        return val * 0.83612736;
      default:
        return val;
    }
  },

  m2ToArea(m2: number, targetUnit: string): number {
    switch (targetUnit) {
      case 'm2':
        return m2;
      case 'ft2':
        return m2 / 0.09290304;
      case 'in2':
        return m2 / 0.00064516;
      case 'yd2':
        return m2 / 0.83612736;
      default:
        return m2;
    }
  },

  // Base Weight: Grams (g)
  weightToGrams(val: number, unit: string): number {
    switch (unit) {
      case 'g':
        return val;
      case 'kg':
        return val * 1000.0;
      case 'lb':
        return val * 453.59237;
      case 'oz':
        return val * 28.349523125;
      default:
        return val;
    }
  },

  gramsToWeight(g: number, targetUnit: string): number {
    switch (targetUnit) {
      case 'g':
        return g;
      case 'kg':
        return g / 1000.0;
      case 'lb':
        return g / 453.59237;
      case 'oz':
        return g / 28.349523125;
      default:
        return g;
    }
  },

  // Base GSM: Grams per square meter (g/m²)
  gsmToGsm(val: number, unit: string): number {
    switch (unit) {
      case 'gsm':
        return val;
      case 'kg_m2':
        return val * 1000.0;
      case 'oz_yd2':
        return val * 33.905747; // 1 oz/yd2 = 33.905747 gsm
      default:
        return val;
    }
  },

  gsmToTarget(gsm: number, targetUnit: string): number {
    switch (targetUnit) {
      case 'gsm':
        return gsm;
      case 'kg_m2':
        return gsm / 1000.0;
      case 'oz_yd2':
        return gsm / 33.905747;
      default:
        return gsm;
    }
  },

  // Stitch Density to SPI
  stitchDensityToSpi(val: number, unit: string): number {
    if (unit === 'spc') return val * 2.54;
    return val; // spi
  },

  // Quantity to Pieces
  qtyToPcs(val: number, unit: string): number {
    return unit === 'doz' ? val * 12 : val;
  },

  // Formatter for numbers
  formatNumber(val: number, decimals: number = 3): string {
    if (isNaN(val) || !isFinite(val)) return '0.000';
    return val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },
};
