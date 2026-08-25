# Metro Ticketing Project - Guidelines & Rules

## Fresher Developer UI Style — Important

Design the entire Metro Ticketing project like a **real fresher's frontend practice project** built while learning React and Tailwind CSS.

The project should look **clean, simple, practical and understandable**, but NOT overly polished or artificially perfect.

The goal is to demonstrate frontend development skills, not to make the project look like a commercial production product.

### Simple UI Rules

1. **White background + Blue primary color**
   * Background: `#f8fafc` (slate-50)
   * Primary: Blue (`bg-blue-600` / `indigo-600`)
   * Text: Dark gray (`text-slate-800`)
   * Cards: White (`bg-white`)

2. **Unified Card Style**
   * Use `rounded-lg` or `rounded-xl`
   * Use clean `border border-slate-200`
   * Light `shadow-sm`
   * Avoid excessive glassmorphism and heavy gradients.

3. **Simple Navigation Bar**
   ```text
   🚇 Smart Metro
   Home | Book Ticket | My Tickets | Metro Card | Routes | Profile
   ```

4. **Clean Dashboard Structure**
   * **Top**: Welcome Message + Book Your Metro Ticket Form (From / To / Date / Passengers / Search)
   * **Middle**: Quick Actions (`[ 🎟 Book Ticket ]`, `[ 💳 Metro Card ]`, `[ 🗺 Route ]`)
   * **Bottom**: Next Metro Arrival Card + Recent Tickets List

5. **Simple Icons (`lucide-react`)**
   * Train, Ticket, MapPin, CreditCard, User, Bell, Search, Clock, ArrowRight

6. **Minimal Animations**
   * Standard button hover states
   * Modal opening transitions
   * Simple page transitions
   * Success checkmarks
   * Do NOT animate every card or background excessively.

7. **Limited & Relevant Images**
   * Hero metro header
   * Virtual metro card
   * Empty state illustrations

8. **Simple Forms**
   * Use normal bordered `<select>` and `<input>` elements for From/To station selection.

---

### Dashboard Wireframe Layout

```text
------------------------------------------------
Smart Metro
Home  Book Ticket  My Tickets  Card  Routes  👤
------------------------------------------------

Good Morning, Rahul

Book Your Metro Ticket
┌──────────────────────────────────────────────┐
│ From              ⇄        To                │
│ Electronic City           Sector 16          │
│                                              │
│ Date        Passengers                       │
│ Today       1                               │
│                                              │
│              [ Search Metro ]                │
└──────────────────────────────────────────────┘

Quick Actions

[ 🎟 Book Ticket ] [ 💳 Metro Card ] [ 🗺 Route ]

Next Metro
┌──────────────────────────────────────────────┐
│ Electronic City → Sector 16                  │
│ Next Train: 5 min       Platform: 2          │
└──────────────────────────────────────────────┘

Recent Tickets
┌──────────────────────────────────────────────┐
│ Electronic City → Sector 16                  │
│ Today • ₹40                    View Ticket   │
└──────────────────────────────────────────────┘
```

---

# Color System

Primary Palette:
* Metro Blue / Indigo
* Dark Slate / Gray
* White / Light Gray (`#f8fafc`)
* Green for success
* Red for errors
* Amber/Orange for alerts

Keep most pages white/light slate with blue accents.

---

# Typography

Font: Inter / System UI
* Clear headings (`h1`: `text-2xl font-bold`)
* Normal body sizes (`text-sm`, `text-base`)
* Standard button text
