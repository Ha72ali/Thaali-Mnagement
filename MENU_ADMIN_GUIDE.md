# 📋 Menu Management - Admin Guide

## Overview
The Menu Management system allows administrators to create and manage daily menus with multiple food items for specific dates in the Thaali Management system.

---

## 🎯 Quick Start

### Accessing the Menu Management Page
1. Navigate to **Menu** in the main navigation
2. You'll see the "Daily menu" section

### Create a New Menu

#### Step 1: Select a Date
- Click on the **"Menu date"** date picker
- Choose the date for which you want to create the menu
- Example: Select April 20, 2026

#### Step 2: Add Food Items
In the **"Items"** textarea, add your dishes using one of these formats:

**Option A: Comma-separated** (Most common)
```
Dal, Rice, Sabzi, Roti, Sweet
```

**Option B: Bullet points**
```
• Chana Masala
• Basmati Rice  
• Cucumber Raita
• Wheat Roti
• Kheer
```

**Option C: Line by line**
```
Paneer Tikka
Mint Rice
Mixed Vegetable Raita
Naan
Mango Lassi
```

#### Step 3: Save the Menu
- Click **"Create menu"** button (or **"Update menu"** if menu exists)
- Wait for confirmation
- Watch the preview section show your items as tags

---

## 📊 API Reference

### Endpoints

#### GET /api/menus?date=YYYY-MM-DD
Retrieve a specific day's menu.

**Example Request:**
```bash
curl "http://localhost:3000/api/menus?date=2026-04-14"
```

**Example Response:**
```json
{
  "id": "cmnx34s7s0000zhkofavntkrz",
  "date": "2026-04-14",
  "items": "[\"Dal Fry\",\"Jeera Rice\",\"Beetroot Salad\",\"Paratha\",\"Gulab Jamun\"]",
  "createdAt": "2026-04-13T11:04:09.688Z"
}
```

#### GET /api/menus
List all menus (latest 60 days, sorted by date descending).

**Example Response:**
```json
[
  {
    "id": "menu_id_1",
    "date": "2026-04-15",
    "items": "[\"Paneer Tikka\",\"Mint Rice\",\"Mixed Vegetable Raita\",\"Naan\",\"Mango Lassi\"]",
    "createdAt": "2026-04-13T11:04:32.323Z"
  },
  {
    "id": "menu_id_2",
    "date": "2026-04-14",
    "items": "[\"Dal Fry\",\"Jeera Rice\",\"Beetroot Salad\",\"Paratha\",\"Gulab Jamun\"]",
    "createdAt": "2026-04-13T11:04:09.688Z"
  }
]
```

#### POST /api/menus
Create or update a menu (upsert).

**Request Body:**
```json
{
  "date": "2026-04-14",
  "items": ["Dal", "Rice", "Sabzi", "Roti", "Sweet"]
}
```

**Response:**
```json
{
  "id": "cmnx34s7s0000zhkofavntkrz",
  "date": "2026-04-14",
  "items": "[\"Dal\",\"Rice\",\"Sabzi\",\"Roti\",\"Sweet\"]",
  "createdAt": "2026-04-13T11:04:09.688Z"
}
```

---

## ✅ Features

- ✅ **Date Selection** - Pick any date for menu planning
- ✅ **Multiple Input Formats** - Use commas, bullets, or new lines
- ✅ **Live Preview** - See parsed items instantly as tags
- ✅ **Upsert Pattern** - Create new or update existing menus seamlessly
- ✅ **Validation** - Error messages for empty items or invalid dates
- ✅ **Dark Mode Support** - Full dark mode compatibility
- ✅ **Responsive Design** - Works on desktop and tablet
- ✅ **Real-time Updates** - Reload button to fetch latest state

---

## 🔍 Use Cases

### Scenario 1: Plan Weekly Menu
```
Monday, April 14:    Dal, Rice, Sabzi, Roti, Sweet
Tuesday, April 15:   Paneer Tikka, Mint Rice, Raita, Naan, Lassi
Wednesday, April 16: Cholan Bhature, Chutney, Pickle, Lassi
Thursday, April 17:  Rajma Rice, Salad, Roti, Pappad
Friday, April 18:    Biryani, Raita, Shorba, Dessert
```

### Scenario 2: Seasonal Menu Planning
Plan seasonal dishes for a specific date and update as seasons change.

### Scenario 3: Festival Special Menus
Create special menus for festivals or events on specific dates.

---

## 🐛 Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "items must be a non-empty array of strings" | No items entered | Add at least one dish name |
| "date (YYYY-MM-DD) required" | Invalid date format | Use YYYY-MM-DD format (e.g., 2026-04-14) |
| "At least one menu item name required" | Only whitespace/empty items | Enter valid dish names, not just spaces |

---

## 📝 Database Schema

```typescript
model Menu {
  id        String   @id @default(cuid())
  date      String   @unique     // Format: YYYY-MM-DD
  items     String               // JSON array string: "[\"Dal\",\"Rice\"]"
  createdAt DateTime @default(now())
}
```

**Key Points:**
- `date` is unique - only one menu per date
- `items` is stored as JSON string for flexibility
- Automatically timestamps when created
- Uses CUID for globally unique IDs

---

## 🚀 Technical Details

### Frontend Stack
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React hooks (useState, useEffect, useCallback)

### Backend Stack
- **Framework:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Validation:** Regex patterns for date format

### Data Flow
1. User selects date in date picker
2. API fetches menu for that date (GET /api/menus?date=...)
3. Items are fetched and parsed from JSON
4. User edits items in textarea
5. On save, items are split by delimiters (comma, bullet, newline)
6. API creates or updates menu (POST /api/menus)
7. Response updates local state and UI

---

## 🔐 Security Considerations

- Date format is strictly validated (YYYY-MM-DD)
- Items are sanitized (trimmed and filtered)
- Empty strings are automatically removed
- All inputs are processed server-side
- SQLite provides ACID compliance

---

## 📊 Example Workflows

### Workflow 1: Create Menu for Tomorrow
```
1. Click date picker → Select tomorrow's date
2. Enter items → "Chana Masala, Rice, Raita, Roti, Kheer"
3. Click "Create menu" button
4. Confirm items appear in preview
5. ✅ Menu saved to database
```

### Workflow 2: Update Existing Menu
```
1. Click date picker → Select existing date
2. Items auto-load from database
3. Modify items as needed
4. Click "Update menu" button (button label changes)
5. ✅ Menu updated in database
```

### Workflow 3: Review Multiple Menus
```
1. Click "Reload" button for current date
2. Change date to review other menus
3. Each date shows its unique menu
4. ✅ Compare different day's menus
```

---

## ⚙️ Configuration

### Date Format
- **Format:** YYYY-MM-DD (ISO 8601)
- **Validation:** Must match `/^\d{4}-\d{2}-\d{2}$/`
- **Example:** 2026-04-14 (April 14, 2026)

### Item Separators
- Comma: `,`
- Bullet: `•`
- New line: `\n`

### API Limits
- Maximum items returned per list: 60 menus
- Items per menu: No hard limit (practical: 5-15 dishes)

---

## 🎨 UI Components

### Date Picker
- HTML5 native date input
- Returns YYYY-MM-DD format
- Keyboard navigable

### Textarea
- 4 rows by default
- Monospace font for formatting clarity
- Supports up to 16KB of text

### Item Preview
- Displays as teal badges/tags
- Rounded design with dark mode support
- Auto-updates as you type

### Buttons
- **Create/Update:** Teal primary button (saves menu)
- **Reload:** Secondary button (fetches latest state)
- Disabled state during loading
- Clear loading indicators

---

## 💡 Tips & Best Practices

1. **Use consistent naming** - "Paneer Tikka" not "paneer tikka" for consistency
2. **Include quantities** - Consider adding quantities for portions: "Rice (500g), Dal (300g)"
3. **Add allergen info** - Mark items with allergens if needed: "Peanut Roti*"
4. **Plan ahead** - Create menus for the entire week or month
5. **Use date picker** - More reliable than typing dates manually
6. **Review before saving** - Check preview before creating menu
7. **Keep formatting consistent** - Stick to one separator method

---

## 📞 Support

For issues or questions about the menu feature:
1. Check the error message displayed
2. Verify date format is YYYY-MM-DD
3. Ensure at least one item is entered
4. Try the Reload button to refresh state
5. Contact administrator if issues persist

---

## 🎓 Summary

The Menu Management feature provides:
- ✅ Simple, intuitive UI for creating/updating menus
- ✅ Flexible input formats (comma, bullet, newline)
- ✅ Persistent storage per date
- ✅ API endpoints for programmatic access
- ✅ Full validation and error handling
- ✅ Real-time preview and loading states
- ✅ Complete dark mode support

**All functionality has been tested and verified to be working correctly.**
