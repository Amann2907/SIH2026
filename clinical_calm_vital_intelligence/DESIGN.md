---
name: Clinical Calm & Vital Intelligence
colors:
  surface: '#ebfdfa'
  surface-dim: '#cbdedb'
  surface-bright: '#ebfdfa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e5f7f5'
  surface-container: '#dff2ef'
  surface-container-high: '#daece9'
  surface-container-highest: '#d4e6e4'
  on-surface: '#0e1e1d'
  on-surface-variant: '#3d4946'
  inverse-surface: '#233332'
  inverse-on-surface: '#e2f5f2'
  outline: '#6d7a77'
  outline-variant: '#bcc9c5'
  surface-tint: '#006b5f'
  primary: '#00685d'
  on-primary: '#ffffff'
  primary-container: '#008376'
  on-primary-container: '#f4fffb'
  inverse-primary: '#70d8c8'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#006b2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873a'
  on-tertiary-container: '#f7fff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8df5e4'
  primary-fixed-dim: '#70d8c8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#ebfdfa'
  on-background: '#0e1e1d'
  surface-variant: '#d4e6e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-xl:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  kiosk-touch-prompt:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  kiosk-margin: 2rem
  kiosk-gutter: 1.5rem
  mobile-margin: 1rem
  desktop-gutter: 1.5rem
---

## Brand & Style

The design system establishes a restorative, dignified, and exceptionally legible digital environment built specifically for high-stress, multilingual healthcare contexts. Designed to bridge the digital intake divide across physical hospital kiosks, shared tablets, and patient-facing portals in Indian clinical settings, the aesthetic merges institutional precision with human warmth.

### Emotional Landscape
- **Sovereign Reassurance:** Mitigates the ambient anxiety of medical triage through soft, clinical teal tones, disciplined negative space, and unambiguous visual cues.
- **Uncompromising Clarity:** Accommodates low-literacy individuals, non-native language readers, and elderly patients facing physical or visual impairments.
- **Clinical Integrity:** Forgoes hyperactive conversational chatbot tropes, neon gradients, and dense enterprise dashboards in favor of structured intake cards, explicit audio-visual feedback, and authoritative medical taxonomy.

### Aesthetic Methodology
The aesthetic unites **Modern Clinical Minimalism** with **Tactile Kiosk-Ready Affordance**. Surfaces rely on crisp alabaster-mint backdrops layered with soft surface-container tiers. Interactive zones are generously scaled with substantial target dimensions (minimum 56px height for touch inputs), high-contrast outlines, and purposeful physical depth that confirms tactile engagement instantly.

## Colors

The color palette is calibrated for AAA accessibility compliance under high-glare ambient hospital illumination and low-cost TN panel kiosks. The core signature relies on a dual-register clinical teal anchored against bright, hygienic white bases.

### Primary Spectrum (Clinical Vitality & Navigation)
- **Primary Teal (`#00897B`):** Active interactive focal points, primary action buttons, key intake progress markers, and primary card highlights.
- **Deep Emerald Shade (`#004D40`):** High-contrast text on light teal surfaces, primary pressed states, header typography, and institutional signifiers.
- **Teal Tint Base (`#E6F4F2`):** Soft focus fills, active chip backgrounds, and highlighted patient transcript banners.

### Secondary Spectrum (Digital Intelligence & Information Guidance)
- **Clinical Sky (`#0284C7`):** AI extraction confidence tags, translation mode selectors, document scan progress states, and metadata links.
- **Sky Wash (`#E0F2FE`):** AI-parsed document highlight containers and auxiliary contextual banners.

### Functional Status Tokens
- **Verified / Stable (`#16A34A` / Wash: `#DCFCE7`):** Validated medical identifiers, authenticated Aadhaar/ABHA statuses, and verified dosage histories.
- **Attention / Pending Review (`#D97706` / Wash: `#FEF3C7`):** Discrepancies between patient narrative and uploaded scans, allergy confirmations, and voice transcript confidence checks.
- **Priority Emergency / Contraindication (`#DC2626` / Wash: `#FEE2E2`):** Critical clinical contraindications, acute emergency triages, and required omissions.

### Neutral & Surface Hierarchy
- **Canvas Base (`#FAFCFB`):** Calming, off-white background with a minute green-spectrum undertone to soften eye fatigue under hospital fluorescent lamps.
- **Surface Elevation 01 (`#FFFFFF`):** Base card surfaces, intake modal dialogs, and text entry fields.
- **Surface Elevation 02 (`#F0F4F4`):** Segmented controls, document preview backplates, and inactive container frames.
- **Border Subtle (`#E2E8F0`):** Crisp, low-noise dividers separating structured clinical metrics.
- **Text Primary (`#111918`):** High-contrast, near-black ink for maximum legibility.
- **Text Secondary (`#5A6B69`):** Subdued clinical metadata, date stamps, and auxiliary descriptions maintaining a 4.8:1 contrast ratio against white.

## Typography

The typographic hierarchy pairs **Plus Jakarta Sans** for display, titles, and kiosk touch prompts with **Inter** for clinical records, medical narratives, and localized Indian language glyphs.

### Font Pairing Strategy
- **Plus Jakarta Sans:** Selected for its open apertures, rounded terminals, and warm, reassuring structure. It provides clear visual anchors during triage flow transitions and large-scale kiosk prompts.
- **Inter:** Functions as the operational engine for complex medical terminology, prescription details, and multilingual character rendering. Its tall x-height ensures immediate decipherability of numbers, decimal points, and vital signs under distance viewing.

### Multilingual & Accessibility Guidelines
- Multilingual scripts (Hindi, Tamil, Telugu, Bengali, Marathi, etc.) utilize native system fonts falling back cleanly with matched x-height normalization to avoid line-clipping.
- Body text never drops below 14px on handheld devices and 16px on stationary touchscreen kiosks.
- Vital signs and medication dosages (e.g., `500 mg`, `120/80 mmHg`) employ tabular numerals for precise column scanning.

## Layout & Spacing

The layout is built upon an 8-point spatial cadence, structured across three primary responsive environments: Kiosk/Tablet Landscape, Mobile Patient Intake, and Desktop Clinician Overview.

### Form Factor Adaptations
- **Kiosk & Shared Tablet (Touch-First Mode, 1024px to 1366px):** 
  - Employs a centered 8-column layout capped at 1120px max-width to keep touch affordances within the natural ergonomic sweep of a standing patient's arm.
  - Interactive targets reserve a minimum hit box of 56px × 56px with a minimum 16px clearance buffer between selectable cards.
- **Mobile Intake View (< 768px):** 
  - Standard 4-column fluid layout with 16px (`space-md`) outer margins.
  - Sticky bottom action zones (e.g., "Speak Symptoms", "Confirm Upload") pinned with safe-area padding to permit single-thumb execution.
- **Desktop Clinician Review (≥ 1280px):** 
  - Asymmetric 12-column grid: 4 columns dedicated to raw input artifacts (scanned physical prescription and live speech-to-text transcript), 8 columns allocated to the AI-extracted structured clinical entity card deck.

### Spatial Rhythm
Padding within patient assessment cards follows generous internal breathing room: `space-xl` (32px) for desktop/kiosks and `space-lg` (24px) for mobile screens, establishing quiet visual fields that prevent cognitive overload during acute medical registration.

## Elevation & Depth

This design system deliberately departs from heavy drop shadows and murky skeuomorphism in favor of **Tonal Layering complemented by Crisp Contact Elevation**. In brightly illuminated, sterile environments, heavy drop shadows read as screen glare or dirt; crisp, low-opacity tinted boundaries preserve clinical trust.

### Surface Elevation Levels
- **Level 0 (Floor):** `#FAFCFB` — Base viewport background.
- **Level 1 (Clinical Cards & Records):** `#FFFFFF` bordered with `1px solid #E2E8F0`. Shadow: `0 1px 3px rgba(0, 77, 64, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)`.
- **Level 2 (Interactive Modules & Hover/Active Cards):** `#FFFFFF` bordered with `1.5px solid #00897B`. Shadow: `0 4px 12px rgba(0, 137, 123, 0.08), 0 2px 4px rgba(0, 0, 0, 0.03)`.
- **Level 3 (Modals, Voice Listening Overlay & Vital Alerts):** `#FFFFFF` resting over a calming 40% opacity teal-tinted backdrop scrim (`rgba(0, 40, 35, 0.45)` with 4px Gaussian blur). Shadow: `0 12px 32px rgba(0, 45, 38, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04)`.

### Depth Cues for Low-Literacy Usability
Active touch states use an immediate 1px downward shift paired with an internal ring highlight (`0 0 0 3px rgba(0, 137, 123, 0.20)`) to supply instant tactile and visual validation when screen haptics are unavailable.

## Shapes

The design system incorporates **Rounded Level 2** geometry, calibrated to achieve an approachable, protective feel while preserving architectural clinical order. 

### Geometric Rules
- **Intake & Clinical Summary Cards:** Base curvature is `rounded-2xl` (16px / 1rem on mobile; 24px / 1.5rem on kiosk displays), creating a soft visual perimeter that reduces interface aggression.
- **Interactive Controls (Buttons, Inputs, Multi-selects):** Built using `rounded-xl` (12px / 0.75rem) to preserve clear rectangular button signifiers that elderly users do not mistake for non-clickable decorative badges.
- **Status Pills, Language Selectors, and Audio Chips:** Fully pill-shaped (`rounded-full` / 9999px) for discrete self-contained micro-information units.
- **Document Previews & Radiograph Bounding Boxes:** Tight `rounded-lg` (8px / 0.5rem) with continuous crisp 1px borders to prevent clipping the sharp edges of scanned medical records.

## Components

### Buttons & Touch Triggers
- **Primary Clinical Action:** Background `#00897B`, text `#FFFFFF`, minimum height `56px` on kiosks (48px on mobile), `rounded-xl`, bold font weight. Hover/focus: `#004D40`. Accompanied by distinct SVG iconography (e.g., microphone wave, upload arrow) aligned to the left of the text label.
- **Secondary Guidance Action:** Background `#E6F4F2`, text `#004D40`, border `1px solid rgba(0, 137, 123, 0.2)`.
- **Emergency / Priority Action:** Background `#DC2626`, text `#FFFFFF`. Used strictly for acute triage diversion and critical allergy warnings.
- **Audio Assist Trigger:** Always floating or anchored prominently in the top right of each intake card; pill-shaped with a pulsating audio speaker icon, signaling instant read-aloud functionality in the selected language.

### Cards (The Core Intake Primitive)
- Styled as `rounded-2xl` surfaces on pure `#FFFFFF` with `#E2E8F0` borders.
- **Parsed Data Field Cards:** Feature a divided structural layout: top band indicates field category (e.g., "Presenting Complaints", "Known Chronic Conditions") with a small verified checkmark icon (`#16A34A`), middle band displays extracted plain language, and bottom bar indicates original voice/text source with an option to edit or listen.

### Language & Script Selector Chips
- Pill-shaped (`rounded-full`), height `44px` to ensure effortless touch access.
- Dual-script display format: Native script prominently featured alongside English transliteration (e.g., `हिन्दी / Hindi`, `தமிழ் / Tamil`, `বাংলা / Bengali`).
- Unselected: `#F0F4F4` background, `#111918` text. Selected: `#00897B` background, `#FFFFFF` text with a 2px active teal ring offset.

### Input Fields & Multi-modal Voice Capture
- Minimum height `56px`, padded with `space-md` (16px) horizontally.
- Visual state: `#FFFFFF` fill with an inset `1.5px solid #E2E8F0` border. Active focus brings a 2px ring in `#00897B`.
- Integrated Voice Intake State: When voice capture is active, the input container expands dynamically with a calm, rhythmically undulating teal soundwave bar and localized instructional prompt ("Listening... Speak clearly in your language").

### Checkboxes, Radios, and Symptom Tiles
- Replaces microscopic traditional checkboxes with large **Symptom Select Tiles** (minimum height 72px, full card width on mobile).
- Includes an anatomical or contextual icon, clear bold title, and high-visibility radio circle (24px diameter with a solid 12px inner bullet when active).

### AI Document Extraction & Confidence Tags
- **Confidence Rating Badge:** Pill badge showing extraction source reliability.
  - High Confidence: `#DCFCE7` background, `#16A34A` text ("Extracted from Prescription").
  - Verification Required: `#FEF3C7` background, `#D97706` text ("Doctor Clarification Needed").
- Side-by-side verification view displays the digitized original scan alongside structured editable intake slots.