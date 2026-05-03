# Spec 02 - Keno Results Layout Redesign & Filter Enhancements

> This spec **overrides** the result row layout and search/filter behavior defined in `spec 01.md` section 2b-2c. All other sections (Header, Footer, Color Scheme, Typography, Mock Data) remain unchanged.

---

## 1. Result Row Layout Redesign

### Goal
Reorganize each result row so the **right side shows only the 20 result numbers** in a compact horizontal line, and all **statistics/badges move to the left info column**.

### New Row Structure (left to right)

```
+------------------------------+--------------------------------------------------+
|   LEFT INFO PANEL            |              RIGHT - RESULT NUMBERS              |
|   (fixed ~190px)             |              (flex-grow 1)                       |
|                              |                                                  |
|  #278001 27/04/2026  14:54 |  01  02  11  13  18  20  22  28  33  34          |
|                              |  35  40  41  44  51  52  53  57  62  78          |
|  [Chan(11)] [Nho(12)]        |                                                  |
+------------------------------+--------------------------------------------------+
```

### Left Info Panel (fixed width ~160px)

Display vertically, top to bottom:

1. **Draw Number**: bold, e.g. `#278001`
2. **Date & Time**: `27/04/2026  14:54` (single line or two lines)
3. **Result Badges** (compact, 1 row, only the winning result for each category):
   - **Even/Odd**: Show only the dominant result with its count. Rules:
     - Even > Odd → show `Chan(N)` (blue `#1967b2`)
     - Odd > Even → show `Le(N)` (light blue `#36b3e5`)
     - Even == Odd → show `Hoa CL` (purple `#98026c`)
     - Where N = the count of the winning side (e.g., `Chan(11)` means 11 even numbers)
   - **Big/Small**: Show only the dominant result with its count. Rules:
     - Big > Small → show `Lon(N)` (orange `#f26531`)
     - Small > Big → show `Nho(N)` (yellow `#faa21e`)
     - Big == Small → show `Hoa LN` (green `#00ad05`)
     - Where N = the count of the winning side (e.g., `Nho(12)` means 12 small numbers)
   - **Do NOT show both sides** — only the single winning badge per category. Two badges total per row (one for even/odd, one for big/small).

### Right Result Numbers Panel (flex-grow 1)

- Display **20 numbers in a horizontal wrap layout** (flex-wrap or grid)
- Ideally 1 row of 20 if viewport allows, or 2 rows of 10
- Each number cell: same styling as spec 01 (30x26px, border `1px solid #90191c`, border-radius 5px, font 18px bold)
- Default: white bg, black text
- Matched/highlighted: bg `#a44900`, white text
- Numbers should be **sorted ascending** in display

### Row Styling (unchanged from spec 01)
- Alternating backgrounds: even = `#ffda8c`, odd = `#FFF`
- Hover: `#b4f2ff`
- Border-radius: 10px

---

## 2. Pagination

- Show **20 results per page** (changed from 15 in spec 01)
- All other pagination behavior unchanged

---

## 3. Search/Filter Enhancements

### 3a. Multi-Draw Search ("Ky" field)

Replace the single draw number input with a multi-value input:

- **Label**: "Ky" (Draw)
- **Behavior**: User can enter multiple draw numbers separated by semicolons `;`
- **Example**: `278001;278005;278010`
- **Validation**: Each value must be a valid draw number (numeric, 6 digits)
- **Placeholder**: `VD: 278001;278002;278003`
- When submitted, filter results to show only the matching draw numbers
- If field is empty or "0", show all draws (no filter)

### 3b. Draw Range Filter (new)

Add a **draw range filter** with two searchable dropdown selectors:

- **Label**: "Tu ky ... den ky" (From draw ... to draw)
- **UI**: Two dropdown/select components side by side:
  - "Tu ky" (From draw) — searchable dropdown
  - "Den ky" (To draw) — searchable dropdown
- **Dropdown options**: Populated from available draw numbers in the dataset, sorted descending (newest first)
- **Searchable**: User can type in the dropdown to quickly filter/search for a specific draw number. Use a combobox/autocomplete pattern:
  - On focus: show full dropdown list
  - On typing: filter list to show only matching draw numbers
  - On select: set the value
  - Allow clearing the selection
- **Behavior**:
  - When both "Tu ky" and "Den ky" are set, filter results to show only draws within that range (inclusive)
  - When only "Tu ky" is set, show all draws from that draw onward
  - When only "Den ky" is set, show all draws up to that draw
  - When neither is set, no range filter applied
- **Validation**: "Tu ky" must be <= "Den ky". If invalid, show inline error or swap values automatically.

### 3c. Updated Search Form Layout

The search form in the section header should now contain:

```
[Ngay: ___________]  [Ky: _______________]  [Bo so: _______________]
[Tu ky: [v]______]   [Den ky: [v]______]    [  XEM  ]
```

- Row 1: Date, Draw numbers (multi), Number set — same as before but with updated Ky behavior
- Row 2: Draw range (from/to dropdowns) + Submit button
- All fields are optional. Filters combine with AND logic.

### 3d. Filter Logic Summary

| Filter | Field | Behavior |
|--------|-------|----------|
| By date | Ngay | Show draws on that date only |
| By specific draws | Ky | Show only listed draw numbers (`;` separated) |
| By draw range | Tu ky / Den ky | Show draws within range (inclusive) |
| By numbers | Bo so | Highlight matching numbers in results (does NOT filter rows) |

- Filters stack: if user sets date + draw range, both apply (AND).
- "Bo so" is a highlight filter, not a row filter — it highlights matching numbers within visible results.

---

## 4. Implementation Notes

- Use a React combobox/autocomplete component for the draw range dropdowns. Options:
  - Build a simple custom component with input + filtered dropdown list
  - Or use a lightweight library like `react-select` or `downshift`
- Mock data should include at least **40 draw results** (to demonstrate pagination with 20/page and range filtering)
- Draw numbers should be sequential (e.g., #278001 to #278040) with realistic timestamps (every ~10 minutes)
