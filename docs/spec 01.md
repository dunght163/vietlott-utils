# Vietlott Keno Results Web Application - Requirements

## Overview

Build a React.js web application for looking up Vietlott Keno lottery results. The UI layout and structure should replicate the reference site saved in `minhchinh.com/` directory. This is a single-page application with a fixed-width centered layout (990px).

---

## Tech Stack

- **Framework**: React.js (Create React App or Vite)
- **Styling**: CSS (replicate the original color scheme and layout)
- **Icons**: Font Awesome 5
- **No backend required initially** - use mock/static data for Keno results

---

## Page Layout (top to bottom)

The page uses a fixed-width (990px), centered, single-column layout.

### 1. Header

Replicate the original header exactly with 3 sections:

#### 1a. Top Bar (`#topheader`)
- Background: `#F9F9F9`, text color `#333`, line-height 25px
- Horizontal list of links (no real href needed, use `#`):
  - "minhchinhlottery.com"
  - "doisotrung.com.vn"
  - "xosocao.net"
  - Right-aligned: "Thay doi thong tin ve do tai day"

#### 1b. Main Header (`#header`)
- Height: ~100px
- **Left**: Logo image (use `minhchinh.com/.../logo_mc.png`), width 400px, links to `/`
- **Right**: Two rows of quick-access buttons:
  - Row 1: `XSMN` | `XSMT` | `XSMB` | `XSDT` | `TIN TUC`
  - Row 2: `MEGA` | `POWER` | `3DPRO` | `LOTTO` | `KENO` (highlighted yellow `#FF0`)
- **Ticket checker form** ("Do Ve So"): date input, province dropdown, number input (maxlength 6), submit button. Non-functional placeholder.

#### 1c. Navigation Bar (`#navbar3`)
- Horizontal mega-menu with dropdown submenus
- Background uses gradient/image pattern
- Menu items (left to right), each with Font Awesome icon:

| # | Label | Icon | Dropdown Items |
|---|-------|------|----------------|
| 1 | Truc Tiep | `fa-video` | Mien Nam, Mien Trung, Mien Bac, Mega 6/45, Power 6/55, Max3D Pro, Max 3D, Keno, Bingo 18, Lotto 5/35 |
| 2 | Truyen Thong | `fa-star` | 3 sub-groups (Mien Nam/Trung/Bac) each with day-of-week items; KQXS Cac Tinh with all provinces |
| 3 | KQXS Vietlott | `fa-bolt` | Lotto 5/35, Mega 6/45, Power 6/55, Max3D Pro, Max 3D, Keno, Bingo 18 |
| 4 | Dien Toan | `fa-bolt` | Same as Vietlott + 1*2*3, 6x36, Than Tai 4 |
| 5 | So Dau Duoi | `fa-chart-line` | Mien Nam, Mien Trung, Mien Bac (each with day sub-menus) |
| 6 | Thong Ke | `fa-chart-bar` | Thong Ke Lo, Lo Gan, Giai Dac Biet, Kiem Tra Gan Cuc Dai, Tan Suat, Tan Suat Chi Tiet, Lotto 5/35, Mega 6/45, Power 6/55, Max 3D, Max3D Pro |
| 7 | In Ve Do | `fa-print` | Mien Nam, Mien Trung, Mien Bac, Lotto 5/35, Mega 6/45, Power 6/55, Max3D Pro, Max 3D |
| 8 | Do ket qua | `fa-search` | Truyen thong, Mega 6/45, Lotto 5/35, Power 6/65, Max 3D, Max3D Pro, Keno |
| 9 | Tin Tuc | `fa-chart-area` | Thong ke XSMN, Thong ke XSMT, Thong ke XSMB, Tin tuc tong hop |
| 10 | KENO | `fa-cog` | **Truc Tiep Xo So KENO**, **Ket qua Xo So KENO** (this one is active/functional) |

- All menu items are non-functional placeholders except: **KENO > Ket qua Xo So KENO** which navigates to the Keno results page.
- Dropdowns appear on hover with smooth transition.

---

### 2. Main Content - Keno Results Page

This is the primary functional page. Wrapped in a container with class `KQKeno`.

#### 2a. Section Header
- Background: `#fff7d5` (light yellow)
- Flexbox layout, vertically centered, space-between
- **Left**: Keno icon image + `<h1>` "KET QUA KENO" (font-size 30px, color `#a44900`, bold)
- **Right**: Search/filter form with:
  - **Ngay** (Date): date input with datepicker, default = today, format `dd-mm-yyyy`
  - **Ky** (Draw period): text input, default "0" (meaning all)
  - **Bo so** (Number set): text input, placeholder "VD: 04,12,23,35 ..."
  - **XEM** (View) button: background `#ffbf39`, border `#a44900`, border-radius 5px

#### 2b. Results Table
- Container background: `#a44900` (dark brown/orange), padding 5px 10px

**Column Headers** (flex row, 3 columns):
- "Ky xo" (Draw #): width 80px, white bg, border `2px solid #a44900`, border-radius 10px
- "Thoi gian" (Time): width 80px, same style
- "Ket qua" (Results): flex-grow 1, same style

**Result Rows** (each draw is a flex row):
- Alternating backgrounds: even = `#ffda8c`, odd = `#FFF`
- Hover: `#b4f2ff` (light cyan)
- Border-radius: 10px

Each row contains 4 sections:

1. **Draw Number** (width 80px, centered, bold)
   - Format: "#279001"
   - Below: small icon badges showing:
     - Even/Odd indicator (Chan = blue `#1967b2` / Le = light blue `#36b3e5`)
     - Big/Small indicator (Lon = orange `#f26531` / Be = yellow `#faa21e` / Hoa LB = green `#00ad05` / Hoa CL = purple `#98026c`)

2. **Time** (width 80px, centered, bold)
   - Line 1: date "27/04/2026"
   - Line 2: time "11:52"

3. **Result Numbers** (flex row, space-around, flex-grow 1)
   - **20 number cells** per draw
   - Each cell: 30px wide, 26px tall, border `1px solid #90191c`, border-radius 5px, font 18px bold
   - Default: white bg, black text
   - Matched/active: background `#a44900`, white text

4. **Statistics Badges** (2 rows, hidden on small screens)
   - Row 1 (Big/Small): "Lon (N)" | "Hoa LN" | "Nho (N)" - 3 items
   - Row 2 (Even/Odd): "Chan (N)" | "C 11-12" | "Hoa CL" | "L 11-12" | "Le (N)" - 5 items
   - Each badge: flex 1, border-radius 5px, bg `#e6e6e6`, font 12px bold
   - Active badges use colored classes:
     - Chan (Even): `#1967b2`
     - Le (Odd): `#36b3e5`
     - Lon (Big): `#f26531`
     - Be (Small): `#faa21e`
     - Hoa CL: `#98026c`
     - Hoa LB: `#00ad05`

#### 2c. Pagination
- `<ul>` with page number links
- Active page: white background
- Inactive: `#ffda8c` background
- Include ">>" forward navigation
- Show ~15 results per page

---

### 3. Footer (Custom - Replace Original)

**Do NOT replicate the original footer** (it belongs to minhchinh.com). Instead, create a simple placeholder footer:

- Background: `#333` (dark gray)
- Text color: `#fff`
- Padding: 20px
- Centered text
- Content:
  - "Vietlott Keno Results - Tra cuu ket qua xo so Keno"
  - "Day la cong cu ho tro tra cuu ket qua. Khong lien ket voi bat ky to chuc xo so nao."
  - "(c) 2026 Vietlott Utils. All rights reserved."

---

## Mock Data

Since there is no backend yet, provide mock/static data for the Keno results:

- Generate at least 15 sample draw results
- Each draw has: draw ID (6-digit number prefixed with #), date, time, 20 random numbers (1-80)
- Calculate statistics for each draw:
  - Count even/odd numbers among the 20 results
  - Count big (41-80) / small (1-40) numbers
  - Determine badges: if even > odd = "Chan", if odd > even = "Le", if equal = "Hoa CL"
  - Determine badges: if big > small = "Lon", if small > big = "Be", if equal = "Hoa LB"

---

## Color Scheme Summary

| Element | Color |
|---------|-------|
| Keno header text | `#a44900` |
| Keno container bg | `#a44900` |
| Section header bg | `#fff7d5` |
| Button bg | `#ffbf39` |
| Even result row | `#ffda8c` |
| Odd result row | `#FFFFFF` |
| Row hover | `#b4f2ff` |
| Number cell border | `#90191c` |
| Active number bg | `#a44900` |
| Chan (Even) badge | `#1967b2` |
| Le (Odd) badge | `#36b3e5` |
| Lon (Big) badge | `#f26531` |
| Be (Small) badge | `#faa21e` |
| Hoa CL badge | `#98026c` |
| Hoa LB badge | `#00ad05` |
| Footer bg | `#333333` |
| Top bar bg | `#F9F9F9` |
| Footer original bg | `#df8725` |

---

## Typography

- Body: `12px/1.5 Arial, Helvetica, sans-serif`
- Keno title: `30px bold`
- Result numbers: `18px bold`
- Stat badges: `12px bold`

---

## Key Behaviors

1. **Search/Filter**: The search form filters results by date, draw number, or number set. For now, implement client-side filtering on mock data.
2. **Pagination**: Client-side pagination, 15 results per page.
3. **Number Matching**: When user enters numbers in "Bo so" field, matching numbers in results should be highlighted (`.active` class - brown bg, white text).
4. **Hover Effects**: Result rows change background on hover.
5. **Menu Dropdowns**: Navigation menu items show dropdowns on hover.

---

## File Structure (Suggested)

```
src/
  components/
    Header/
      TopBar.jsx
      MainHeader.jsx
      NavBar.jsx
    KenResults/
      KenoResults.jsx
      SearchForm.jsx
      ResultRow.jsx
      Pagination.jsx
      StatBadges.jsx
    Footer/
      Footer.jsx
  data/
    mockKenoData.js
    menuData.js
  styles/
    global.css
    header.css
    navbar.css
    keno.css
    footer.css
  App.jsx
  index.js
```

---

## Out of Scope (Phase 1)

- Backend API / real data fetching
- Other lottery types (Mega, Power, Max3D, etc.)
- Responsive/mobile layout
- Ticket checking functionality ("Do Ve So")
- Live streaming ("Truc Tiep")
- Statistics pages
- Print functionality
- User authentication
