/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UnitConverters } from './converters';
import { CalculationResult } from './types';

export const Calculators = {
  // 1. Knit T-Shirt & Polo
  calculateTShirt(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const bodyLenRaw = values.ts_body_length?.value || 0;
    const bodyLenUnit = values.ts_body_length?.unit || 'cm';

    const chestRaw = values.ts_half_chest?.value || 0;
    const chestUnit = values.ts_half_chest?.unit || 'cm';

    const slvLenRaw = values.ts_sleeve_length?.value || 0;
    const slvLenUnit = values.ts_sleeve_length?.unit || 'cm';

    const slvWidRaw = values.ts_sleeve_width?.value || 0;
    const slvWidUnit = values.ts_sleeve_width?.unit || 'cm';

    const lenAllowRaw = values.ts_len_allowance?.value || 0;
    const lenAllowUnit = values.ts_len_allowance?.unit || 'cm';

    const widAllowRaw = values.ts_wid_allowance?.value || 0;
    const widAllowUnit = values.ts_wid_allowance?.unit || 'cm';

    const gsmRaw = values.ts_gsm?.value || 0;
    const gsmUnit = values.ts_gsm?.unit || 'gsm';

    const wastageRaw = values.ts_wastage?.value || 0;

    const collarLenRaw = values.ts_collar_len?.value || 0;
    const collarLenUnit = values.ts_collar_len?.unit || 'cm';

    const collarWidRaw = values.ts_collar_wid?.value || 0;
    const collarWidUnit = values.ts_collar_wid?.unit || 'cm';

    const ribGsmRaw = values.ts_rib_gsm?.value || 0;
    const ribGsmUnit = values.ts_rib_gsm?.unit || 'gsm';

    const orderQtyRaw = values.ts_order_qty?.value || 1;
    const orderQtyUnit = values.ts_order_qty?.unit || 'pcs';
    const orderPcs = UnitConverters.qtyToPcs(orderQtyRaw, orderQtyUnit);

    const targetConvention = values.ts_target_convention?.unit || 'kg_per_doz';

    // Normalization to cm and GSM
    const bodyLenCm = UnitConverters.lengthToCm(bodyLenRaw, bodyLenUnit);
    const chestCm = UnitConverters.lengthToCm(chestRaw, chestUnit);
    const slvLenCm = UnitConverters.lengthToCm(slvLenRaw, slvLenUnit);
    const slvWidCm = UnitConverters.lengthToCm(slvWidRaw, slvWidUnit);
    const lenAllowCm = UnitConverters.lengthToCm(lenAllowRaw, lenAllowUnit);
    const widAllowCm = UnitConverters.lengthToCm(widAllowRaw, widAllowUnit);
    const fabricGsm = UnitConverters.gsmToGsm(gsmRaw, gsmUnit);
    const collarLenCm = UnitConverters.lengthToCm(collarLenRaw, collarLenUnit);
    const collarWidCm = UnitConverters.lengthToCm(collarWidRaw, collarWidUnit);
    const ribGsm = UnitConverters.gsmToGsm(ribGsmRaw, ribGsmUnit);

    const normRows = [
      {
        name: 'Body Length',
        raw: `${bodyLenRaw} ${bodyLenUnit}`,
        factor: `${(bodyLenCm / (bodyLenRaw || 1)).toFixed(4)} cm/${bodyLenUnit}`,
        normalized: `${bodyLenCm.toFixed(2)} cm`,
      },
      {
        name: 'Half Chest',
        raw: `${chestRaw} ${chestUnit}`,
        factor: `${(chestCm / (chestRaw || 1)).toFixed(4)} cm/${chestUnit}`,
        normalized: `${chestCm.toFixed(2)} cm`,
      },
      {
        name: 'Sleeve Length',
        raw: `${slvLenRaw} ${slvLenUnit}`,
        factor: `${(slvLenCm / (slvLenRaw || 1)).toFixed(4)} cm/${slvLenUnit}`,
        normalized: `${slvLenCm.toFixed(2)} cm`,
      },
      {
        name: 'Sleeve Width',
        raw: `${slvWidRaw} ${slvWidUnit}`,
        factor: `${(slvWidCm / (slvWidRaw || 1)).toFixed(4)} cm/${slvWidUnit}`,
        normalized: `${slvWidCm.toFixed(2)} cm`,
      },
      {
        name: 'Length Allowance',
        raw: `${lenAllowRaw} ${lenAllowUnit}`,
        factor: `${(lenAllowCm / (lenAllowRaw || 1)).toFixed(4)} cm/${lenAllowUnit}`,
        normalized: `${lenAllowCm.toFixed(2)} cm`,
      },
      {
        name: 'Width Allowance',
        raw: `${widAllowRaw} ${widAllowUnit}`,
        factor: `${(widAllowCm / (widAllowRaw || 1)).toFixed(4)} cm/${widAllowUnit}`,
        normalized: `${widAllowCm.toFixed(2)} cm`,
      },
      {
        name: 'Fabric GSM',
        raw: `${gsmRaw} ${gsmUnit}`,
        factor: `Direct GSM`,
        normalized: `${fabricGsm.toFixed(1)} g/m²`,
      },
    ];

    if (collarLenRaw > 0 && collarWidRaw > 0) {
      normRows.push({
        name: 'Collar / Neck Rib',
        raw: `${collarLenRaw}×${collarWidRaw} ${collarLenUnit}`,
        factor: `Direct GSM`,
        normalized: `${collarLenCm.toFixed(1)}×${collarWidCm.toFixed(1)} cm @ ${ribGsm.toFixed(1)} g/m²`,
      });
    }

    // Formulas
    const adjBodyLen = bodyLenCm + lenAllowCm;
    const adjChest = chestCm + widAllowCm;
    const bodyNetKgDoz = (adjBodyLen * adjChest * 2 * fabricGsm * 12) / 10000000;

    const adjSleeveLen = slvLenCm + lenAllowCm;
    const sleeveNetKgDoz = (adjSleeveLen * (slvWidCm * 2) * fabricGsm * 12) / 10000000;

    let ribNetKgDoz = 0;
    if (collarLenCm > 0 && collarWidCm > 0 && ribGsm > 0) {
      ribNetKgDoz = (collarLenCm * collarWidCm * ribGsm * 12) / 10000000;
    }

    const totalNetKgDoz = bodyNetKgDoz + sleeveNetKgDoz + ribNetKgDoz;
    const grossKgDoz = totalNetKgDoz * (1 + wastageRaw / 100);

    const grossGramsPerPc = (grossKgDoz * 1000) / 12;
    const grossKgPerPc = grossKgDoz / 12;
    const grossLbDoz = grossKgDoz * 2.20462262;
    const grossLbPc = grossKgPerPc * 2.20462262;
    const totalOrderKg = grossKgPerPc * orderPcs;
    const totalOrderLbs = totalOrderKg * 2.20462262;

    const formulaAudit = `1. Adjusted Body Cut = (${adjBodyLen.toFixed(1)} cm × ${adjChest.toFixed(1)} cm × 2) = ${(adjBodyLen * adjChest * 2).toFixed(1)} cm²
2. Adjusted Sleeve Cut = (${adjSleeveLen.toFixed(1)} cm × ${(slvWidCm * 2).toFixed(1)} cm) = ${(adjSleeveLen * slvWidCm * 2).toFixed(1)} cm²
3. Body & Sleeve Net (kg/doz) = [Total Cut Area × ${fabricGsm.toFixed(1)} GSM × 12] / 10,000,000 = ${(bodyNetKgDoz + sleeveNetKgDoz).toFixed(4)} kg/doz
${ribNetKgDoz > 0 ? `4. Collar Rib Net = [${collarLenCm.toFixed(1)} cm × ${collarWidCm.toFixed(1)} cm × ${ribGsm.toFixed(1)} GSM × 12] / 10,000,000 = ${ribNetKgDoz.toFixed(4)} kg/doz\n` : ''}5. Gross Fabric Required = Net ${totalNetKgDoz.toFixed(4)} kg/doz × (1 + ${wastageRaw}%) = ${grossKgDoz.toFixed(4)} kg/doz`;

    const breakdownRows = [
      { label: 'Body Net Consumption', value: `${bodyNetKgDoz.toFixed(4)} kg/doz` },
      { label: 'Sleeve Net Consumption', value: `${sleeveNetKgDoz.toFixed(4)} kg/doz` },
      { label: 'Neck Rib Net Consumption', value: `${ribNetKgDoz.toFixed(4)} kg/doz` },
      { label: 'Net Fabric (0% Wastage)', value: `${totalNetKgDoz.toFixed(4)} kg/doz` },
      {
        label: `Wastage Allowance (${wastageRaw}%)`,
        value: `+${(grossKgDoz - totalNetKgDoz).toFixed(4)} kg/doz`,
      },
      {
        label: 'Gross Required Consumption',
        value: `${grossKgDoz.toFixed(4)} kg/doz`,
        highlight: true,
      },
    ];

    let heroValue = grossKgDoz.toFixed(3);
    let heroUnit = 'kg / doz';

    switch (targetConvention) {
      case 'g_per_pc':
        heroValue = grossGramsPerPc.toFixed(1);
        heroUnit = 'g / pc';
        break;
      case 'kg_per_pc':
        heroValue = grossKgPerPc.toFixed(4);
        heroUnit = 'kg / pc';
        break;
      case 'lb_per_doz':
        heroValue = grossLbDoz.toFixed(3);
        heroUnit = 'lb / doz';
        break;
      case 'lb_per_pc':
        heroValue = grossLbPc.toFixed(4);
        heroUnit = 'lb / pc';
        break;
      case 'total_kg':
        heroValue = UnitConverters.formatNumber(totalOrderKg, 1);
        heroUnit = `kg (Order of ${orderPcs} pcs)`;
        break;
      case 'total_lbs':
        heroValue = UnitConverters.formatNumber(totalOrderLbs, 1);
        heroUnit = `lbs (Order of ${orderPcs} pcs)`;
        break;
      default:
        heroValue = grossKgDoz.toFixed(3);
        heroUnit = 'kg / doz';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Standard', value: `${grossKgDoz.toFixed(3)} kg/doz` },
        { label: 'Per Piece', value: `${grossGramsPerPc.toFixed(1)} g/pc` },
        { label: 'Imperial', value: `${grossLbDoz.toFixed(3)} lb/doz` },
        {
          label: `Order (${orderPcs} pcs)`,
          value: `${UnitConverters.formatNumber(totalOrderKg, 1)} kg`,
        },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: grossKgDoz,
      rawGrossUnit: 'kg/doz',
    };
  },

  // 2. Woven Shirt
  calculateWovenShirt(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const bLenRaw = values.ws_body_len?.value || 0;
    const bLenUnit = values.ws_body_len?.unit || 'in';
    const chestRaw = values.ws_chest_width?.value || 0;
    const chestUnit = values.ws_chest_width?.unit || 'in';
    const slvRaw = values.ws_sleeve_len?.value || 0;
    const slvUnit = values.ws_sleeve_len?.unit || 'in';
    const allowRaw = values.ws_parts_allowance?.value || 0;
    const allowUnit = values.ws_parts_allowance?.unit || 'in';
    const widthRaw = values.ws_fabric_width?.value || 0;
    const widthUnit = values.ws_fabric_width?.unit || 'in';
    const gsmRaw = values.ws_fabric_gsm?.value || 0;
    const gsmUnit = values.ws_fabric_gsm?.unit || 'gsm';
    const wastage = values.ws_wastage?.value || 0;
    const orderQty = values.ws_order_qty?.value || 1;
    const orderQtyUnit = values.ws_order_qty?.unit || 'pcs';
    const orderPcs = UnitConverters.qtyToPcs(orderQty, orderQtyUnit);

    const targetConvention = values.ws_target_convention?.unit || 'yds_per_pc';

    // Normalize to inches
    const bLenIn = UnitConverters.lengthToCm(bLenRaw, bLenUnit) / 2.54;
    const chestIn = UnitConverters.lengthToCm(chestRaw, chestUnit) / 2.54;
    const slvIn = UnitConverters.lengthToCm(slvRaw, slvUnit) / 2.54;
    const allowIn = UnitConverters.lengthToCm(allowRaw, allowUnit) / 2.54;
    const fabWidthIn = UnitConverters.lengthToCm(widthRaw, widthUnit) / 2.54;
    const fabGsm = UnitConverters.gsmToGsm(gsmRaw, gsmUnit);

    const normRows = [
      {
        name: 'Body Length',
        raw: `${bLenRaw} ${bLenUnit}`,
        factor: `${(bLenIn / (bLenRaw || 1)).toFixed(4)} in/${bLenUnit}`,
        normalized: `${bLenIn.toFixed(2)} in`,
      },
      {
        name: 'Chest Width',
        raw: `${chestRaw} ${chestUnit}`,
        factor: `${(chestIn / (chestRaw || 1)).toFixed(4)} in/${chestUnit}`,
        normalized: `${chestIn.toFixed(2)} in`,
      },
      {
        name: 'Sleeve Length',
        raw: `${slvRaw} ${slvUnit}`,
        factor: `${(slvIn / (slvRaw || 1)).toFixed(4)} in/${slvUnit}`,
        normalized: `${slvIn.toFixed(2)} in`,
      },
      {
        name: 'Collar/Cuff Allowance',
        raw: `${allowRaw} ${allowUnit}`,
        factor: `${(allowIn / (allowRaw || 1)).toFixed(4)} in/${allowUnit}`,
        normalized: `${allowIn.toFixed(2)} in`,
      },
      {
        name: 'Cuttable Fabric Width',
        raw: `${widthRaw} ${widthUnit}`,
        factor: `${(fabWidthIn / (widthRaw || 1)).toFixed(4)} in/${widthUnit}`,
        normalized: `${fabWidthIn.toFixed(2)} in`,
      },
      {
        name: 'Fabric Weight',
        raw: `${gsmRaw} ${gsmUnit}`,
        factor: `Direct GSM`,
        normalized: `${fabGsm.toFixed(1)} g/m²`,
      },
    ];

    const totalCutLengthIn = bLenIn + slvIn + allowIn;
    const widthFactor = (chestIn * 0.55) / fabWidthIn;
    const netYdsPerPc = (totalCutLengthIn / 36) * Math.max(1.0, widthFactor);
    const grossYdsPerPc = netYdsPerPc * (1 + wastage / 100);
    const grossYdsPerDoz = grossYdsPerPc * 12;

    const netMPerPc = netYdsPerPc * 0.9144;
    const grossMPerPc = grossYdsPerPc * 0.9144;
    const grossMPerDoz = grossMPerPc * 12;

    const totalYdsOrder = grossYdsPerPc * orderPcs;
    const totalMOrder = grossMPerPc * orderPcs;

    const fabWidthM = fabWidthIn * 0.0254;
    const orderAreaM2 = totalMOrder * fabWidthM;
    const totalWeightKg = (orderAreaM2 * fabGsm) / 1000;

    const formulaAudit = `1. Total Cut Length = ${bLenIn.toFixed(2)}" (Body) + ${slvIn.toFixed(2)}" (Sleeve) + ${allowIn.toFixed(2)}" (Allowance) = ${totalCutLengthIn.toFixed(2)}"
2. Width Lay Ratio = (${(chestIn * 0.55).toFixed(2)}" chest factor / ${fabWidthIn.toFixed(2)}" cuttable width) = ${widthFactor.toFixed(3)}
3. Net Yardage / pc = (${totalCutLengthIn.toFixed(2)}" / 36) × ${Math.max(1.0, widthFactor).toFixed(3)} = ${netYdsPerPc.toFixed(3)} yd/pc
4. Gross Yardage / pc = Net × (1 + ${wastage}% wastage) = ${grossYdsPerPc.toFixed(3)} yd/pc (${grossYdsPerDoz.toFixed(3)} yd/doz)`;

    const breakdownRows = [
      {
        label: 'Net Yardage per Piece',
        value: `${netYdsPerPc.toFixed(3)} yd/pc (${(netYdsPerPc * 12).toFixed(3)} yd/doz)`,
      },
      {
        label: `Wastage Allowance (${wastage}%)`,
        value: `+${(grossYdsPerPc - netYdsPerPc).toFixed(3)} yd/pc`,
      },
      {
        label: 'Gross Yardage per Piece',
        value: `${grossYdsPerPc.toFixed(3)} yd/pc`,
        highlight: true,
      },
      {
        label: 'Gross Yardage per Dozen',
        value: `${grossYdsPerDoz.toFixed(3)} yd/doz`,
      },
      {
        label: `Total Order Fabric (${orderPcs} pcs)`,
        value: `${UnitConverters.formatNumber(totalYdsOrder, 1)} yds (${UnitConverters.formatNumber(totalMOrder, 1)} m)`,
      },
      {
        label: 'Total Estimated Weight',
        value: `${UnitConverters.formatNumber(totalWeightKg, 1)} kg`,
      },
    ];

    let heroValue = grossYdsPerPc.toFixed(3);
    let heroUnit = 'yd / pc';

    switch (targetConvention) {
      case 'yds_per_doz':
        heroValue = grossYdsPerDoz.toFixed(3);
        heroUnit = 'yd / doz';
        break;
      case 'm_per_pc':
        heroValue = grossMPerPc.toFixed(3);
        heroUnit = 'm / pc';
        break;
      case 'm_per_doz':
        heroValue = grossMPerDoz.toFixed(3);
        heroUnit = 'm / doz';
        break;
      case 'total_yds':
        heroValue = UnitConverters.formatNumber(totalYdsOrder, 1);
        heroUnit = `yd (Order of ${orderPcs} pcs)`;
        break;
      case 'total_m':
        heroValue = UnitConverters.formatNumber(totalMOrder, 1);
        heroUnit = `m (Order of ${orderPcs} pcs)`;
        break;
      case 'total_kg':
        heroValue = UnitConverters.formatNumber(totalWeightKg, 1);
        heroUnit = 'kg fabric';
        break;
      default:
        heroValue = grossYdsPerPc.toFixed(3);
        heroUnit = 'yd / pc';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Per Dozen', value: `${grossYdsPerDoz.toFixed(3)} yd/doz` },
        { label: 'Metric', value: `${grossMPerPc.toFixed(3)} m/pc` },
        { label: 'Total Yards', value: `${UnitConverters.formatNumber(totalYdsOrder, 0)} yds` },
        { label: 'Est. Weight', value: `${UnitConverters.formatNumber(totalWeightKg, 0)} kg` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: grossYdsPerPc,
      rawGrossUnit: 'yd/pc',
    };
  },

  // 3. Trouser & Bottoms
  calculateTrouser(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const outseam = UnitConverters.lengthToCm(
      values.tr_outseam?.value || 0,
      values.tr_outseam?.unit || 'cm'
    );
    const thigh = UnitConverters.lengthToCm(
      values.tr_thigh?.value || 0,
      values.tr_thigh?.unit || 'cm'
    );
    const hip = UnitConverters.lengthToCm(
      values.tr_hip?.value || 0,
      values.tr_hip?.unit || 'cm'
    );
    const waistband = UnitConverters.lengthToCm(
      values.tr_waistband?.value || 0,
      values.tr_waistband?.unit || 'cm'
    );
    const pocket = UnitConverters.lengthToCm(
      values.tr_pocket?.value || 0,
      values.tr_pocket?.unit || 'cm'
    );
    const allowance = UnitConverters.lengthToCm(
      values.tr_allowance?.value || 0,
      values.tr_allowance?.unit || 'cm'
    );
    const fabWidthCm = UnitConverters.lengthToCm(
      values.tr_fab_width?.value || 0,
      values.tr_fab_width?.unit || 'in'
    );
    const gsm = UnitConverters.gsmToGsm(values.tr_gsm?.value || 0, values.tr_gsm?.unit || 'gsm');
    const wastage = values.tr_wastage?.value || 0;
    const orderPcs = UnitConverters.qtyToPcs(
      values.tr_order_qty?.value || 1,
      values.tr_order_qty?.unit || 'pcs'
    );
    const targetConvention = values.tr_target_convention?.unit || 'yds_per_pc';

    const totalLenCm = outseam + allowance + waistband * 0.5 + pocket * 0.4;
    const totalWidthCm = thigh * 4;
    const laysAcross = Math.max(1.0, totalWidthCm / fabWidthCm);

    const netMPerPc = (totalLenCm / 100) * (laysAcross * 0.5);
    const grossMPerPc = netMPerPc * (1 + wastage / 100);
    const grossYdPerPc = grossMPerPc / 0.9144;
    const grossYdPerDoz = grossYdPerPc * 12;

    const areaM2Pc = grossMPerPc * (fabWidthCm / 100);
    const grossKgPerDoz = ((areaM2Pc * gsm) / 1000) * 12;
    const totalYds = grossYdPerPc * orderPcs;
    const totalKg = (areaM2Pc * gsm * orderPcs) / 1000;

    const normRows = [
      {
        name: 'Outseam Length',
        raw: `${values.tr_outseam?.value || 0} ${values.tr_outseam?.unit || 'cm'}`,
        factor: '1 cm/cm',
        normalized: `${outseam.toFixed(2)} cm`,
      },
      {
        name: '1/2 Thigh Width',
        raw: `${values.tr_thigh?.value || 0} ${values.tr_thigh?.unit || 'cm'}`,
        factor: '1 cm/cm',
        normalized: `${thigh.toFixed(2)} cm`,
      },
      {
        name: '1/2 Hip (Seat)',
        raw: `${values.tr_hip?.value || 0} ${values.tr_hip?.unit || 'cm'}`,
        factor: '1 cm/cm',
        normalized: `${hip.toFixed(2)} cm`,
      },
      {
        name: 'Cuttable Fabric Width',
        raw: `${values.tr_fab_width?.value || 0} ${values.tr_fab_width?.unit || 'in'}`,
        factor: '2.54 cm/in',
        normalized: `${fabWidthCm.toFixed(2)} cm`,
      },
      {
        name: 'Fabric Weight',
        raw: `${values.tr_gsm?.value || 0} ${values.tr_gsm?.unit || 'gsm'}`,
        factor: 'Direct GSM',
        normalized: `${gsm.toFixed(1)} g/m²`,
      },
    ];

    const formulaAudit = `1. Total Panel Effective Length = ${outseam.toFixed(1)} cm (Outseam) + ${allowance.toFixed(1)} cm (Allowance) + ${(waistband * 0.5).toFixed(1)} cm (Waistband share) = ${totalLenCm.toFixed(1)} cm
2. 4-Panel Thigh Width = (${thigh.toFixed(1)} cm × 4) = ${totalWidthCm.toFixed(1)} cm
3. Lay Width Factor = ${totalWidthCm.toFixed(1)} cm / ${fabWidthCm.toFixed(1)} cm fabric width = ${laysAcross.toFixed(2)}
4. Net Consumption = ${netMPerPc.toFixed(3)} m/pc (${(netMPerPc / 0.9144).toFixed(3)} yd/pc)
5. Gross Consumption (with ${wastage}% wastage) = ${grossMPerPc.toFixed(3)} m/pc = ${grossYdPerPc.toFixed(3)} yd/pc (${grossYdPerDoz.toFixed(3)} yd/doz)`;

    const breakdownRows = [
      { label: 'Net Consumption', value: `${netMPerPc.toFixed(3)} m/pc (${(netMPerPc / 0.9144).toFixed(3)} yd/pc)` },
      { label: `Wastage Allowance (${wastage}%)`, value: `+${(grossMPerPc - netMPerPc).toFixed(3)} m/pc` },
      { label: 'Gross Yards per Piece', value: `${grossYdPerPc.toFixed(3)} yd/pc`, highlight: true },
      { label: 'Gross Yards per Dozen', value: `${grossYdPerDoz.toFixed(3)} yd/doz` },
      { label: 'Estimated Weight per Dozen', value: `${grossKgPerDoz.toFixed(3)} kg/doz` },
      { label: `Total Order (${orderPcs} pcs)`, value: `${UnitConverters.formatNumber(totalYds, 1)} yds (${UnitConverters.formatNumber(totalKg, 1)} kg)` },
    ];

    let heroValue = grossYdPerPc.toFixed(3);
    let heroUnit = 'yd / pc';

    switch (targetConvention) {
      case 'yds_per_doz':
        heroValue = grossYdPerDoz.toFixed(3);
        heroUnit = 'yd / doz';
        break;
      case 'm_per_pc':
        heroValue = grossMPerPc.toFixed(3);
        heroUnit = 'm / pc';
        break;
      case 'kg_per_doz':
        heroValue = grossKgPerDoz.toFixed(3);
        heroUnit = 'kg / doz';
        break;
      case 'total_yds':
        heroValue = UnitConverters.formatNumber(totalYds, 1);
        heroUnit = `yd (Order of ${orderPcs} pcs)`;
        break;
      case 'total_kg':
        heroValue = UnitConverters.formatNumber(totalKg, 1);
        heroUnit = 'kg fabric';
        break;
      default:
        heroValue = grossYdPerPc.toFixed(3);
        heroUnit = 'yd / pc';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Per Dozen', value: `${grossYdPerDoz.toFixed(3)} yd/doz` },
        { label: 'Metric', value: `${grossMPerPc.toFixed(3)} m/pc` },
        { label: 'Weight', value: `${grossKgPerDoz.toFixed(3)} kg/doz` },
        { label: 'Order Total', value: `${UnitConverters.formatNumber(totalYds, 0)} yds` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: grossYdPerPc,
      rawGrossUnit: 'yd/pc',
    };
  },

  // 4. Marker Planning
  calculateMarker(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const mkLen =
      UnitConverters.lengthToCm(
        values.mk_length?.value || 0,
        values.mk_length?.unit || 'm'
      ) / 100;
    const mkWid =
      UnitConverters.lengthToCm(
        values.mk_width?.value || 0,
        values.mk_width?.unit || 'cm'
      ) / 100;
    const ratio = Math.max(1, values.mk_garment_ratio?.value || 1);
    const patAreaM2 = UnitConverters.areaToM2(
      values.mk_pattern_area?.value || 0,
      values.mk_pattern_area?.unit || 'm2'
    );
    const totalOrderPcs = UnitConverters.qtyToPcs(
      values.mk_total_pcs?.value || 1,
      values.mk_total_pcs?.unit || 'pcs'
    );
    const gsm = UnitConverters.gsmToGsm(values.mk_gsm?.value || 0, values.mk_gsm?.unit || 'gsm');
    const endLossM =
      UnitConverters.lengthToCm(
        values.mk_end_loss?.value || 0,
        values.mk_end_loss?.unit || 'in'
      ) / 100;
    const maxPlies = Math.max(1, values.mk_plies?.value || 100);
    const targetConvention = values.mk_target_convention?.unit || 'total_meters';

    const markerAreaM2 = mkLen * mkWid;
    const totalPatternAreaM2 = patAreaM2 * ratio;
    const efficiencyPct = markerAreaM2 > 0 ? (totalPatternAreaM2 / markerAreaM2) * 100 : 0;

    const totalPlies = Math.ceil(totalOrderPcs / ratio);
    const numberOfLays = Math.ceil(totalPlies / maxPlies);

    const cutLayLengthM = mkLen + endLossM;
    const totalFabricM = cutLayLengthM * totalPlies;
    const totalFabricYds = totalFabricM / 0.9144;

    const mPerPc = totalOrderPcs > 0 ? totalFabricM / totalOrderPcs : 0;
    const ydPerPc = totalOrderPcs > 0 ? totalFabricYds / totalOrderPcs : 0;

    const totalWeightKg = (totalFabricM * mkWid * gsm) / 1000;
    const totalWeightLbs = totalWeightKg * 2.20462262;

    const normRows = [
      {
        name: 'Marker Length',
        raw: `${values.mk_length?.value || 0} ${values.mk_length?.unit || 'm'}`,
        factor: 'Direct meters',
        normalized: `${mkLen.toFixed(3)} m`,
      },
      {
        name: 'Marker Width',
        raw: `${values.mk_width?.value || 0} ${values.mk_width?.unit || 'cm'}`,
        factor: '0.01 m/cm',
        normalized: `${mkWid.toFixed(3)} m`,
      },
      {
        name: 'Pattern Area (Single Pc)',
        raw: `${values.mk_pattern_area?.value || 0} ${values.mk_pattern_area?.unit || 'm2'}`,
        factor: 'Direct m²',
        normalized: `${patAreaM2.toFixed(3)} m²`,
      },
      {
        name: 'End Loss Allowance',
        raw: `${values.mk_end_loss?.value || 0} ${values.mk_end_loss?.unit || 'in'}`,
        factor: '0.0254 m/in',
        normalized: `${endLossM.toFixed(3)} m`,
      },
    ];

    const formulaAudit = `1. Marker Surface Area = ${mkLen.toFixed(3)} m × ${mkWid.toFixed(3)} m = ${markerAreaM2.toFixed(3)} m²
2. Combined Pattern Area = ${patAreaM2.toFixed(3)} m² × ${ratio} ratio garments = ${totalPatternAreaM2.toFixed(3)} m²
3. Marker Efficiency = (${totalPatternAreaM2.toFixed(3)} m² / ${markerAreaM2.toFixed(3)} m²) × 100 = ${efficiencyPct.toFixed(2)}%
4. Lay Cut Length = ${mkLen.toFixed(3)} m + ${endLossM.toFixed(3)} m (end loss) = ${cutLayLengthM.toFixed(3)} m
5. Total Fabric = ${cutLayLengthM.toFixed(3)} m × ${totalPlies} plies = ${totalFabricM.toFixed(2)} m (${totalFabricYds.toFixed(2)} yds)`;

    const breakdownRows = [
      { label: 'Marker Surface Area', value: `${markerAreaM2.toFixed(3)} m² (${(markerAreaM2 * 1.19599).toFixed(3)} yd²)` },
      { label: `Combined Pattern Area (${ratio} pcs)`, value: `${totalPatternAreaM2.toFixed(3)} m²` },
      { label: 'Marker Efficiency', value: `${efficiencyPct.toFixed(2)}%`, highlight: true },
      { label: 'Total Plies Required', value: `${totalPlies} plies` },
      { label: `Lays / Spreads (${maxPlies} plies max)`, value: `${numberOfLays} lay(s)` },
      { label: 'Total Fabric Length Required', value: `${UnitConverters.formatNumber(totalFabricM, 2)} m (${UnitConverters.formatNumber(totalFabricYds, 2)} yds)` },
      { label: 'Estimated Fabric Weight', value: `${UnitConverters.formatNumber(totalWeightKg, 1)} kg (${UnitConverters.formatNumber(totalWeightLbs, 1)} lbs)` },
    ];

    let heroValue = UnitConverters.formatNumber(totalFabricM, 2);
    let heroUnit = 'meters';

    switch (targetConvention) {
      case 'total_yards':
        heroValue = UnitConverters.formatNumber(totalFabricYds, 2);
        heroUnit = 'yards';
        break;
      case 'total_kg':
        heroValue = UnitConverters.formatNumber(totalWeightKg, 1);
        heroUnit = 'kg';
        break;
      case 'total_lbs':
        heroValue = UnitConverters.formatNumber(totalWeightLbs, 1);
        heroUnit = 'lbs';
        break;
      case 'consumption_per_pc_m':
        heroValue = mPerPc.toFixed(3);
        heroUnit = 'm / pc';
        break;
      case 'consumption_per_pc_yd':
        heroValue = ydPerPc.toFixed(3);
        heroUnit = 'yd / pc';
        break;
      default:
        heroValue = UnitConverters.formatNumber(totalFabricM, 2);
        heroUnit = 'meters';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Efficiency', value: `${efficiencyPct.toFixed(1)}%` },
        { label: 'Meters/Pc', value: `${mPerPc.toFixed(3)} m/pc` },
        { label: 'Yards/Pc', value: `${ydPerPc.toFixed(3)} yd/pc` },
        { label: 'Plies', value: `${totalPlies} plies` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: totalFabricM,
      rawGrossUnit: 'meters',
    };
  },

  // 5. Fabric Weight & Yield
  calculateFabricYield(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const gsm = UnitConverters.gsmToGsm(values.fy_gsm?.value || 0, values.fy_gsm?.unit || 'gsm');
    const widthM =
      UnitConverters.lengthToCm(
        values.fy_width?.value || 0,
        values.fy_width?.unit || 'in'
      ) / 100;
    const targetConvention = values.fy_target_convention?.unit || 'm_per_kg';

    const glm = gsm * widthM;
    const mPerKg = glm > 0 ? 1000 / glm : 0;
    const ydPerKg = mPerKg * 1.0936133;
    const ydPerLb = ydPerKg / 2.20462262;
    const ozPerYd = (glm * 0.9144) / 28.349523;

    const normRows = [
      {
        name: 'Fabric GSM',
        raw: `${values.fy_gsm?.value || 0} ${values.fy_gsm?.unit || 'gsm'}`,
        factor: 'Direct GSM',
        normalized: `${gsm.toFixed(1)} g/m²`,
      },
      {
        name: 'Cuttable Width',
        raw: `${values.fy_width?.value || 0} ${values.fy_width?.unit || 'in'}`,
        factor: '0.0254 m/in',
        normalized: `${widthM.toFixed(3)} m (${(widthM * 39.3701).toFixed(1)} inches)`,
      },
    ];

    const formulaAudit = `1. Grams per Linear Meter (GLM) = ${gsm.toFixed(1)} g/m² × ${widthM.toFixed(3)} m width = ${glm.toFixed(1)} g/m
2. Linear Meters per kg = 1000 / ${glm.toFixed(1)} = ${mPerKg.toFixed(3)} m/kg
3. Linear Yards per kg = ${mPerKg.toFixed(3)} × 1.09361 = ${ydPerKg.toFixed(3)} yd/kg
4. Linear Yards per lb = ${ydPerKg.toFixed(3)} / 2.20462 = ${ydPerLb.toFixed(3)} yd/lb
5. Ounces per Linear Yard = (${glm.toFixed(1)} × 0.9144) / 28.3495 = ${ozPerYd.toFixed(2)} oz/yd`;

    const breakdownRows = [
      { label: 'Grams per Linear Meter (GLM)', value: `${glm.toFixed(1)} g/m` },
      { label: 'Linear Meters per kg', value: `${mPerKg.toFixed(3)} m/kg`, highlight: true },
      { label: 'Linear Yards per kg', value: `${ydPerKg.toFixed(3)} yd/kg` },
      { label: 'Linear Yards per lb', value: `${ydPerLb.toFixed(3)} yd/lb` },
      { label: 'Ounces per Linear Yard', value: `${ozPerYd.toFixed(2)} oz/yd` },
    ];

    let heroValue = mPerKg.toFixed(3);
    let heroUnit = 'm / kg';

    switch (targetConvention) {
      case 'yd_per_kg':
        heroValue = ydPerKg.toFixed(3);
        heroUnit = 'yd / kg';
        break;
      case 'yd_per_lb':
        heroValue = ydPerLb.toFixed(3);
        heroUnit = 'yd / lb';
        break;
      case 'g_per_m':
        heroValue = glm.toFixed(1);
        heroUnit = 'g / linear m';
        break;
      case 'oz_per_yd':
        heroValue = ozPerYd.toFixed(2);
        heroUnit = 'oz / linear yd';
        break;
      default:
        heroValue = mPerKg.toFixed(3);
        heroUnit = 'm / kg';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Width', value: `${(widthM * 39.3701).toFixed(1)}" (${(widthM * 100).toFixed(0)} cm)` },
        { label: 'GLM', value: `${glm.toFixed(1)} g/m` },
        { label: 'yd/kg', value: `${ydPerKg.toFixed(2)} yd/kg` },
        { label: 'yd/lb', value: `${ydPerLb.toFixed(2)} yd/lb` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: mPerKg,
      rawGrossUnit: 'm/kg',
    };
  },

  // 6. Sewing Thread
  calculateThread(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const seamLenM =
      UnitConverters.lengthToCm(
        values.th_seam_len?.value || 0,
        values.th_seam_len?.unit || 'cm'
      ) / 100;
    const spi = UnitConverters.stitchDensityToSpi(
      values.th_spi?.value || 12,
      values.th_spi?.unit || 'spi'
    );
    const stitchTypeKey = values.th_stitch_type?.unit || '504_overlock';

    const factorMap: Record<string, { label: string; factor: number }> = {
      '301_lock': { label: 'ISO 301 - Lockstitch', factor: 2.8 },
      '401_chain': { label: 'ISO 401 - Single Needle Chainstitch', factor: 4.5 },
      '504_overlock': { label: 'ISO 504 - 3-Thread Overlock', factor: 14.0 },
      '514_safety': { label: 'ISO 514 - 4-Thread Mock Safety', factor: 18.0 },
      '602_cover': { label: 'ISO 602 - 4-Thread Coverstitch', factor: 22.0 },
      '605_cover': { label: 'ISO 605 - 5-Thread Top & Bottom Coverstitch', factor: 28.0 },
    };

    const stitchData = factorMap[stitchTypeKey] || factorMap['504_overlock'];
    const thicknessMm =
      UnitConverters.lengthToCm(
        values.th_thickness?.value || 0,
        values.th_thickness?.unit || 'mm'
      ) * 10;
    const wastage = values.th_wastage?.value || 0;
    const orderPcs = UnitConverters.qtyToPcs(
      values.th_order_qty?.value || 1,
      values.th_order_qty?.unit || 'pcs'
    );
    const coneLenM =
      UnitConverters.lengthToCm(
        values.th_cone_len?.value || 5000,
        values.th_cone_len?.unit || 'm'
      ) / 100;
    const targetConvention = values.th_target_convention?.unit || 'm_per_pc';

    const dynamicFactor = stitchData.factor * (1 + thicknessMm * 0.05);
    const netThreadMPerPc = seamLenM * dynamicFactor;
    const grossThreadMPerPc = netThreadMPerPc * (1 + wastage / 100);
    const grossThreadYdPerPc = grossThreadMPerPc * 1.0936133;

    const totalOrderThreadM = grossThreadMPerPc * orderPcs;
    const totalOrderThreadYd = grossThreadYdPerPc * orderPcs;
    const totalCones = Math.ceil(totalOrderThreadM / coneLenM);

    const normRows = [
      {
        name: 'Seam Length',
        raw: `${values.th_seam_len?.value || 0} ${values.th_seam_len?.unit || 'cm'}`,
        factor: '0.01 m/cm',
        normalized: `${seamLenM.toFixed(2)} m (${(seamLenM * 39.3701).toFixed(1)} inches)`,
      },
      {
        name: 'Stitch Density',
        raw: `${values.th_spi?.value || 0} ${values.th_spi?.unit || 'spi'}`,
        factor: 'Direct SPI',
        normalized: `${spi.toFixed(1)} stitches/inch`,
      },
      {
        name: 'Stitch Class',
        raw: stitchData.label,
        factor: `Base: ${stitchData.factor}`,
        normalized: `Adjusted factor: ${dynamicFactor.toFixed(2)}`,
      },
      {
        name: 'Spool / Cone Capacity',
        raw: `${values.th_cone_len?.value || 5000} ${values.th_cone_len?.unit || 'm'}`,
        factor: 'Direct meters',
        normalized: `${coneLenM.toFixed(0)} meters/cone`,
      },
    ];

    const formulaAudit = `1. Base Stitch Factor = ${stitchData.factor} (${stitchData.label})
2. Seam Thickness Adjustment = ${stitchData.factor} × (1 + ${thicknessMm.toFixed(1)} mm × 0.05) = ${dynamicFactor.toFixed(2)}
3. Net Thread / pc = ${seamLenM.toFixed(2)} m seam × ${dynamicFactor.toFixed(2)} = ${netThreadMPerPc.toFixed(2)} m/pc
4. Gross Thread / pc (+${wastage}% wastage) = ${grossThreadMPerPc.toFixed(2)} m/pc (${grossThreadYdPerPc.toFixed(2)} yd/pc)
5. Total Order Thread = ${grossThreadMPerPc.toFixed(2)} m × ${orderPcs} garments = ${totalOrderThreadM.toFixed(0)} meters
6. Cones Required = ⌈${totalOrderThreadM.toFixed(0)} m / ${coneLenM.toFixed(0)} m per cone⌉ = ${totalCones} spools`;

    const breakdownRows = [
      { label: 'Normalized Seam Length', value: `${seamLenM.toFixed(2)} meters` },
      { label: 'Applied Stitch Multiplier', value: `${dynamicFactor.toFixed(2)}` },
      { label: 'Net Thread per Garment', value: `${netThreadMPerPc.toFixed(2)} m/pc` },
      { label: `Gross Thread per Garment (+${wastage}%)`, value: `${grossThreadMPerPc.toFixed(2)} m/pc (${grossThreadYdPerPc.toFixed(2)} yd/pc)`, highlight: true },
      { label: `Total Order Thread (${orderPcs} pcs)`, value: `${UnitConverters.formatNumber(totalOrderThreadM, 0)} m (${UnitConverters.formatNumber(totalOrderThreadYd, 0)} yds)` },
      { label: 'Required Cones / Spools', value: `${totalCones} spools`, highlight: true },
    ];

    let heroValue = grossThreadMPerPc.toFixed(1);
    let heroUnit = 'm / pc';

    switch (targetConvention) {
      case 'yd_per_pc':
        heroValue = grossThreadYdPerPc.toFixed(1);
        heroUnit = 'yd / pc';
        break;
      case 'total_cones':
        heroValue = `${totalCones}`;
        heroUnit = 'cones required';
        break;
      case 'total_m':
        heroValue = UnitConverters.formatNumber(totalOrderThreadM, 0);
        heroUnit = `meters (${orderPcs} pcs)`;
        break;
      case 'total_yd':
        heroValue = UnitConverters.formatNumber(totalOrderThreadYd, 0);
        heroUnit = `yards (${orderPcs} pcs)`;
        break;
      default:
        heroValue = grossThreadMPerPc.toFixed(1);
        heroUnit = 'm / pc';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Per Garment', value: `${grossThreadMPerPc.toFixed(1)} m/pc` },
        { label: 'Imperial', value: `${grossThreadYdPerPc.toFixed(1)} yd/pc` },
        { label: 'Total Cones', value: `${totalCones} cones` },
        { label: 'Order Thread', value: `${UnitConverters.formatNumber(totalOrderThreadM, 0)} m` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: grossThreadMPerPc,
      rawGrossUnit: 'm/pc',
    };
  },

  // 7. Carton & Freight
  calculateCarton(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const lenCm = UnitConverters.lengthToCm(
      values.ct_len?.value || 0,
      values.ct_len?.unit || 'cm'
    );
    const widCm = UnitConverters.lengthToCm(
      values.ct_wid?.value || 0,
      values.ct_wid?.unit || 'cm'
    );
    const hgtCm = UnitConverters.lengthToCm(
      values.ct_hgt?.value || 0,
      values.ct_hgt?.unit || 'cm'
    );
    const packRatio = Math.max(1, values.ct_pack_ratio?.value || 1);
    const orderPcs = UnitConverters.qtyToPcs(
      values.ct_order_qty?.value || 1,
      values.ct_order_qty?.unit || 'pcs'
    );
    const weightKg =
      UnitConverters.weightToGrams(
        values.ct_weight?.value || 0,
        values.ct_weight?.unit || 'kg'
      ) / 1000;
    const divisor = values.ct_divisor?.value || 6000;
    const targetConvention = values.ct_target_convention?.unit || 'total_cbm';

    const cbmPerCarton = (lenCm * widCm * hgtCm) / 1000000;
    const cuftPerCarton = cbmPerCarton * 35.314667;

    const totalCartons = Math.ceil(orderPcs / packRatio);
    const totalCbm = cbmPerCarton * totalCartons;
    const totalCuft = totalCbm * 35.314667;

    const airVolKgPerCarton = (lenCm * widCm * hgtCm) / divisor;
    const totalAirVolKg = airVolKgPerCarton * totalCartons;
    const totalActualGrossKg = weightKg * totalCartons;
    const chargeableWeight = Math.max(totalActualGrossKg, totalAirVolKg);

    const normRows = [
      {
        name: 'Carton Dimensions',
        raw: `${values.ct_len?.value || 0}×${values.ct_wid?.value || 0}×${values.ct_hgt?.value || 0} ${values.ct_len?.unit || 'cm'}`,
        factor: 'Normalized to cm',
        normalized: `${lenCm.toFixed(1)} × ${widCm.toFixed(1)} × ${hgtCm.toFixed(1)} cm`,
      },
      {
        name: 'Gross Weight / Carton',
        raw: `${values.ct_weight?.value || 0} ${values.ct_weight?.unit || 'kg'}`,
        factor: 'Direct kg',
        normalized: `${weightKg.toFixed(2)} kg`,
      },
      {
        name: 'Air Volumetric Divisor',
        raw: `${divisor}`,
        factor: 'IATA/Express',
        normalized: `${divisor} cm³/kg`,
      },
    ];

    const formulaAudit = `1. Single Carton Volume = (${lenCm.toFixed(1)} × ${widCm.toFixed(1)} × ${hgtCm.toFixed(1)}) / 1,000,000 = ${cbmPerCarton.toFixed(4)} CBM (${cuftPerCarton.toFixed(2)} cu.ft)
2. Total Cartons = ⌈${orderPcs} garments / ${packRatio} pcs per carton⌉ = ${totalCartons} cartons
3. Total Shipment Volume = ${cbmPerCarton.toFixed(4)} CBM × ${totalCartons} cartons = ${totalCbm.toFixed(3)} CBM (${totalCuft.toFixed(2)} cu.ft)
4. Total Actual Weight = ${weightKg.toFixed(2)} kg × ${totalCartons} cartons = ${totalActualGrossKg.toFixed(1)} kg
5. Air Volumetric Weight = [(${lenCm.toFixed(1)} × ${widCm.toFixed(1)} × ${hgtCm.toFixed(1)}) / ${divisor}] × ${totalCartons} = ${totalAirVolKg.toFixed(1)} kg
6. Chargeable Air Freight Weight = max(${totalActualGrossKg.toFixed(1)} kg, ${totalAirVolKg.toFixed(1)} kg) = ${chargeableWeight.toFixed(1)} kg`;

    const breakdownRows = [
      { label: 'Total Cartons Required', value: `${totalCartons} cartons` },
      { label: 'Volume per Carton', value: `${cbmPerCarton.toFixed(4)} CBM (${cuftPerCarton.toFixed(2)} ft³)` },
      { label: 'Total Shipment Volume', value: `${totalCbm.toFixed(3)} CBM`, highlight: true },
      { label: 'Total Shipment Cu.Ft', value: `${totalCuft.toFixed(2)} ft³` },
      { label: 'Total Actual Gross Weight', value: `${totalActualGrossKg.toFixed(1)} kg` },
      { label: 'Air Volumetric Weight', value: `${totalAirVolKg.toFixed(1)} kg` },
      {
        label: 'Chargeable Air Weight',
        value: `${chargeableWeight.toFixed(1)} kg (${chargeableWeight > totalActualGrossKg ? 'Volumetric Heavy' : 'Actual Weight Heavy'})`,
        highlight: true,
      },
    ];

    let heroValue = totalCbm.toFixed(3);
    let heroUnit = 'CBM (m³)';

    switch (targetConvention) {
      case 'cbm_per_carton':
        heroValue = cbmPerCarton.toFixed(4);
        heroUnit = 'CBM / carton';
        break;
      case 'total_cuft':
        heroValue = totalCuft.toFixed(2);
        heroUnit = 'Cubic Feet (ft³)';
        break;
      case 'total_air_vol_kg':
        heroValue = totalAirVolKg.toFixed(1);
        heroUnit = 'Air Vol. kg';
        break;
      case 'total_cartons':
        heroValue = `${totalCartons}`;
        heroUnit = 'Cartons';
        break;
      default:
        heroValue = totalCbm.toFixed(3);
        heroUnit = 'CBM (m³)';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'Shipment Volume', value: `${totalCbm.toFixed(2)} CBM` },
        { label: 'Cartons', value: `${totalCartons} Boxes` },
        { label: 'Air Vol. Wt', value: `${totalAirVolKg.toFixed(0)} kg` },
        { label: 'Chargeable', value: `${chargeableWeight.toFixed(0)} kg` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: totalCbm,
      rawGrossUnit: 'CBM',
    };
  },

  // 8. Garment Costing Engine
  calculateCosting(values: Record<string, { value: number; unit: string }>): CalculationResult {
    const consumptionRaw = values.ce_consumption?.value || 0;
    const consumptionUnit = values.ce_consumption?.unit || 'kg_per_doz';
    const fabricPrice = values.ce_fab_price?.value || 0;
    const currency = values.ce_currency?.unit || 'USD';

    const trimsRaw = values.ce_trims?.value || 0;
    const trimsUnit = values.ce_trims?.unit || 'per_doz';

    const cmRaw = values.ce_cm?.value || 0;
    const cmUnit = values.ce_cm?.unit || 'per_doz';

    const embellishRaw = values.ce_embellish?.value || 0;
    const embellishUnit = values.ce_embellish?.unit || 'per_doz';

    const overheadRaw = values.ce_overhead?.value || 0;
    const overheadUnit = values.ce_overhead?.unit || 'per_doz';

    const profitPct = values.ce_profit?.value || 0;
    const orderPcs = UnitConverters.qtyToPcs(
      values.ce_order_qty?.value || 1,
      values.ce_order_qty?.unit || 'pcs'
    );
    const targetConvention = values.ce_target_convention?.unit || 'fob_per_pc';

    let consumptionPerDoz = consumptionRaw;
    if (consumptionUnit.includes('per_pc')) {
      consumptionPerDoz = consumptionRaw * 12;
    }

    const fabricCostDoz = consumptionPerDoz * fabricPrice;

    const toDoz = (val: number, u: string) => (u === 'per_pc' ? val * 12 : val);

    const trimsDoz = toDoz(trimsRaw, trimsUnit);
    const cmDoz = toDoz(cmRaw, cmUnit);
    const embellishDoz = toDoz(embellishRaw, embellishUnit);
    const overheadDoz = toDoz(overheadRaw, overheadUnit);

    const netFactoryCostDoz = fabricCostDoz + trimsDoz + cmDoz + embellishDoz + overheadDoz;
    const profitDoz = netFactoryCostDoz * (profitPct / 100);
    const fobDoz = netFactoryCostDoz + profitDoz;

    const fobPc = fobDoz / 12;
    const netFactoryCostPc = netFactoryCostDoz / 12;
    const totalOrderFOB = fobPc * orderPcs;
    const totalOrderFactory = netFactoryCostPc * orderPcs;

    const currSign = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

    const normRows = [
      {
        name: 'Fabric Consumption',
        raw: `${consumptionRaw} ${consumptionUnit}`,
        factor: consumptionUnit.includes('per_pc') ? '×12 to dozen' : 'Direct dozen',
        normalized: `${consumptionPerDoz.toFixed(3)} / dozen`,
      },
      {
        name: 'Fabric Rate',
        raw: `${currSign}${fabricPrice.toFixed(2)}`,
        factor: 'Rate',
        normalized: `${currSign}${fabricCostDoz.toFixed(2)} / dozen fabric cost`,
      },
      {
        name: 'Trims Cost',
        raw: `${currSign}${trimsRaw.toFixed(2)} (${trimsUnit})`,
        factor: 'Normalized',
        normalized: `${currSign}${trimsDoz.toFixed(2)} / dozen`,
      },
      {
        name: 'CM (Labor)',
        raw: `${currSign}${cmRaw.toFixed(2)} (${cmUnit})`,
        factor: 'Normalized',
        normalized: `${currSign}${cmDoz.toFixed(2)} / dozen`,
      },
      {
        name: 'Embellishments',
        raw: `${currSign}${embellishRaw.toFixed(2)} (${embellishUnit})`,
        factor: 'Normalized',
        normalized: `${currSign}${embellishDoz.toFixed(2)} / dozen`,
      },
      {
        name: 'Factory Overheads',
        raw: `${currSign}${overheadRaw.toFixed(2)} (${overheadUnit})`,
        factor: 'Normalized',
        normalized: `${currSign}${overheadDoz.toFixed(2)} / dozen`,
      },
    ];

    const formulaAudit = `1. Fabric Cost / doz = ${consumptionPerDoz.toFixed(3)} × ${currSign}${fabricPrice.toFixed(2)} = ${currSign}${fabricCostDoz.toFixed(2)}
2. Net Factory Cost / doz = Fabric (${currSign}${fabricCostDoz.toFixed(2)}) + Trims (${currSign}${trimsDoz.toFixed(2)}) + CM (${currSign}${cmDoz.toFixed(2)}) + Embellish (${currSign}${embellishDoz.toFixed(2)}) + Overheads (${currSign}${overheadDoz.toFixed(2)}) = ${currSign}${netFactoryCostDoz.toFixed(2)}
3. Factory Profit (${profitPct}%) = ${currSign}${netFactoryCostDoz.toFixed(2)} × ${profitPct}% = ${currSign}${profitDoz.toFixed(2)}
4. FOB Price / dozen = Net Cost + Profit = ${currSign}${fobDoz.toFixed(2)}
5. FOB Price / piece = ${currSign}${fobDoz.toFixed(2)} / 12 = ${currSign}${fobPc.toFixed(2)}
6. Total Order FOB Value (${orderPcs} pcs) = ${currSign}${fobPc.toFixed(2)} × ${orderPcs} = ${currSign}${UnitConverters.formatNumber(totalOrderFOB, 2)}`;

    const breakdownRows = [
      { label: `Fabric Material (${((fabricCostDoz / (fobDoz || 1)) * 100).toFixed(1)}%)`, value: `${currSign}${fabricCostDoz.toFixed(2)} / doz (${currSign}${(fabricCostDoz / 12).toFixed(2)} / pc)` },
      { label: `Trims & Accessories (${((trimsDoz / (fobDoz || 1)) * 100).toFixed(1)}%)`, value: `${currSign}${trimsDoz.toFixed(2)} / doz (${currSign}${(trimsDoz / 12).toFixed(2)} / pc)` },
      { label: `CM Labor & Assembly (${((cmDoz / (fobDoz || 1)) * 100).toFixed(1)}%)`, value: `${currSign}${cmDoz.toFixed(2)} / doz (${currSign}${(cmDoz / 12).toFixed(2)} / pc)` },
      { label: `Embellishments / Wash / Print`, value: `${currSign}${embellishDoz.toFixed(2)} / doz (${currSign}${(embellishDoz / 12).toFixed(2)} / pc)` },
      { label: `Commercial & Testing Overheads`, value: `${currSign}${overheadDoz.toFixed(2)} / doz (${currSign}${(overheadDoz / 12).toFixed(2)} / pc)` },
      { label: `Factory Profit Margin (${profitPct}%)`, value: `${currSign}${profitDoz.toFixed(2)} / doz (${currSign}${(profitDoz / 12).toFixed(2)} / pc)` },
      { label: 'Total FOB Quotation per Piece', value: `${currSign}${fobPc.toFixed(2)} / pc`, highlight: true },
      { label: 'Total FOB Quotation per Dozen', value: `${currSign}${fobDoz.toFixed(2)} / doz`, highlight: true },
      { label: `Total Order FOB Value (${orderPcs} pcs)`, value: `${currSign}${UnitConverters.formatNumber(totalOrderFOB, 2)}` },
    ];

    let heroValue = `${currSign}${fobPc.toFixed(2)}`;
    let heroUnit = '/ piece';

    switch (targetConvention) {
      case 'fob_per_doz':
        heroValue = `${currSign}${fobDoz.toFixed(2)}`;
        heroUnit = '/ dozen';
        break;
      case 'total_fob_order':
        heroValue = `${currSign}${UnitConverters.formatNumber(totalOrderFOB, 2)}`;
        heroUnit = `(Total for ${orderPcs} pcs)`;
        break;
      case 'total_factory_cost':
        heroValue = `${currSign}${UnitConverters.formatNumber(totalOrderFactory, 2)}`;
        heroUnit = `(Net Cost for ${orderPcs} pcs)`;
        break;
      default:
        heroValue = `${currSign}${fobPc.toFixed(2)}`;
        heroUnit = '/ piece';
    }

    return {
      heroValue,
      heroUnit,
      secondaryBadges: [
        { label: 'FOB / Pc', value: `${currSign}${fobPc.toFixed(2)}` },
        { label: 'FOB / Doz', value: `${currSign}${fobDoz.toFixed(2)}` },
        { label: 'Fabric Share', value: `${((fabricCostDoz / (fobDoz || 1)) * 100).toFixed(0)}%` },
        { label: 'Order Value', value: `${currSign}${UnitConverters.formatNumber(totalOrderFOB, 0)}` },
      ],
      normalizationTable: normRows,
      formulaAudit,
      breakdownRows,
      rawGrossValue: fobPc,
      rawGrossUnit: `${currSign}/pc`,
    };
  },
};
