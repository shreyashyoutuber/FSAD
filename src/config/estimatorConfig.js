// ─── City Cost Multipliers ────────────────────────────────────────────────────
// Based on average labour + material cost index across Indian cities
export const CITIES = [
    { name: 'Mumbai',      multiplier: 1.55 },
    { name: 'Delhi',       multiplier: 1.45 },
    { name: 'Bangalore',   multiplier: 1.40 },
    { name: 'Hyderabad',   multiplier: 1.30 },
    { name: 'Chennai',     multiplier: 1.25 },
    { name: 'Pune',        multiplier: 1.30 },
    { name: 'Kolkata',     multiplier: 1.10 },
    { name: 'Ahmedabad',   multiplier: 1.15 },
    { name: 'Surat',       multiplier: 1.10 },
    { name: 'Jaipur',      multiplier: 1.00 },
    { name: 'Lucknow',     multiplier: 0.95 },
    { name: 'Chandigarh',  multiplier: 1.10 },
    { name: 'Indore',      multiplier: 0.95 },
    { name: 'Bhopal',      multiplier: 0.90 },
    { name: 'Nagpur',      multiplier: 0.95 },
    { name: 'Coimbatore',  multiplier: 1.05 },
    { name: 'Kochi',       multiplier: 1.15 },
    { name: 'Vadodara',    multiplier: 1.05 },
    { name: 'Mysore',      multiplier: 1.00 },
    { name: 'Other',       multiplier: 1.00 },
]

// ─── Material Grade Multipliers ───────────────────────────────────────────────
export const MATERIAL_GRADES = [
    {
        id: 'economy',
        label: 'Economy',
        emoji: '💚',
        description: 'Budget-friendly. Local brands, basic finishes.',
        multiplier: 0.80,
        color: '#16a34a',
        bg: '#f0fdf4',
        border: '#bbf7d0',
    },
    {
        id: 'standard',
        label: 'Standard',
        emoji: '🔵',
        description: 'Best value. Mid-range brands, good durability.',
        multiplier: 1.00,
        color: '#2563eb',
        bg: '#eff6ff',
        border: '#bfdbfe',
    },
    {
        id: 'premium',
        label: 'Premium',
        emoji: '🟠',
        description: 'Top quality. Branded materials, superior finish.',
        multiplier: 1.45,
        color: '#e67e22',
        bg: '#fff7ed',
        border: '#ffedd5',
    },
]
