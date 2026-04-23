# TechzGreen — Content Structure

> Living document. Add planned content below each section. Update as site evolves.

---

## Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing | Marketing & onboarding |
| `/login` | Login | User auth |
| `/signup` | Signup | New user registration |
| `/shop` | Shop | Browse & add products to cart |
| `/cart` | Cart | Review cart items |
| `/checkout` | Checkout | Multi-step purchase + points redemption |
| `/order-confirmation/:id` | Order Confirmation | Post-purchase success |
| `/dashboard` | User Dashboard | Personal hub — orders, points, actions |
| `/admin` | Admin Dashboard | Full platform management |
| `/admin/login` | Admin Login | Admin-only auth |
| `/rewards` | Rewards | Upload waste photos → earn points |
| `/about` | About | Mission, values, impact |
| `/events` | Events | Browse & register for community events |
| `/stitch-landing` | Stitch Landing | Alternate Material Design landing (design ref) |

---

## Global Components

### Navbar
- Logo
- Nav links: Home, About, Shop, Events, Earn Points, Dashboard
- Cart icon with badge
- Auth state: Login / Logout
- Mobile hamburger menu
- Mobile bottom nav (logged-in users)

### Footer
- Logo
- Social links
- Quick links
- Contact info (address, email, phone)

---

## Page Content

### `/` — Landing

#### Hero
- Headline: "Turn Waste Into Green Rewards"
- Mission statement
- CTAs: Join Movement, Learn More
- Stats: 1,200+ Members · 4.5T Waste Collected · 8,000+ Points Awarded
- Hero image with floating badges (Circular Economy, Earn Points)

#### Banner Carousel
- Admin-managed promotional banners (Supabase `banners` table)

#### How It Works
3-step process cards:
1. Dispose Responsibly
2. Snap & Upload
3. Earn Green Points

#### Upcoming Eco-Events
- 4 upcoming events (live from DB)
- Event cards: image, title, description, date, location
- "View All" link → `/events`

#### Eco-Rewards Catalog
- 3 featured products (live from DB)
- Product cards: image, name, price
- "Shop Now" + "View All" links → `/shop`

#### CTA Banner
- Dark green, leaf icon
- Signup call-to-action

---

### `/login` — Login

- TechzGreen branding + "Welcome Back" heading
- Google OAuth button
- Email/password form
- Error alert
- Link to signup

---

### `/signup` — Signup

- "Join TechzGreen" heading
- Google OAuth button
- Email/password form
- Success/error alerts
- Link to login

---

### `/shop` — Shop

- Header: "Our Eco Products"
- Search bar (filter by name)
- Product grid (3-col desktop, 2-col tablet, 1-col mobile)
  - Card: image (hover zoom), name, description, price, Add to Cart button
  - Out-of-stock overlay when stock ≤ 0
- Empty state

---

### `/cart` — Cart

- Cart items list
  - Per item: image, name, price, quantity controls (− count +), delete
- Cart summary: subtotal, Proceed to Checkout button
- Empty state with link to shop

---

### `/checkout` — Checkout

**Progress bar:** Address → Payment

**Step 1 — Shipping Address**
- Fields: Full Name, Street Address, City, State, ZIP
- Pre-fill from last saved address
- Continue button

**Step 2 — Payment Summary**
- Order summary (itemized, subtotal)
- Points redemption (if user has points):
  - Toggle to enable
  - Slider (0 → max redeemable)
  - Quick buttons: Use 0 / Use Max
  - Discount + conversion rate display
- Total: subtotal − discount
- Demo mode notice
- Back / Confirm Payment buttons

---

### `/order-confirmation/:id` — Order Confirmation

- Success banner (checkmark icon, "Order Confirmed!")
- Order ID + status message
- CTAs: Continue Shopping, Go to Dashboard

---

### `/dashboard` — User Dashboard

- Welcome hero: username, motivational text, Green Points balance
- Quick Actions (2-col grid): Earn Points → `/rewards`, Shop → `/shop`
- My Orders (5 most recent):
  - Collapsible cards: Order ID, status badge, total, 3-step tracking timeline
  - Items with images, quantities, prices
  - Support email link
- Empty state if no orders

---

### `/admin` — Admin Dashboard

**Header stats:** Pending submissions · Products count · Events count

**Tabs:**

| Tab | Content |
|-----|---------|
| Verifications | Pending waste submissions — photo, date, user, approve (1–10 pts) or reject |
| Products | Add product form + products list (image, name, price, stock, delete) |
| Banners | Create banner form + banners list (preview, toggle active, delete) |
| Events | Create event form + events list + registrations panel |
| Orders | All orders — collapsible, shipping controls, expected delivery, admin notes |
| Settings | Points redemption rate: 1 point = ₹X |

---

### `/admin/login` — Admin Login

- Shield icon, "Admin Portal" heading
- Warning: administrators only
- Email/password form
- Error alerts
- Link to user login

---

### `/rewards` — Rewards

**Hero (dark green)**
- "Earn Green Points" heading
- Total Earned + Available Balance stats

**Two-column layout:**
- Left — Upload card: drag-and-drop, file preview, Submit button
- Right — History: submissions list (thumbnail, date, status badge, points awarded)
- Empty state if no history

---

### `/about` — About

#### Hero
- Headline: "TechzGreen's Visionary Journey To A Greener Tomorrow"
- CTA button
- 2×2 image grid with stat badges (32+ Years Experience, 1200+ Community Members)

#### Who We Are
- Heading: "Sustainability Pioneers"
- Mission paragraph + 4-point checklist
- Skill bars: Recycled Products 90% · Circular Economy 93% · Sustainable Transformation 95%

#### Mission & Vision
- Two cards: Our Mission (Recycle icon) · Our Vision (Star icon)

#### Services
2×2 grid:
1. Recycled Products
2. Circular Economy
3. Sustainable Transformation
4. Community Engagement

#### Milestone Banner
- Dark green CTA celebrating eco-revolution

---

### `/events` — Events

- Header: "Eco Events" with dark green banner, description
- Events grid (3-col responsive):
  - Card: poster, date badge, title, description, location, registration count, spots left
  - Status: Register / Already Registered / Full / Log in to Register
- Registration modal: Full Name, Email, Phone
- Empty state if no upcoming events

---

### `/stitch-landing` — Stitch Landing *(design reference only)*

- StitchNavbar
- StitchHero: "Cultivating a Circular Future", stats, reward badge
- StitchRewards: Circular Points System, Elite Steward Tier
- StitchEvents: sample event cards
- StitchImpact: community stats
- StitchFooter

---

## Data Sources (Supabase)

| Table / View | Used by |
|---|---|
| `products` | Shop, Landing catalog |
| `events` | Events, Landing upcoming events |
| `orders` + `order_items` | Checkout, User Dashboard, Admin Orders |
| `user_addresses` | Checkout pre-fill |
| `waste_submissions` | Rewards history, Admin Verifications |
| `points_ledger` + `user_total_points` view | Auth context, Rewards stats, Checkout redemption |
| `banners` | Landing carousel, Admin Banners |
| `event_registrations` | Events registration, Admin Events |
| `profiles` | Auth role (user/admin) |
| `app_settings` | Checkout points rate, Admin Settings |

Storage buckets: `waste-images`, `banners`, `events` (all public)

---

## Auth & Roles

- **Methods:** Email/password + Google OAuth
- **Roles:** `user` (default) · `admin`
- **Role source:** `profiles` table (not JWT)
- **Admin email:** `admin@teczgreen.com` (hardcoded in `AdminDashboard.tsx` + `UserDashboard.tsx`)
- **Guard pattern:** Each page checks `profileRole` internally, redirects if unauthorized

---

## Commerce Flow

```
Shop → Cart → Checkout (address) → Checkout (payment + points) → Order Confirmation → Dashboard
```

- Points earned: waste submission approval
- Points redeemed: checkout slider, capped at `min(totalPoints, floor(totalAmount / pointToRs))`
- Cart: in-memory only (CartContext), cleared after checkout

---

## UI Patterns

| Pattern | Usage |
|---|---|
| Glass card / glassmorphism | Panels, forms |
| Section label badge | Above section headings |
| Status badge | Orders, submissions, events |
| Collapsible card | Orders in dashboard |
| Progress bar | Checkout steps |
| Tracking timeline | Order status (3-step) |
| Drag-and-drop upload | Waste submission |
| Points slider | Checkout redemption |

**Colors:** Primary green `#2e7d32` / dark `#1a3d1f` / light `#4caf50` · Accent amber `#ffb300`

---

## Planned Content

> Add your planned additions below. Format: page, section, content description.

### Z Pallets (Product Page — planned)
> Product-specific, not yet on site. Add as a product detail page or shop listing.

- **Product:** Z Pallet / Z Board — heavy-duty industrial pallets
- **Material:** Recycled plastic / MLP
- **Key claims:** Exceptional strength, durability, high load-bearing capacity
- **Designed for:** Toughest industrial applications, extreme conditions
- **Benefits:** Unmatched reliability and longevity in material handling
- **Suggested placement:** Shop product listing + dedicated product detail page

---

### Z Momento (Product Page — planned)
> Product-specific, not yet on site. Add as a shop product + dedicated landing section.

- **Product:** Z Momento — premium eco-friendly momento / trophy
- **Material:** Recycled plastic + MLP waste
- **Finish:** Elegant and modern with unique textures and patterns
- **Target use:** Corporate events, awards, recognition trophies, corporate gifts
- **Key message:** "More than a trophy. It's a statement. It's sustainability made visible."
- **USPs:**
  - Premium finish with unique textures and patterns
  - 100% eco-friendly and sustainable
  - Transforms MLP — one of today's hardest waste streams — into meaningful objects
- **Suggested placement:** Shop product listing + `/about` section or dedicated `/products/z-momento` page
