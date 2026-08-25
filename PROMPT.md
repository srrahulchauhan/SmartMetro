# Smart Metro Project - Simple Fresher UI Prompt & Specification

## Objective
Build a clean, functional, and realistic **Smart Metro Ticketing & Route Planner** frontend practice project using React, Tailwind CSS, Lucide Icons, and React Router.

The interface should feel like a real fresher developer's practice project—clean, practical, easy to navigate, and understandable without unnecessary AI over-design.

---

## Design System & Principles

1. **Color Palette**:
   - Background: Light Gray/Slate (`#f8fafc` / `bg-slate-50`)
   - Primary: Metro Blue (`bg-blue-600` or `bg-indigo-600`)
   - Text: Dark Slate (`text-slate-800` / `text-slate-900`)
   - Cards: Pure White (`bg-white` with `border border-slate-200` and `shadow-sm`)

2. **Card Styling**:
   - `rounded-xl` or `rounded-lg`
   - Clean `border border-slate-200`
   - Subtle `shadow-sm`
   - Standard padding (`p-4` or `p-6`)

3. **Navigation Bar**:
   - Logo: 🚇 **Smart Metro**
   - Links: Home | Book Ticket | My Tickets | Metro Card | Routes
   - User Profile / Login trigger on right

4. **Dashboard Layout**:
   - Greeting header ("Good Morning / Welcome Back")
   - Main "Book Your Metro Ticket" card with From / To station dropdowns, Date picker, Passenger selector, and Search button
   - Quick Action buttons (`Book Ticket`, `Metro Card`, `Route Planner`)
   - Next Metro Departure Card (Live platform & timing)
   - Recent Tickets list card

5. **Form Controls**:
   - Clear labeled standard inputs and select boxes
   - Plain blue submit buttons with hover effects

---

## Standard Dashboard Structure

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
[ 🎟 Book Ticket ]  [ 💳 Metro Card ]  [ 🗺 Route ]

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
