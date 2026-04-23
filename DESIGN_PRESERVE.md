# TechzGreen — Design System Preservation

> Copy this to any new project. All values are exact — no approximations.

---

## Fonts

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
```

- **Headings:** `Outfit` (weights 300–900)
- **Body:** `Nunito` (weights 300–800, italic 400)

---

## Color Palette

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#2e7d32` | Main green, active states, buttons |
| `--color-primary-dark` | `#1b5e20` | Hover states, dark text |
| `--color-primary-light` | `#4caf50` | Subtle highlights |
| `--color-accent` | `#ffb300` | Amber gold, CTAs, badges |
| `--color-accent-dark` | `#e65100` | Accent hover |
| `--color-bg` | `#eef5e9` | Page background |
| `--color-surface` | `rgba(255,255,255,0.75)` | Glass panels |
| `--color-surface-solid` | `#ffffff` | Opaque surfaces |
| `--color-muted` | `#f1f5eb` | Subtle fills |
| `--color-text-heading` | `#1a3d1f` | H1–H6 |
| `--color-text-body` | `#2d4a30` | Body text |
| `--color-text-muted` | `#5f7a60` | Secondary text, labels |
| `--color-border` | `rgba(255,255,255,0.5)` | Glass borders |
| `--color-border-muted` | `rgba(46,125,50,0.15)` | Subtle dividers |

---

## Body Background

Fixed radial gradient layered over `#eef5e9`:

```css
body {
  background-color: #eef5e9;
  background-image:
    radial-gradient(circle at 20% 10%, rgba(76, 175, 80, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 90%, rgba(255, 179, 0, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 40%, rgba(46, 125, 50, 0.06) 0%, transparent 40%);
  background-attachment: fixed;
  min-height: 100dvh;
  overflow-x: hidden;
  font-family: 'Nunito', 'Inter', system-ui, sans-serif;
  color: #2d4a30;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', system-ui, sans-serif;
  color: #1a3d1f;
  letter-spacing: -0.01em;
}

::selection { background-color: rgba(46, 125, 50, 0.25); }
```

---

## Glass Utilities

### `.glass-panel` — primary frosted panel
```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(14px);
-webkit-backdrop-filter: blur(14px);
border: 1px solid rgba(255, 255, 255, 0.55);
box-shadow: 0 4px 24px rgba(46, 125, 50, 0.08), 0 1px 2px rgba(0,0,0,0.04);
border-radius: 1.25rem;
```

### `.glass-panel-dark` — dark green glass (hero sections)
```css
background: rgba(27, 94, 32, 0.88);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(76, 175, 80, 0.3);
box-shadow: 0 8px 32px rgba(27, 94, 32, 0.3);
border-radius: 1.25rem;
```

### `.glass-card` — hoverable product/content card
```css
background: rgba(255, 255, 255, 0.65);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.6);
box-shadow: 0 2px 16px rgba(46, 125, 50, 0.07);
border-radius: 1rem;
transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;

/* hover */
background: rgba(255, 255, 255, 0.85);
box-shadow: 0 8px 32px rgba(46, 125, 50, 0.15);
transform: translateY(-3px);
```

### `.glass-nav` — sticky navbar
```css
background: rgba(255, 255, 255, 0.82);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.6);
box-shadow: 0 4px 24px rgba(46, 125, 50, 0.1), 0 1px 0 rgba(255,255,255,0.8) inset;
```

---

## Buttons

### `.btn-primary` — green CTA
```css
background: linear-gradient(135deg, #2e7d32, #388e3c);
color: #ffffff;
font-family: 'Outfit', system-ui, sans-serif;
font-weight: 700;
padding: 0.625rem 1.5rem;
border-radius: 0.75rem;
box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
transition: all 0.2s ease;

/* hover */
background: linear-gradient(135deg, #1b5e20, #2e7d32);
box-shadow: 0 4px 16px rgba(46, 125, 50, 0.4);
transform: translateY(-1px);
```

### `.btn-accent` — amber CTA
```css
background: linear-gradient(135deg, #ffb300, #ffc107);
color: #1a1a1a;
font-family: 'Outfit', system-ui, sans-serif;
font-weight: 700;
padding: 0.625rem 1.5rem;
border-radius: 0.75rem;
box-shadow: 0 2px 8px rgba(255, 179, 0, 0.35);
transition: all 0.2s ease;

/* hover */
background: linear-gradient(135deg, #e65100, #ffb300);
box-shadow: 0 4px 16px rgba(255, 179, 0, 0.45);
transform: translateY(-1px);
```

**Touch targets** (coarse pointer):
```css
@media (hover: none) and (pointer: coarse) {
  .btn-primary, .btn-accent { padding: 0.75rem 1.5rem; }
}
```

---

## Form Input

### `.input-glass`
```css
width: 100%;
padding: 0.625rem 1rem;
background: rgba(255, 255, 255, 0.8);
border: 1.5px solid rgba(46, 125, 50, 0.2);
border-radius: 0.625rem;
font-family: 'Nunito', system-ui, sans-serif;
font-size: 0.95rem;
color: #1a3d1f;
outline: none;
transition: border-color 0.2s ease, box-shadow 0.2s ease;

/* focus */
border-color: #2e7d32;
box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);

/* mobile (prevent iOS zoom) */
@media (max-width: 639px) { font-size: 1rem; padding: 0.75rem 1rem; }
```

---

## Misc Utilities

### `.section-label` — pill tag above section headings
```css
display: inline-flex;
align-items: center;
gap: 0.5rem;
background: rgba(46, 125, 50, 0.1);
color: #000000;
font-family: 'Outfit', sans-serif;
font-weight: 900;
font-size: 0.9rem;
letter-spacing: 0.05em;
text-transform: uppercase;
padding: 0.5rem 1.2rem;
border-radius: 999px;
border: 1px solid rgba(0, 0, 0, 0.2);
```

### `.points-badge` — amber points pill
```css
background: linear-gradient(135deg, #ffb300, #ffd54f);
color: #1a1a1a;
font-family: 'Outfit', sans-serif;
font-weight: 900;
padding: 0.2rem 0.75rem;
border-radius: 999px;
font-size: 0.85rem;
box-shadow: 0 2px 8px rgba(255, 179, 0, 0.35);
```

### `.stat-box-dark` — stat inside dark panels
```css
background: rgba(0, 0, 0, 0.25);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 1rem;
color: #ffffff;

.stat-num  { color: #fff; font-family: 'Outfit'; font-weight: 900; font-size: 1.75rem; }
.stat-label { color: rgba(200,230,201,0.9); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
```

### `.fade-in` — entry animation
```css
animation: fadeIn 0.4s ease-out;

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Responsive Layout

### `.page-container` — fluid content wrapper
```css
width: 100%;
max-width: 80rem; /* 1280px */
margin: 0 auto;
padding: 0 1rem;                          /* mobile */
@media (min-width: 640px)  { padding: 0 1.5rem; }
@media (min-width: 1024px) { padding: 0 2rem; }
```

### Breakpoints (Tailwind defaults)
| Name | Min width | Usage |
|---|---|---|
| `sm` | 640px | Switch mobile → desktop layout |
| `md` | 768px | Mid adjustments |
| `lg` | 1024px | Full desktop |
| `xl` | 1280px | Wide content |

### Mobile-first patterns used
- `hidden sm:flex` — hide on mobile, show flex on sm+
- `sm:hidden` — show on mobile only (hamburger, bottom nav)
- `flex-col sm:flex-row` — stack → row
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — responsive grids
- `text-sm sm:text-base` — fluid type

### Touch targets
```css
@media (hover: none) and (pointer: coarse) {
  button, a, [role="button"] { min-height: 44px; }
}
```

---

## Navbar Pattern

- **Desktop (sm+):** sticky top pill nav, `glass-nav rounded-2xl`, logo + links + auth CTA
- **Mobile:** hamburger opens right slide-in drawer (`w-[82%] max-w-xs`, `translate-x-full → translate-x-0`)
- **Mobile bottom nav** (logged-in only): `fixed bottom-0 glass-nav mx-3 mb-3 rounded-2xl`
- Active link: `bg-[#2e7d32] text-white`; inactive: `text-[#2d4a30] hover:bg-[rgba(46,125,50,0.1)]`
- Drawer locks body scroll: `document.body.style.overflow = 'hidden'`
- Backdrop: `bg-black/40 backdrop-blur-sm`, closes drawer on click

---

## Stack Reference

| Layer | Library |
|---|---|
| UI framework | React 19 + TypeScript |
| Build | Vite 7 |
| CSS | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Router | React Router v7 |
| Icons | Lucide React |
| Backend | Supabase (auth + DB + storage) |

---

## `@theme` block (Tailwind v4 — paste in `index.css`)

```css
@import "tailwindcss";

@theme {
  --color-primary:       #2e7d32;
  --color-primary-dark:  #1b5e20;
  --color-primary-light: #4caf50;
  --color-accent:        #ffb300;
  --color-accent-dark:   #e65100;

  --color-bg:            #eef5e9;
  --color-surface:       rgba(255, 255, 255, 0.75);
  --color-surface-solid: #ffffff;
  --color-muted:         #f1f5eb;

  --color-text-heading:  #1a3d1f;
  --color-text-body:     #2d4a30;
  --color-text-muted:    #5f7a60;

  --color-border:        rgba(255, 255, 255, 0.5);
  --color-border-muted:  rgba(46, 125, 50, 0.15);
}
```
