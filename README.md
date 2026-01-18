# Daily Lock – Planning App (UX Flow Spec)

## Core Idea

A lightweight planning app built around **locking one day at a time**.

You do **not** plan weeks ahead.
You only:

1. Lock tomorrow every evening
2. Execute tomorrow
3. Review how it went
4. Lock the next day again

Anything new that comes up goes to **Backlog**, not today.

The app exists to:

* Prevent over-committing
* Reduce decision fatigue
* Enforce boundaries
* Make trade-offs visible

---

## Mental Model

**There are only 3 meaningful states:**

* Backlog (everything you could do)
* Locked Day (what you must do tomorrow)
* Review (what actually happened)

No calendars.
No weekly planning.
No priorities beyond what you explicitly lock.

---

## Main Screens

### 1. Home / Today Screen

This is the default screen when the app opens.

**Sections:**

#### A. Today (Locked)

* Shows tasks locked last night
* Read-only by default
* Tasks have:

  * Checkbox (complete / not complete)
  * Optional note (tap to add)

Rules:

* Cannot add new tasks here
* Cannot reorder after day starts

Actions:

* Mark task complete
* Add short reflection note per task

---

#### B. Quick Capture (Floating Action)

A single input field or button:

"Add request / idea"

Behavior:

* Anything added here goes directly to **Backlog**
* Never to Today

Purpose:

* Capture ideas without commitment

---

### 2. Backlog Screen

This is the **pressure release valve**.

**List of all unlocked tasks**

Each item has:

* Checkbox (unchecked by default)
* Optional tags (Client, Personal, Money, Ops, etc.)
* Optional note

Available Actions per item:

* Move to Tomorrow (only during lock ritual)
* Archive / Delete

Important:

* Checking a backlog item does NOT mean done
* It only means "ready / acknowledged"

---

### 3. Evening Lock Screen (Key Screen)

Triggered:

* Manually
* Or automatically after a set time (e.g. 7pm)

This is a **guided ritual**, not a free-form screen.

#### Step 1: Review Today

For each task locked today:

* Completed ✅ / Not completed ⏸
* Optional quick reason if not done

Prompt examples:

* "What got in the way?"
* "Was this realistic?"

---

#### Step 2: Select Tomorrow’s Must-Dos

UI:

* Pick from Backlog
* Limit: e.g. 3–5 tasks max

Visual cue:

* Counter: "3 of 4 slots used"

Rules:

* You must **explicitly choose** tasks
* Drag to order (top = most important)

---

#### Step 3: Lock Tomorrow

Confirmation screen:

"Tomorrow is locked. Any new requests will go to Backlog."

Action:

* Lock Day
* Exit

Once locked:

* Tomorrow tasks become immutable

---

### 4. Review History (Optional / Later)

Simple timeline:

* Date
* % completed
* Notes

Purpose:

* Spot patterns of overcommitment
* Not productivity porn

---

## Key UX Principles (for Designer)

1. **Friction is intentional**

   * Locking should feel deliberate

2. **No guilt UI**

   * Missed tasks are data, not failure

3. **Minimal visual noise**

   * No charts on main screens

4. **One primary action per screen**

   * Today: Execute
   * Backlog: Capture
   * Evening: Decide

---

## Example: Your Current Use Case

### Locked for Tomorrow:

* Build website for client and test CMS
* Ask Client B to test system from new updates
* Finalize invoice app (if time permits)

### Backlog:

* Share team selection with content creator
* Share website with client + request feedback
* Request final payment of 15k and close project

---

## What This App Is NOT

* Not a task manager
* Not a calendar
* Not a goal tracker
* Not a productivity optimizer

It is a **commitment filter**.

---

## Optional Future Features (Not MVP)

* Daily lock streak (soft)
* Hard cap on revenue vs non-revenue tasks
* Client-based grouping
* Export daily logs

---

## One-Line Positioning

"Plan one day. Lock it. Everything else can wait."
