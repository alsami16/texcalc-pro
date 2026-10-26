# Enterprise Apparel Engineering & Costing Calculator

An enterprise-grade, mathematically verified computational suite for textile engineers, merchandisers, and apparel factories. Enables rigorous fabric consumption forecasting, marker efficiency planning, thread requirement calculation, packaging CBM/freight logistics, and garment manufacturing FOB/CM costing with independent unit conversion and comprehensive mathematical audit trails.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been confirmed for the system architecture based on engineering requirements and user feedback:

- **Confirmed Decision 1 (Real-Time Reactive Calculation)**: The calculation engine evaluates instantly in real time whenever any measurement, allowance, or unit selector changes, providing immediate visual feedback without requiring repeated manual clicks.
- **Confirmed Decision 2 (Multi-Format Export & Tech Pack Output)**: Full support for export workflows:
  - Printable / PDF Tech Pack Engineering Specification Sheet (clean white/high-contrast print stylesheet for factory floor and merchandising review).
  - CSV / Excel tabular export containing input dimensions, normalized values, and cost schedules.
  - JSON tech pack data export for ERP/PLM integration and saving/loading project scenarios.
- **Confirmed Decision 3 (Industry Garment Presets)**: Built-in library of standardized production specs (Men's Basic Crewneck S/M/L/XL, Pique Polo with Flat-Knit Rib, 5-Pocket Denim Jeans, Woven Oxford Shirt, Fleece Pullover Hoodie) enabling one-click benchmark loading alongside custom manual specs.
- **Confirmed Decision 4 (Zero-Pill & Anti-Slop Visual System)**: Strict compliance with enterprise SaaS dashboard standards—dark slate engineering theme (`#0b0f19`), unboxed metadata with typographic separators, JetBrains Mono tabular figures, clear hairline borders, and no pseudo-technical clutter.

---

## 1. Overview & Core Concept

### What It Does
The Apparel Engineering & Costing Calculator provides 8 specialized modules covering the entire garment manufacturing lifecycle:
1. **Knit T-Shirt & Polo Fabric Consumption**: Body, half-chest, sleeve length/width, seam/hem allowances, GSM, cutting wastage, and collar rib weight.
2. **Woven Shirt Fabric Consumption**: Center back length, chest circumference, sleeve length, collar/cuff allowances, and cuttable fabric width linear yardage.
3. **Pants, Joggers & Bottoms Consumption**: Outseam, thigh, seat/hip, waistband, pocketing allowances, and multi-panel lay factor.
4. **Marker Planning & Cut Efficiency**: Lay length, cuttable width, garment ratio, pattern net area, plies, end loss allowance, table capacity, and percentage marker efficiency.
5. **Fabric Weight & Yield Converter**: Bidirectional conversion between GSM, cuttable width, linear meters/kg, yards/kg, yards/lb, and grams per linear meter (GLM).
6. **Sewing Thread Engineering**: ISO stitch type factor matrix (ISO 301 Lockstitch, ISO 401 Chainstitch, ISO 504 Overlock, ISO 514 Mock Safety, ISO 602/605 Coverstitch), seam thickness multiplier, SPI/SPC density, and order spool/cone tally.
7. **Carton Dimensions, CBM & Freight Costing**: Master carton $L \times W \times H$, piece packing ratio, gross carton weight, total container CBM/cu.ft., and air volumetric chargeable weight (IATA 6000 & 5000 divisors).
8. **Garment Manufacturing Costing Engine**: FOB / CM quotation generator synthesizing material cost, trims, labor (CM), wash/print embellishments, commercial overheads, and profit margin per piece, per dozen, and order totality.

### Target Audience & Persona
- **Apparel Merchandisers & Sourcing Managers**: Accurately quote FOB/CM prices to retail buyers and prevent fabric over-budgeting.
- **Garment Technical Designers & Pattern Masters**: Validate consumption yields, stitch requirements, and marker efficiency before laying fabric.
- **Industrial Engineers & Cutting Floor Supervisors**: Calculate exact roll requirements, plies per lay, end loss, and packing volumes for container stuffing.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Module Selection**: Switch seamlessly across the 8 production domains using single-line navigation buttons with clear active states.
2. **Independent Input & Unit Normalization**: Each input field features an adjacent independent dropdown (e.g., `cm`, `inches`, `mm`, `m`, `yd`, `GSM`, `oz/yd²`, `plies`, `doz`, `pcs`). Modifying the unit on one field immediately recalculates its normalized value without disturbing neighboring fields.
3. **Preset Loading**: Select from standardized industry tech pack templates (e.g., "Men's Crew Neck 180 GSM", "Polo Shirt with Rib 220 GSM", "Woven Denim 12 oz") to populate verified baselines with a single click.
4. **Custom Output Convention**: Choose how results are presented (e.g., `kg/doz`, `g/pc`, `yd/pc`, `m/doz`, `Total Order Fabric`, `CBM`, `Total Cones`) with automatic conversion.
5. **Transparent Mathematical Audit**: Inspect 3 step-by-step breakdown panels:
   - *Step 1*: Input normalization table showing exact conversion multipliers.
   - *Step 2*: Mathematical formulas populated with active numbers.
   - *Step 3*: Sub-assembly net vs. gross wastage comparison and order totals.
6. **Export & Sharing**: Generate high-density print-ready Tech Pack Spec Sheets, download CSV spreadsheets for Excel, or export JSON files for ERP archival.

### Visual Identity & Theme
- **Theme Palette**: Deep engineering slate canvas (`#0b0f19`), structural card surfaces (`#111827`), subtle hairline borders (`#1f293d`), cobalt blue primary accents (`#2563eb`), and emerald accent highlights (`#10b981`).
- **Typography Pairing**:
  - *Display & UI Sans*: `Plus Jakarta Sans` for headers, labels, and navigation.
  - *Data & Engineering Math*: `JetBrains Mono` with `tabular-nums` for all calculations, formula steps, and numeric table cells.
- **Strict Anti-Slop Disciplines**:
  - Zero pill badge sandwiches: Unboxed metadata tags separated by `·` or `/`.
  - No pseudo-technical prefixes (`//`, `01_CORE`, `>_`).
  - No decorative pulsing dots or non-functional status tickers.
  - Clean input wrappers with clear focus rings and ergonomic unit selectors.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: React Single-Page Architecture with Pure TypeScript Engineering Engine
- **Approach**: Implement pure, zero-dependency mathematical transformation models in a dedicated utility module (`src/engine/converters.ts` and `src/engine/calculators.ts`), decoupled from React view components.
- **Why**: Ensures 100% testable, exact floating-point precision, instant sub-millisecond calculation updates, and effortless export generation without network latency.

### Decision 2: Independent State per Measurement vs. Coupled Unit Systems
- **Approach**: Store each measurement field as a tuple `{ value: number, unit: string }` rather than forcing a global imperial/metric toggle.
- **Why**: Real-world apparel factories constantly mix units (e.g., body length in cm, chest in inches, fabric weight in GSM, and cuttable width in inches). Independent unit dropdowns reflect actual factory tech pack practices.

### Decision 3: Live Verification & Audit Trail Generation
- **Approach**: Every calculation returns both the numeric answer and a rich structural audit object containing step formulas, normalized values, sub-assembly breakdowns, and secondary conversion badges.
- **Why**: Apparel buyers and factory accountants require auditable mathematical proof to justify quotations and fabric purchasing orders.

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Apparel Engineering UI                          │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [Brand Wordmark] ── [Tech Pack Presets & Export Actions]     │
│  Nav Tabs: [T-Shirt] [Woven] [Trouser] [Marker] [Yield] [Thread] ...   │
├──────────────────────────────────┬─────────────────────────────────────┤
│        Input & Spec Panel        │       Real-Time Audit Panel         │
│  ┌─────────────────────────────┐ │  ┌────────────────────────────────┐ │
│  │ Measurements & Allowances   │ │  │ Hero Result & Output Unit      │ │
│  │ [Input] [Unit Select ▼]     │ │  │ Primary + Secondary Badges     │ │
│  ├─────────────────────────────┤ │  ├────────────────────────────────┤ │
│  │ Fabric Weight & Wastage     │ │  │ Step 1: Input Normalization    │ │
│  │ Order Quantity Context      │ │  ├────────────────────────────────┤ │
│  ├─────────────────────────────┤ │  │ Step 2: Mathematical Equation  │ │
│  │ Target Output Convention    │ │  ├────────────────────────────────┤ │
│  │ [Preset Loader]             │ │  │ Step 3: Net vs Gross Breakdown │ │
│  └─────────────────────────────┘ │  └────────────────────────────────┘ │
├──────────────────────────────────┴─────────────────────────────────────┤
│                    Tech Pack Export Modal / Drawer                     │
│  - Formatted Print / PDF View    - CSV Generation    - JSON Spec       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Textile Mathematical Engine Core                       │
│  - UnitConverters (length, weight, area, GSM, SPI, pack ratios)        │
│  - Calculators (Knit, Woven, Pants, Marker, Yield, Thread, CBM, Cost)  │
│  - Audit Trail Generator (Populated LaTeX-style text equations)        │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data State
Each module maintains isolated, typed input states:
- `TShirtInputState`: Body length, half chest, sleeve length, armhole width, seam/hem allowances, body GSM, wastage %, collar rib length/width/GSM, order qty, target convention.
- `WovenShirtInputState`: Body length, chest width, sleeve length, collar/cuff allowance, cuttable width, fabric GSM, wastage %, order qty, target convention.
- `TrouserInputState`: Outseam, thigh, hip, waistband, pocket length, seam allowance, cuttable width, GSM, wastage %, order qty, target convention.
- `MarkerInputState`: Marker length, marker width, ratio, pattern area, total garments, GSM, end loss, max plies, target convention.
- `FabricYieldInputState`: GSM, cuttable width, target metric (m/kg, yd/kg, yd/lb, GLM, oz/yd).
- `ThreadInputState`: Seam length, SPI/SPC, ISO stitch type, seam thickness, wastage %, order size, cone length, target convention.
- `CartonInputState`: Length, width, height, pack ratio, order garments, carton weight, air freight divisor, target convention.
- `CostingInputState`: Fabric consumption rate & unit, fabric price & currency, trims, CM, embellishments, overhead, profit %, order qty, target convention.

### Step-by-Step Implementation Sequence (Post-Approval)
1. **Engine Core (`src/engine/`)**: Implement `converters.ts`, `types.ts`, `presets.ts`, and `calculators.ts` with complete mathematical verification.
2. **Components (`src/components/`)**:
   - `Header.tsx`: Top bar adhering to the one-row three-zone contract, preset picker, and export triggers.
   - `FieldGroup.tsx`: Strict `[ Input ] [ Unit Select ]` layout with keyboard navigation and error boundaries.
   - `AuditView.tsx`: Step 1 normalization table, Step 2 mathematical equation box, and Step 3 sub-assembly schedule.
   - Dedicated modules for all 8 calculator tabs.
   - `ExportModal.tsx`: Tech Pack print preview, CSV generation, and JSON copy/download.
3. **App Composition & Styling (`src/App.tsx`, `index.html`)**: Connect real-time state, embed Google Fonts (`JetBrains Mono`, `Plus Jakarta Sans`), set metadata, and verify compilation.
