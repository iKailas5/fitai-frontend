import { useState, useRef, useEffect } from "react";

// API routed through CodeSandbox backend proxy (server.js)
const API_URL = "/api/chat";

const SYSTEM_PROMPT = "You are the AI fitness coach for Fit with Suryakant Jadhav, powered by champion Suryakant Jadhav, Mr India 2022. You are an elite motivating personal fitness coach and nutritionist. Help users with personalized workout plans, meal plans, BMI calculations, exercise form tips, and motivation. Keep responses energetic and encouraging. Use emojis. Format workouts clearly with sets and reps.";

const C = {
  bg: "#080810",
  card: "#11111c",
  card2: "#181825",
  accent: "#e8ff47",
  accent2: "#ff6b35",
  green: "#4ade80",
  blue: "#60a5fa",
  purple: "#a78bfa",
  text: "#ffffff",
  sub: "#7777aa",
  border: "#1e1e32",
};

const NAV = [
  { id: "home", icon: "⚡", label: "Home" },
  { id: "chat", icon: "🤖", label: "Coach" },
  { id: "workout", icon: "💪", label: "Workout" },
  { id: "challenge", icon: "🏅", label: "Challenge" },
  { id: "trainer", icon: "🏆", label: "Trainer" },
];

const GOALS = [
  { id: "lose", label: "Lose Weight", icon: "🔥", desc: "Burn fat & get lean" },
  { id: "muscle", label: "Build Muscle", icon: "💪", desc: "Gain strength & size" },
  { id: "fit", label: "Stay Fit", icon: "🏃", desc: "Improve endurance" },
  { id: "flex", label: "Flexibility", icon: "🧘", desc: "Stretch & mobility" },
];

const EQUIPMENT = [
  { id: "none", label: "No Equipment", icon: "🏠" },
  { id: "home", label: "Home Gym", icon: "🏋" },
  { id: "gym", label: "Full Gym", icon: "🏟" },
];

const PLANS = [
  {
    id: "free", name: "Free", price: 0, period: "", badge: null, color: C.sub,
    features: [
      { text: "3 AI messages/day", ok: true },
      { text: "Basic workout plan", ok: true },
      { text: "BMI calculator", ok: true },
      { text: "Water tracker", ok: true },
      { text: "Unlimited AI chat", ok: false },
      { text: "Full 7-day plans", ok: false },
      { text: "Meal plans & macros", ok: false },
      { text: "Progress analytics", ok: false },
    ],
  },
  {
    id: "pro", name: "Pro", price: 9.99, period: "month", badge: "POPULAR", color: C.accent,
    features: [
      { text: "Unlimited AI chat", ok: true },
      { text: "Full 7-day workout plans", ok: true },
      { text: "Complete meal plans", ok: true },
      { text: "Nutrition tracker", ok: true },
      { text: "Progress analytics", ok: true },
      { text: "Rest timer & form tips", ok: true },
      { text: "Achievement badges", ok: true },
      { text: "Cancel anytime", ok: true },
    ],
  },
  {
    id: "elite", name: "Elite", price: 19.99, period: "month", badge: "BEST VALUE", color: C.purple,
    features: [
      { text: "Everything in Pro", ok: true },
      { text: "Custom AI workout generator", ok: true },
      { text: "1-on-1 AI nutrition coaching", ok: true },
      { text: "Body composition tracking", ok: true },
      { text: "Supplement advice", ok: true },
      { text: "Exclusive elite programs", ok: true },
      { text: "Export progress reports", ok: true },
      { text: "Cancel anytime", ok: true },
    ],
  },
];

const WORKOUTS = {
  lose: [
    { day: "Mon", name: "HIIT Cardio", emoji: "🔥", duration: "35 min", exercises: [
      { name: "Jumping Jacks", sets: 3, reps: "45 sec", rest: "15s" },
      { name: "Burpees", sets: 3, reps: "12", rest: "30s" },
      { name: "Mountain Climbers", sets: 3, reps: "40 sec", rest: "20s" },
      { name: "Jump Squats", sets: 3, reps: "15", rest: "30s" },
    ]},
    { day: "Tue", name: "Core & Abs", emoji: "⚡", duration: "30 min", exercises: [
      { name: "Plank Hold", sets: 3, reps: "45 sec", rest: "20s" },
      { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "20s" },
      { name: "Leg Raises", sets: 3, reps: "15", rest: "25s" },
      { name: "Russian Twists", sets: 3, reps: "20", rest: "20s" },
    ]},
    { day: "Wed", name: "Active Recovery", emoji: "🧘", duration: "25 min", exercises: [
      { name: "Yoga Flow", sets: 1, reps: "15 min", rest: "-" },
      { name: "Foam Rolling", sets: 1, reps: "10 min", rest: "-" },
    ]},
    { day: "Thu", name: "Full Body Circuit", emoji: "💥", duration: "40 min", exercises: [
      { name: "Push-ups", sets: 4, reps: "15", rest: "30s" },
      { name: "Squats", sets: 4, reps: "20", rest: "30s" },
      { name: "Lunges", sets: 3, reps: "12 each", rest: "25s" },
    ]},
    { day: "Fri", name: "Cardio Endurance", emoji: "🏃", duration: "45 min", exercises: [
      { name: "Jog/Run", sets: 1, reps: "20 min", rest: "-" },
      { name: "Jump Rope", sets: 4, reps: "2 min", rest: "30s" },
    ]},
    { day: "Sat", name: "Stretch", emoji: "🌿", duration: "20 min", exercises: [
      { name: "Full Body Stretch", sets: 1, reps: "20 min", rest: "-" },
    ]},
    { day: "Sun", name: "Rest Day", emoji: "😴", duration: "-", exercises: [] },
  ],
  muscle: [
    { day: "Mon", name: "Chest & Triceps", emoji: "💪", duration: "50 min", exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10", rest: "75s" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12", rest: "60s" },
    ]},
    { day: "Tue", name: "Back & Biceps", emoji: "🏋", duration: "55 min", exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8", rest: "120s" },
      { name: "Pull-ups", sets: 4, reps: "8", rest: "90s" },
      { name: "Barbell Curls", sets: 3, reps: "10", rest: "60s" },
    ]},
    { day: "Wed", name: "Legs Day", emoji: "🦵", duration: "55 min", exercises: [
      { name: "Squats", sets: 5, reps: "6-8", rest: "120s" },
      { name: "Leg Press", sets: 4, reps: "10", rest: "90s" },
      { name: "Calf Raises", sets: 4, reps: "15", rest: "45s" },
    ]},
    { day: "Thu", name: "Shoulders", emoji: "⚡", duration: "45 min", exercises: [
      { name: "Overhead Press", sets: 4, reps: "8", rest: "90s" },
      { name: "Lateral Raises", sets: 4, reps: "12", rest: "60s" },
      { name: "Shrugs", sets: 3, reps: "15", rest: "60s" },
    ]},
    { day: "Fri", name: "Full Body Power", emoji: "🔥", duration: "60 min", exercises: [
      { name: "Clean & Press", sets: 4, reps: "6", rest: "120s" },
      { name: "Weighted Pull-ups", sets: 3, reps: "6", rest: "90s" },
    ]},
    { day: "Sat", name: "Active Recovery", emoji: "🧘", duration: "30 min", exercises: [
      { name: "Light Cardio", sets: 1, reps: "20 min", rest: "-" },
    ]},
    { day: "Sun", name: "Rest Day", emoji: "😴", duration: "-", exercises: [] },
  ],
  fit: [
    { day: "Mon", name: "Cardio + Core", emoji: "🏃", duration: "40 min", exercises: [
      { name: "Run/Jog", sets: 1, reps: "20 min", rest: "-" },
      { name: "Plank", sets: 3, reps: "45 sec", rest: "20s" },
    ]},
    { day: "Tue", name: "Upper Body", emoji: "💪", duration: "45 min", exercises: [
      { name: "Push-ups", sets: 4, reps: "15", rest: "45s" },
      { name: "Dumbbell Rows", sets: 3, reps: "12", rest: "45s" },
      { name: "Shoulder Press", sets: 3, reps: "12", rest: "45s" },
    ]},
    { day: "Wed", name: "Yoga & Stretch", emoji: "🧘", duration: "30 min", exercises: [
      { name: "Sun Salutations", sets: 3, reps: "5 rounds", rest: "30s" },
    ]},
    { day: "Thu", name: "Lower Body", emoji: "🦵", duration: "45 min", exercises: [
      { name: "Squats", sets: 4, reps: "15", rest: "45s" },
      { name: "Lunges", sets: 3, reps: "12 each", rest: "45s" },
      { name: "Calf Raises", sets: 3, reps: "20", rest: "30s" },
    ]},
    { day: "Fri", name: "HIIT Mix", emoji: "⚡", duration: "35 min", exercises: [
      { name: "Burpees", sets: 3, reps: "10", rest: "30s" },
      { name: "Jump Squats", sets: 3, reps: "15", rest: "30s" },
    ]},
    { day: "Sat", name: "Fun Activity", emoji: "🎮", duration: "60 min", exercises: [
      { name: "Sports / Swimming / Cycling", sets: 1, reps: "60 min", rest: "-" },
    ]},
    { day: "Sun", name: "Rest Day", emoji: "😴", duration: "-", exercises: [] },
  ],
  flex: [
    { day: "Mon", name: "Morning Flow", emoji: "🌅", duration: "30 min", exercises: [
      { name: "Sun Salutation", sets: 5, reps: "rounds", rest: "30s" },
      { name: "Downward Dog", sets: 3, reps: "60 sec", rest: "-" },
    ]},
    { day: "Tue", name: "Hip & Hamstrings", emoji: "🧘", duration: "35 min", exercises: [
      { name: "Hip Flexor Stretch", sets: 3, reps: "60 sec", rest: "-" },
      { name: "Seated Forward Fold", sets: 3, reps: "60 sec", rest: "-" },
    ]},
    { day: "Wed", name: "Strength + Flex", emoji: "💪", duration: "40 min", exercises: [
      { name: "Yoga Push-ups", sets: 3, reps: "10", rest: "30s" },
      { name: "Warrior Flow", sets: 3, reps: "5 min", rest: "-" },
    ]},
    { day: "Thu", name: "Spine & Back", emoji: "🌿", duration: "30 min", exercises: [
      { name: "Cat-Cow", sets: 3, reps: "10", rest: "-" },
      { name: "Cobra Stretch", sets: 3, reps: "45 sec", rest: "-" },
    ]},
    { day: "Fri", name: "Full Body Stretch", emoji: "✨", duration: "35 min", exercises: [
      { name: "Full Body Flow", sets: 1, reps: "35 min", rest: "-" },
    ]},
    { day: "Sat", name: "Meditation", emoji: "🧠", duration: "20 min", exercises: [
      { name: "Breathing Exercises", sets: 1, reps: "10 min", rest: "-" },
      { name: "Guided Meditation", sets: 1, reps: "10 min", rest: "-" },
    ]},
    { day: "Sun", name: "Rest Day", emoji: "😴", duration: "-", exercises: [] },
  ],
};

const MEALS = {
  lose: {
    breakfast: [
      { name: "Overnight Oats", cal: 320, protein: 14, carbs: 48, fat: 7, icon: "🥣", veg: true },
      { name: "Greek Yogurt + Berries", cal: 280, protein: 20, carbs: 32, fat: 5, icon: "🍓", veg: true },
      { name: "Paneer Bhurji + Roti", cal: 310, protein: 18, carbs: 28, fat: 12, icon: "🧀", veg: true },
      { name: "Egg White Omelette", cal: 250, protein: 24, carbs: 12, fat: 6, icon: "🍳", veg: false },
      { name: "Boiled Eggs + Toast", cal: 290, protein: 22, carbs: 26, fat: 9, icon: "🥚", veg: false },
    ],
    lunch: [
      { name: "Dal + Brown Rice + Salad", cal: 380, protein: 18, carbs: 58, fat: 7, icon: "🍛", veg: true },
      { name: "Rajma + Roti + Raita", cal: 420, protein: 20, carbs: 62, fat: 8, icon: "🫘", veg: true },
      { name: "Grilled Chicken Salad", cal: 380, protein: 42, carbs: 18, fat: 12, icon: "🥗", veg: false },
      { name: "Tuna Brown Rice Bowl", cal: 420, protein: 38, carbs: 48, fat: 9, icon: "🐟", veg: false },
    ],
    dinner: [
      { name: "Moong Dal Khichdi", cal: 340, protein: 16, carbs: 52, fat: 6, icon: "🍚", veg: true },
      { name: "Mixed Veg Curry + Roti", cal: 360, protein: 12, carbs: 50, fat: 10, icon: "🥦", veg: true },
      { name: "Baked Salmon + Veggies", cal: 450, protein: 48, carbs: 22, fat: 18, icon: "🍣", veg: false },
      { name: "Grilled Shrimp + Quinoa", cal: 380, protein: 36, carbs: 38, fat: 8, icon: "🍤", veg: false },
    ],
    snacks: [
      { name: "Apple + Almond Butter", cal: 180, protein: 4, carbs: 24, fat: 9, icon: "🍎", veg: true },
      { name: "Roasted Chana", cal: 160, protein: 9, carbs: 22, fat: 4, icon: "🫘", veg: true },
      { name: "Boiled Egg + Cucumber", cal: 120, protein: 12, carbs: 4, fat: 5, icon: "🥚", veg: false },
    ],
  },
  muscle: {
    breakfast: [
      { name: "Paneer Paratha + Curd", cal: 580, protein: 28, carbs: 65, fat: 20, icon: "🧀", veg: true },
      { name: "Soya Oats Porridge", cal: 520, protein: 32, carbs: 68, fat: 12, icon: "🥣", veg: true },
      { name: "4 Eggs + Oats + Banana", cal: 620, protein: 36, carbs: 72, fat: 16, icon: "🍳", veg: false },
      { name: "Chicken Oats Bowl", cal: 600, protein: 46, carbs: 64, fat: 14, icon: "🍗", veg: false },
    ],
    lunch: [
      { name: "Paneer Rice + Dal", cal: 700, protein: 34, carbs: 82, fat: 18, icon: "🍛", veg: true },
      { name: "Soya Chunk Curry + Rice", cal: 680, protein: 40, carbs: 78, fat: 14, icon: "🫘", veg: true },
      { name: "Chicken Rice & Broccoli", cal: 680, protein: 55, carbs: 75, fat: 12, icon: "🍗", veg: false },
      { name: "Tuna Pasta Bowl", cal: 640, protein: 50, carbs: 80, fat: 10, icon: "🍝", veg: false },
    ],
    dinner: [
      { name: "Dal Makhani + Brown Rice", cal: 700, protein: 28, carbs: 88, fat: 18, icon: "🍚", veg: true },
      { name: "Tofu Tikka + Roti", cal: 680, protein: 36, carbs: 72, fat: 18, icon: "🥡", veg: true },
      { name: "Salmon + Pasta + Salad", cal: 750, protein: 58, carbs: 72, fat: 22, icon: "🐟", veg: false },
      { name: "Chicken Burrito Bowl", cal: 720, protein: 52, carbs: 78, fat: 16, icon: "🌯", veg: false },
    ],
    snacks: [
      { name: "Cottage Cheese + Nuts", cal: 280, protein: 24, carbs: 12, fat: 14, icon: "🧀", veg: true },
      { name: "Peanut Butter Banana", cal: 320, protein: 10, carbs: 42, fat: 14, icon: "🍌", veg: true },
      { name: "Boiled Eggs + Peanuts", cal: 260, protein: 22, carbs: 8, fat: 16, icon: "🥚", veg: false },
    ],
  },
  fit: {
    breakfast: [
      { name: "Smoothie Bowl", cal: 380, protein: 14, carbs: 58, fat: 9, icon: "🥤", veg: true },
      { name: "Poha + Sprouts", cal: 320, protein: 12, carbs: 52, fat: 6, icon: "🍚", veg: true },
      { name: "Omelette + Toast", cal: 380, protein: 22, carbs: 34, fat: 14, icon: "🍳", veg: false },
      { name: "Chicken Sandwich", cal: 400, protein: 30, carbs: 38, fat: 12, icon: "🥪", veg: false },
    ],
    lunch: [
      { name: "Chole + Rice + Salad", cal: 460, protein: 18, carbs: 68, fat: 10, icon: "🫘", veg: true },
      { name: "Lentil Soup + Roti", cal: 420, protein: 20, carbs: 60, fat: 8, icon: "🍲", veg: true },
      { name: "Grilled Chicken Wrap", cal: 480, protein: 38, carbs: 48, fat: 14, icon: "🌯", veg: false },
      { name: "Fish Rice Bowl", cal: 460, protein: 36, carbs: 50, fat: 10, icon: "🐟", veg: false },
    ],
    dinner: [
      { name: "Palak Dal + Roti", cal: 400, protein: 18, carbs: 54, fat: 9, icon: "🥬", veg: true },
      { name: "Paneer Tikka + Salad", cal: 430, protein: 26, carbs: 28, fat: 22, icon: "🧀", veg: true },
      { name: "Grilled Chicken + Veggies", cal: 480, protein: 44, carbs: 28, fat: 14, icon: "🍗", veg: false },
      { name: "Fish Curry + Rice", cal: 500, protein: 40, carbs: 52, fat: 12, icon: "🍛", veg: false },
    ],
    snacks: [
      { name: "Mixed Nuts", cal: 180, protein: 5, carbs: 8, fat: 16, icon: "🌰", veg: true },
      { name: "Hummus + Veggies", cal: 150, protein: 6, carbs: 18, fat: 7, icon: "🥕", veg: true },
      { name: "Boiled Eggs", cal: 140, protein: 12, carbs: 2, fat: 9, icon: "🥚", veg: false },
    ],
  },
  flex: {
    breakfast: [
      { name: "Green Smoothie", cal: 280, protein: 10, carbs: 46, fat: 7, icon: "🥬", veg: true },
      { name: "Chia Pudding + Fruits", cal: 320, protein: 12, carbs: 42, fat: 12, icon: "🍮", veg: true },
      { name: "Egg Bhurji + Toast", cal: 310, protein: 20, carbs: 28, fat: 12, icon: "🍳", veg: false },
    ],
    lunch: [
      { name: "Quinoa Salad + Paneer", cal: 400, protein: 22, carbs: 48, fat: 14, icon: "🥗", veg: true },
      { name: "Vegetable Khichdi", cal: 360, protein: 14, carbs: 58, fat: 8, icon: "🍚", veg: true },
      { name: "Grilled Fish + Salad", cal: 380, protein: 38, carbs: 20, fat: 14, icon: "🐟", veg: false },
    ],
    dinner: [
      { name: "Lentil Curry + Rice", cal: 440, protein: 20, carbs: 68, fat: 9, icon: "🍛", veg: true },
      { name: "Dal Tadka + Chapati", cal: 380, protein: 16, carbs: 56, fat: 9, icon: "🍚", veg: true },
      { name: "Baked Fish + Salad", cal: 400, protein: 36, carbs: 22, fat: 16, icon: "🐟", veg: false },
    ],
    snacks: [
      { name: "Green Tea + Almonds", cal: 140, protein: 5, carbs: 6, fat: 12, icon: "🍵", veg: true },
      { name: "Edamame", cal: 130, protein: 11, carbs: 11, fat: 5, icon: "🫘", veg: true },
      { name: "Tuna + Crackers", cal: 160, protein: 18, carbs: 12, fat: 4, icon: "🐟", veg: false },
    ],
  },
};

// ── OWNER UPI DETAILS (update these with your real UPI info) ─────────────────
var OWNER_UPI = "suryakant.jadhav@upi";       // YOUR UPI ID here
var OWNER_NAME = "Suryakant Jadhav";           // Your registered name
var OWNER_PHONE = "91XXXXXXXXXX";              // Your phone number (for PhonePe/GPay)

// UPI deep link builder — opens UPI app directly with payment pre-filled
function buildUPILink(appId, amount, note) {
  var upiParams = "pa=" + OWNER_UPI + "&pn=" + encodeURIComponent(OWNER_NAME) + "&am=" + amount + "&cu=INR&tn=" + encodeURIComponent(note);
  if (appId === "gpay")      return "tez://upi/pay?" + upiParams;
  if (appId === "phonepe")   return "phonepe://pay?" + upiParams;
  if (appId === "paytm")     return "paytmmp://pay?" + upiParams;
  if (appId === "bhim")      return "upi://pay?" + upiParams;
  if (appId === "amazonpay") return "amazonpay://pay?" + upiParams;
  if (appId === "cred")      return "cred://pay?" + upiParams;
  return "upi://pay?" + upiParams;
}

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", emoji: "🟢", color: "#4285F4", bg: "rgba(66,133,244,0.12)", bd: "rgba(66,133,244,0.35)" },
  { id: "phonepe", name: "PhonePe", emoji: "💜", color: "#5f259f", bg: "rgba(95,37,159,0.12)", bd: "rgba(95,37,159,0.35)" },
  { id: "paytm", name: "Paytm", emoji: "🔵", color: "#00BAF2", bg: "rgba(0,186,242,0.12)", bd: "rgba(0,186,242,0.35)" },
  { id: "bhim", name: "BHIM UPI", emoji: "🇮🇳", color: "#FF6B00", bg: "rgba(255,107,0,0.12)", bd: "rgba(255,107,0,0.35)" },
  { id: "amazonpay", name: "Amazon Pay", emoji: "🟡", color: "#FF9900", bg: "rgba(255,153,0,0.12)", bd: "rgba(255,153,0,0.35)" },
  { id: "cred", name: "CRED", emoji: "⚫", color: "#cccccc", bg: "rgba(200,200,200,0.08)", bd: "rgba(200,200,200,0.25)" },
];

// ── DAILY SJ CHALLENGES ──────────────────────────────────────────────────────
var DAILY_CHALLENGES = [
  { id: 0, title: "100 Push-up Challenge", emoji: "💪", desc: "Complete 100 push-ups throughout the day in sets of 10-20.", target: 100, unit: "push-ups", xp: 150, tip: "Start with 5 sets of 20. Rest 2 min between sets. Keep core tight!", difficulty: "Medium" },
  { id: 1, title: "10,000 Steps Today", emoji: "🏃", desc: "Walk or run 10,000 steps. Every step counts!", target: 10000, unit: "steps", xp: 100, tip: "Park farther, take stairs, walk during calls.", difficulty: "Easy" },
  { id: 2, title: "5 Min Plank Total", emoji: "⚡", desc: "Hold plank for a total of 5 minutes across multiple sets.", target: 5, unit: "minutes", xp: 200, tip: "Try 6 sets of 50 seconds. Focus on breathing.", difficulty: "Hard" },
  { id: 3, title: "50 Burpees Blitz", emoji: "🔥", desc: "Complete 50 burpees as fast as possible. Record your time!", target: 50, unit: "burpees", xp: 180, tip: "Pace yourself. Sets of 10 with 30 sec rest.", difficulty: "Hard" },
  { id: 4, title: "200 Squats Strong", emoji: "🦵", desc: "Do 200 squats today in sets of 25-50.", target: 200, unit: "squats", xp: 160, tip: "Go below parallel, chest up, knees over toes.", difficulty: "Medium" },
  { id: 5, title: "30 Min Cardio Burn", emoji: "🏋", desc: "30 minutes of continuous cardio - run, cycle, or jump rope.", target: 30, unit: "minutes", xp: 120, tip: "Keep heart rate at 65-75% of max.", difficulty: "Easy" },
  { id: 6, title: "150 Jumping Jacks", emoji: "🌟", desc: "Complete 150 jumping jacks to boost your heart rate!", target: 150, unit: "jumping jacks", xp: 90, tip: "Arms fully extended overhead, feet wider than shoulders.", difficulty: "Easy" },
];

var CHALLENGE_BADGES = [
  { id: "first_blood", title: "First Win", emoji: "🌟", desc: "Complete your first challenge", req: 1 },
  { id: "week_warrior", title: "Week Warrior", emoji: "🔥", desc: "Complete 7 challenges", req: 7 },
  { id: "beast_mode", title: "Beast Mode", emoji: "💪", desc: "Complete 30 challenges", req: 30 },
  { id: "sj_champion", title: "SJ Champion", emoji: "🏆", desc: "Complete 100 challenges", req: 100 },
];

// ── SLEEP & RECOVERY DATA ─────────────────────────────────────────────────────
var RECOVERY_LEVELS = {
  poor:  { label: "Under 5h", color: "#ef4444", intensity: "Rest Day",   message: "Your body needs recovery. Skip intense training, do light stretching only.", mod: "15 min yoga only." },
  ok:    { label: "5-6h",     color: "#f97316", intensity: "Light",      message: "Low energy today. Light workout and aim for 8 hours tonight.", mod: "Reduce intensity by 30%." },
  good:  { label: "6-7h",     color: "#e8ff47", intensity: "Moderate",   message: "Decent sleep. Train at 80% and focus on form over weight.", mod: "Reduce weight by 10-15%." },
  great: { label: "7-8h",     color: "#4ade80", intensity: "Full Power", message: "Great sleep! Muscles are recovered. Push hard today!", mod: "Full workout, consider a PR!" },
  elite: { label: "8h+",      color: "#a78bfa", intensity: "Beast Mode", message: "Champion sleep! You are primed for peak performance. BEAST MODE!", mod: "Add 5-10% more weight today!" },
};

function getSleepLevel(h) {
  if (h < 5) return "poor";
  if (h < 6) return "ok";
  if (h < 7) return "good";
  if (h < 8) return "great";
  return "elite";
}

function calcBMI(w, h) {
  if (!w || !h) return null;
  var hm = parseFloat(h) / 100;
  return (parseFloat(w) / (hm * hm)).toFixed(1);
}
function bmiInfo(b) {
  var v = parseFloat(b);
  if (v < 18.5) return { label: "Underweight", color: C.blue };
  if (v < 25) return { label: "Normal", color: C.green };
  if (v < 30) return { label: "Overweight", color: C.accent };
  return { label: "Obese", color: C.accent2 };
}
function calcTDEE(w, h, a, goal) {
  if (!w || !h || !a) return null;
  var bmr = 10 * parseFloat(w) + 6.25 * parseFloat(h) - 5 * parseFloat(a) + 5;
  var tdee = Math.round(bmr * 1.55);
  if (goal === "lose") return tdee - 500;
  if (goal === "muscle") return tdee + 300;
  return tdee;
}

const S = {
  pg: { padding: "20px 16px 100px" },
  title: { fontSize: 22, fontWeight: 900, margin: "0 0 18px", color: C.text },
  inp: { background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: "13px 16px", color: C.text, fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box" },
  lbl: { color: C.sub, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "6px 0 8px" },
  card: { background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 },
  cardOn: { border: "2px solid " + C.accent, background: "rgba(232,255,71,0.09)" },
  chip: { background: C.card, border: "1px solid " + C.border, borderRadius: 20, padding: "9px 16px", fontSize: 13, cursor: "pointer", color: C.sub, whiteSpace: "nowrap" },
  chipOn: { border: "1px solid " + C.accent, color: C.accent, background: "rgba(232,255,71,0.09)" },
  btn: { background: C.accent, color: "#000", border: "none", borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 900, cursor: "pointer", width: "100%", marginTop: 8 },
};

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function SplashScreen() {
  return (
    <div style={{ background: C.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Segoe UI,sans-serif", color: C.text, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(232,255,71,0.18) 0%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 72 }}>⚡</div>
        <h1 style={{ fontSize: 44, fontWeight: 900, color: C.text, margin: "8px 0 0", letterSpacing: -2 }}>Fit with SJ</h1>
        <p style={{ color: C.sub, fontSize: 14, margin: "8px 0 28px" }}>by Suryakant Jadhav | Mr India 2022</p>
        <div style={{ width: 130, height: 3, background: C.border, borderRadius: 4, margin: "0 auto", overflow: "hidden" }}>
          <div style={{ height: "100%", background: C.accent, borderRadius: 4, width: "100%" }} />
        </div>
      </div>
    </div>
  );
}

function OnboardScreen({ onStart, onSkip }) {
  var [prof, setProf] = useState({ name: "", age: "", weight: "", height: "", goal: "", equipment: "" });
  var bmi = calcBMI(prof.weight, prof.height);
  var bi = bmi ? bmiInfo(bmi) : null;
  var tdee = calcTDEE(prof.weight, prof.height, prof.age, prof.goal);
  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "24px 16px 60px", fontFamily: "Segoe UI,sans-serif", color: C.text, maxWidth: 430, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 12 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>🏋</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Train with <span style={{ color: C.accent }}>Mr India 2022</span></h2>
        <p style={{ color: C.sub, marginTop: 8, fontSize: 14 }}>Powered by Suryakant Jadhav</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input style={S.inp} placeholder="Your name" value={prof.name} onChange={function(e) { setProf(Object.assign({}, prof, { name: e.target.value })); }} />
        <div style={{ display: "flex", gap: 10 }}>
          <input style={Object.assign({}, S.inp, { flex: 1 })} placeholder="Age" type="number" value={prof.age} onChange={function(e) { setProf(Object.assign({}, prof, { age: e.target.value })); }} />
          <input style={Object.assign({}, S.inp, { flex: 1 })} placeholder="Weight (kg)" type="number" value={prof.weight} onChange={function(e) { setProf(Object.assign({}, prof, { weight: e.target.value })); }} />
        </div>
        <input style={S.inp} placeholder="Height (cm)" type="number" value={prof.height} onChange={function(e) { setProf(Object.assign({}, prof, { height: e.target.value })); }} />
        <p style={S.lbl}>Your Goal</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {GOALS.map(function(g) {
            return (
              <div key={g.id} style={Object.assign({}, S.card, prof.goal === g.id ? S.cardOn : {})} onClick={function() { setProf(Object.assign({}, prof, { goal: g.id })); }}>
                <span style={{ fontSize: 24 }}>{g.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{g.label}</span>
                <span style={{ fontSize: 10, color: C.sub }}>{g.desc}</span>
              </div>
            );
          })}
        </div>
        <p style={S.lbl}>Equipment</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {EQUIPMENT.map(function(eq) {
            return (
              <div key={eq.id} style={Object.assign({}, S.chip, prof.equipment === eq.id ? S.chipOn : {})} onClick={function() { setProf(Object.assign({}, prof, { equipment: eq.id })); }}>
                {eq.icon} {eq.label}
              </div>
            );
          })}
        </div>
        {bmi && (
          <div style={{ background: "rgba(232,255,71,0.08)", border: "1px solid rgba(232,255,71,0.3)", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Your BMI</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.accent }}>{bmi}</p>
              {bi && <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: bi.color }}>{bi.label}</p>}
            </div>
            {tdee && (
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Daily Target</p>
                <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 900, color: C.accent2 }}>{tdee}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.sub }}>kcal/day</p>
              </div>
            )}
          </div>
        )}
        <button style={Object.assign({}, S.btn, { opacity: (!prof.name || !prof.goal || !prof.equipment) ? 0.5 : 1 })} disabled={!prof.name || !prof.goal || !prof.equipment} onClick={function() { onStart(prof); }}>
          Start My AI Journey
        </button>
        <p style={{ textAlign: "center", color: C.sub, fontSize: 12, margin: 0 }}>
          Already set up? <span style={{ color: C.accent, cursor: "pointer" }} onClick={onSkip}>Go to Home</span>
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  var [screen, setScreen] = useState("splash");
  var [profile, setProfile] = useState({ name: "", age: "", weight: "", height: "", goal: "", equipment: "" });
  var [messages, setMessages] = useState([]);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [msgCount, setMsgCount] = useState(0);
  var [sub, setSub] = useState({ plan: "free", billing: "monthly", nextBilling: null });
  var [selPlan, setSelPlan] = useState("pro");
  var [billing, setBilling] = useState("monthly");
  var [payStep, setPayStep] = useState("plans");
  var [upiApp, setUpiApp] = useState("");
  var [upiId, setUpiId] = useState("");
  var [payLoading, setPayLoading] = useState(false);
  var [selDay, setSelDay] = useState(0);
  var [doneEx, setDoneEx] = useState({});
  var [mealTab, setMealTab] = useState("breakfast");
  var [dietFilter, setDietFilter] = useState("all");
  var [logged, setLogged] = useState([]);
  var [water, setWater] = useState(4);
  var [timerSec, setTimerSec] = useState(60);
  var [timerTotal, setTimerTotal] = useState(60);
  var [timerOn, setTimerOn] = useState(false);
  var [timerLabel, setTimerLabel] = useState("Rest");
  var [progLog, setProgLog] = useState([
    { date: "Mar 1", weight: 82, workouts: 3 },
    { date: "Mar 8", weight: 81.2, workouts: 4 },
    { date: "Mar 15", weight: 80.5, workouts: 5 },
    { date: "Mar 22", weight: 79.8, workouts: 4 },
    { date: "Apr 3", weight: 78.5, workouts: 6 },
  ]);
  var [newW, setNewW] = useState("");
  var [showBMI, setShowBMI] = useState(false);

  // ── Feature 1: Voice Coach ─────────────────────────────────────────────────
  var [voiceOn, setVoiceOn] = useState(false);
  var [voiceStatus, setVoiceStatus] = useState("idle"); // idle | listening | processing
  var [transcript, setTranscript] = useState("");
  var recognitionRef = useRef(null);

  // ── Feature 2: Daily SJ Challenge ─────────────────────────────────────────
  var todayChallengeIdx = new Date().getDay() % DAILY_CHALLENGES.length;
  var todayChallenge = DAILY_CHALLENGES[todayChallengeIdx];
  var [challengeProgress, setChallengeProgress] = useState(0);
  var [challengeDone, setChallengeDone] = useState(false);
  var [challengeStreak, setChallengeStreak] = useState(5);
  var [totalXP, setTotalXP] = useState(750);
  var [completedChallenges, setCompletedChallenges] = useState(7);
  var [challengeInput, setChallengeInput] = useState("");

  // ── Feature 3: Sleep & Recovery ───────────────────────────────────────────
  var [sleepLog, setSleepLog] = useState([
    { date: "Mon", hours: 7.5, quality: "great" },
    { date: "Tue", hours: 6.0, quality: "good" },
    { date: "Wed", hours: 8.5, quality: "elite" },
    { date: "Thu", hours: 5.5, quality: "ok" },
    { date: "Fri", hours: 7.0, quality: "great" },
    { date: "Sat", hours: 8.0, quality: "elite" },
    { date: "Sun", hours: 6.5, quality: "good" },
  ]);
  var [sleepInput, setSleepInput] = useState("7");
  var [sleepQualityNote, setSleepQualityNote] = useState("");
  var todaySleep = sleepLog[sleepLog.length - 1];
  var todaySleepLevel = RECOVERY_LEVELS[getSleepLevel(todaySleep.hours)];
  var avgSleep = (sleepLog.reduce(function(s, d) { return s + d.hours; }, 0) / sleepLog.length).toFixed(1);
  var chatEnd = useRef(null);
  var timerRef = useRef(null);
  var streak = 12;

  var isPro = sub.plan === "pro" || sub.plan === "elite";
  var isElite = sub.plan === "elite";
  var bmi = calcBMI(profile.weight, profile.height);
  var bi = bmi ? bmiInfo(bmi) : null;
  var tdee = calcTDEE(profile.weight, profile.height, profile.age, profile.goal);
  var workoutPlan = WORKOUTS[profile.goal] || WORKOUTS.fit;
  var meals = MEALS[profile.goal] || MEALS.fit;
  var todayPlan = workoutPlan[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] || workoutPlan[0];
  var totalCal = logged.reduce(function(s, m) { return s + m.cal; }, 0);
  var totalP = logged.reduce(function(s, m) { return s + m.protein; }, 0);
  var totalCb = logged.reduce(function(s, m) { return s + m.carbs; }, 0);
  var totalFt = logged.reduce(function(s, m) { return s + m.fat; }, 0);
  var cPlan = PLANS.find(function(p) { return p.id === selPlan; }) || PLANS[1];
  var cPrice = billing === "annual" ? (cPlan.price * 0.6).toFixed(2) : cPlan.price;
  var cINR = Math.round(parseFloat(billing === "annual" ? cPrice * 12 : cPrice) * 83);
  var timerPct = timerTotal > 0 ? (timerSec / timerTotal) * 100 : 0;
  var r2 = 42;
  var circ = 2 * Math.PI * r2;

  useEffect(function() {
    if (screen === "splash") {
      var t = setTimeout(function() { setScreen("onboard"); }, 2200);
      return function() { clearTimeout(t); };
    }
  }, [screen]);

  useEffect(function() {
    if (chatEnd.current) {
      chatEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(function() {
    if (timerOn && timerSec > 0) {
      timerRef.current = setTimeout(function() {
        setTimerSec(function(s) { return s - 1; });
      }, 1000);
    } else if (timerOn && timerSec === 0) {
      setTimerOn(false);
    }
    return function() { clearTimeout(timerRef.current); };
  }, [timerOn, timerSec]);

  useEffect(function() {
    var el = document.createElement("style");
    el.textContent = "@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}} @keyframes dot1{0%,80%,100%{opacity:0.2}40%{opacity:1}} @keyframes dot2{0%,20%,100%{opacity:0.2}60%{opacity:1}} @keyframes dot3{0%,40%,100%{opacity:0.2}80%{opacity:1}} ::-webkit-scrollbar{width:0;height:0} input::placeholder{color:#555577} *{box-sizing:border-box} body{margin:0;background:#080810}";
    document.head.appendChild(el);
    return function() { document.head.removeChild(el); };
  }, []);

  // ── Voice Coach Functions ──────────────────────────────────────────────────
  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.05;
    u.volume = 1;
    // Try to use a good voice
    var voices = window.speechSynthesis.getVoices();
    var preferred = voices.find(function(v) { return v.name.includes("Google") || v.name.includes("Natural") || v.lang === "en-IN"; });
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }

  function startVoiceCoach() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      speak("Voice coach is ready! Ask me anything about your workout.");
      setVoiceStatus("listening");
      setVoiceOn(true);
      return;
    }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN";
    recognitionRef.current = rec;

    rec.onstart = function() { setVoiceStatus("listening"); };
    rec.onresult = function(e) {
      var txt = e.results[0][0].transcript;
      setTranscript(txt);
      setVoiceStatus("processing");
      speak("Got it! Let me help you with that.");
      setTimeout(function() {
        sendMsg(txt);
        setScreen("chat");
        setVoiceOn(false);
        setVoiceStatus("idle");
      }, 1500);
    };
    rec.onerror = function() {
      setVoiceStatus("idle");
      speak("Sorry, I did not catch that. Please try again.");
    };
    rec.onend = function() {
      if (voiceStatus === "listening") setVoiceStatus("idle");
    };
    rec.start();
    setVoiceOn(true);
    speak("I am listening. Ask me about your workout, nutrition, or motivation!");
  }

  function stopVoice() {
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis && window.speechSynthesis.cancel();
    setVoiceOn(false);
    setVoiceStatus("idle");
    setTranscript("");
  }

  function announceExercise(exerciseName, sets, reps) {
    speak("Next up: " + exerciseName + ". Do " + sets + " sets of " + reps + ". Lets go! You can do this!");
  }

  function announceRest(seconds) {
    speak("Great work! Rest for " + seconds + " seconds. Breathe deeply. You are doing amazing!");
    if (seconds > 20) {
      setTimeout(function() { speak("Halfway through your rest. Get ready!"); }, (seconds * 1000) / 2);
      setTimeout(function() { speak("10 seconds left. Prepare yourself!"); }, (seconds - 10) * 1000);
    }
  }

  // ── Challenge Functions ────────────────────────────────────────────────────
  function completeChallenge() {
    if (challengeDone) return;
    setChallengeDone(true);
    setChallengeStreak(function(s) { return s + 1; });
    setTotalXP(function(x) { return x + todayChallenge.xp; });
    setCompletedChallenges(function(c) { return c + 1; });
    speak("Congratulations! You completed todays SJ Challenge! Suryakant Jadhav is proud of you! Keep up this amazing work!");
  }

  function startTimer(s, lbl) {
    setTimerSec(s); setTimerTotal(s); setTimerLabel(lbl); setTimerOn(true);
  }

  async function sendMsg(txt) {
    if (!isPro && msgCount >= 3) { setScreen("paywall"); setPayStep("plans"); return; }
    var msgs = messages.concat([{ role: "user", content: txt }]);
    setMessages(msgs); setInput(""); setLoading(true);
    setMsgCount(function(c) { return c + 1; });
    try {
      var r = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT, messages: msgs }) });
      var d = await r.json();
      var reply = (d.content && d.content[0] && d.content[0].text) || "Sorry, try again!";
      setMessages(msgs.concat([{ role: "assistant", content: reply }]));
    } catch (e) {
      var errMsg = "Connection error. Make sure your backend is running on Render.com and API_URL is updated in the code. See console for details.";
      setMessages(msgs.concat([{ role: "assistant", content: errMsg }]));
    }
    setLoading(false);
  }

  function completePayment() {
    var note = "FitSJ " + cPlan.name + " Subscription";
    var link = buildUPILink(upiApp, cINR, note);

    // Open UPI app deep link — works on Android/iOS
    window.location.href = link;

    // Fallback: if deep link fails (desktop/browser), show success after 3s
    // In real app, use a webhook to confirm payment from Razorpay/UPI
    setPayLoading(true);
    setTimeout(function() {
      setPayLoading(false);
      var now = new Date(); var next = new Date(now);
      next.setMonth(next.getMonth() + (billing === "annual" ? 12 : 1));
      setSub({ plan: selPlan, billing: billing, nextBilling: next.toLocaleDateString() });
      setPayStep("success");
    }, 4000);
  }

  return (
    <div>
      {screen === "splash" && <SplashScreen />}
      {screen === "onboard" && (
        <OnboardScreen
          onStart={function(prof) { setProfile(prof); setScreen("chat"); sendMsg("Hi! I am " + (prof.name || "a user") + ". My goal: " + prof.goal + ". Age: " + prof.age + ", Weight: " + prof.weight + "kg, Height: " + prof.height + "cm. Please be my fitness coach!"); }}
          onSkip={function() { setScreen("home"); }}
        />
      )}
      {screen !== "splash" && screen !== "onboard" && (
        <div style={{ background: C.bg, height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Segoe UI,sans-serif", color: C.text, maxWidth: 430, margin: "0 auto", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {screen === "home" && (
          <div style={S.pg}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: C.sub }}>Good day 👋</p>
                <h2 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 900 }}>{profile.name || "Athlete"}</h2>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg," + C.accent + "," + C.accent2 + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer" }} onClick={function() { setScreen("profile"); }}>💪</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[{ icon: "🔥", val: streak + "", lbl: "Streak" }, { icon: "💧", val: water + "/8", lbl: "Water" }, { icon: "🥗", val: totalCal + "", lbl: "kcal" }, { icon: "⭐", val: "85%", lbl: "Goal" }].map(function(s, i) {
                return (
                  <div key={i} style={{ flex: 1, background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "12px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: 16 }}>{s.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, marginTop: 2 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: C.sub, marginTop: 1 }}>{s.lbl}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>💧 Daily Water</p>
                <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{water}/8 glasses</p>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2,3,4,5,6,7].map(function(idx) {
                  return <div key={idx} style={{ flex: 1, height: 30, borderRadius: 8, background: idx < water ? C.blue : C.card2, border: "1px solid " + C.border, cursor: "pointer" }} onClick={function() { setWater(idx < water ? idx : idx + 1); }} />;
                })}
              </div>
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1.5 }}>TODAYS WORKOUT</p>
              <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800 }}>{todayPlan.emoji} {todayPlan.name}</h3>
              {todayPlan.exercises.slice(0, 3).map(function(ex, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />
                    <span style={{ fontSize: 13, color: C.sub, flex: 1 }}>{ex.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{ex.sets}x{ex.reps}</span>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button style={Object.assign({}, S.btn, { flex: 1, marginTop: 0 })} onClick={function() { setScreen("workout"); }}>Start Workout</button>
                <button style={Object.assign({}, S.btn, { flex: 1, marginTop: 0, background: C.card2, color: C.text, border: "1px solid " + C.border })} onClick={function() { setScreen("chat"); }}>Ask Coach 🤖</button>
              </div>
            </div>
            {bmi && (
              <div style={{ background: "linear-gradient(135deg,rgba(232,255,71,0.09),rgba(255,107,53,0.06))", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 18, padding: 18, marginBottom: 14, cursor: "pointer" }} onClick={function() { setShowBMI(!showBMI); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1.5 }}>YOUR BMI</p>
                    <p style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>{bmi}</p>
                    {bi && <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 700, color: bi.color }}>{bi.label}</p>}
                  </div>
                  {tdee && (
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Daily Target</p>
                      <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 900, color: C.accent2 }}>{tdee}</p>
                      <p style={{ margin: 0, fontSize: 11, color: C.sub }}>kcal/day</p>
                    </div>
                  )}
                </div>
                {showBMI && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid " + C.border }}>
                    {[{ r: "< 18.5", l: "Underweight", c: C.blue }, { r: "18.5-24.9", l: "Normal", c: C.green }, { r: "25-29.9", l: "Overweight", c: C.accent }, { r: "30+", l: "Obese", c: C.accent2 }].map(function(b, i) {
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: C.sub }}>{b.r}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: b.c }}>{b.l}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {!isPro && (
              <div style={{ background: "linear-gradient(135deg,rgba(232,255,71,0.1),rgba(255,107,53,0.08))", border: "1px solid rgba(232,255,71,0.3)", borderRadius: 16, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={function() { setScreen("paywall"); setPayStep("plans"); }}>
                <span style={{ fontSize: 24 }}>⚡</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.accent }}>Upgrade to Pro</p>
                  <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Train like a champion with SJ AI Coach</p>
                </div>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>Rs.829/mo</span>
              </div>
            )}
            <div style={{ background: "linear-gradient(135deg,rgba(255,107,53,0.12),rgba(167,139,250,0.07))", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 16, padding: 16, marginBottom: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: C.accent2, letterSpacing: 1 }}>TODAYS TIP</p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                {["Drink water before every meal to reduce hunger by 20%!", "Sleep 7-9 hours. Muscle grows during recovery.", "Progressive overload: add 2.5kg every 2 weeks.", "Your mindset is your strongest muscle."][new Date().getDay() % 4]}
              </p>
            </div>

            {/* Sleep Recovery Card */}
            <div style={{ background: "linear-gradient(135deg,rgba(96,165,250,0.12),rgba(167,139,250,0.08))", border: "1px solid " + todaySleepLevel.color + "44", borderRadius: 18, padding: 18, marginBottom: 14, cursor: "pointer" }} onClick={function() { setScreen("sleep"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: todaySleepLevel.color, letterSpacing: 1.5 }}>SLEEP AND RECOVERY</p>
                  <p style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 900, color: C.text }}>{todaySleep.hours}h sleep</p>
                  <div style={{ display: "inline-block", background: todaySleepLevel.color + "22", border: "1px solid " + todaySleepLevel.color + "66", borderRadius: 20, padding: "3px 10px" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: todaySleepLevel.color }}>{todaySleepLevel.intensity}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 11, color: C.sub }}>7-day avg</p>
                  <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: C.blue }}>{avgSleep}h</p>
                </div>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{todaySleepLevel.message}</p>
              <p style={{ margin: "6px 0 0", fontSize: 11, color: C.accent, fontWeight: 700 }}>Todays workout: {todaySleepLevel.mod}</p>
            </div>

            {/* Daily Challenge Preview */}
            <div style={{ background: "linear-gradient(135deg,rgba(232,255,71,0.1),rgba(255,107,53,0.08))", border: "1px solid rgba(232,255,71,0.25)", borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1.5 }}>SJ DAILY CHALLENGE</p>
                <span style={{ background: challengeDone ? C.green + "22" : "rgba(232,255,71,0.15)", color: challengeDone ? C.green : C.accent, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8 }}>{challengeDone ? "DONE!" : "+" + todayChallenge.xp + " XP"}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800 }}>{todayChallenge.emoji} {todayChallenge.title}</p>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: C.sub }}>{todayChallenge.desc}</p>
              <button style={Object.assign({}, S.btn, { marginTop: 0, background: challengeDone ? C.green : C.accent, color: "#000" })} onClick={function() { setScreen("challenge"); }}>
                {challengeDone ? "Challenge Complete!" : "Accept Challenge"}
              </button>
            </div>

            {/* Voice Coach Button */}
            <div style={{ background: "linear-gradient(135deg,rgba(167,139,250,0.12),rgba(232,255,71,0.06))", border: "1px solid rgba(167,139,250,0.35)", borderRadius: 18, padding: 18 }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: 1.5 }}>VOICE AI COACH</p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: C.sub }}>Speak to SJ AI Coach hands-free. Ask workout tips, get motivation!</p>
              <button style={Object.assign({}, S.btn, { marginTop: 0, background: voiceOn ? "#ef4444" : C.purple, color: "#fff" })} onClick={voiceOn ? stopVoice : startVoiceCoach}>
                {voiceOn ? (voiceStatus === "listening" ? "Listening... Tap to stop" : "Processing...") : "Tap to Speak to Coach"}
              </button>
              {transcript && <p style={{ margin: "8px 0 0", fontSize: 12, color: C.sub, fontStyle: "italic" }}>You said: {transcript}</p>}
            </div>

          </div>
        )}

        {screen === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 12px", borderBottom: "1px solid " + C.border, background: C.bg, flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg," + C.accent + "," + C.accent2 + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>SJ AI Coach</p>
                <p style={{ margin: 0, fontSize: 11, color: C.green }}>Online</p>
              </div>
              {!isPro ? (
                <div style={{ background: "rgba(232,255,71,0.12)", border: "1px solid rgba(232,255,71,0.3)", borderRadius: 10, padding: "4px 10px", cursor: "pointer" }} onClick={function() { setScreen("paywall"); }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.accent }}>{3 - msgCount} free left</p>
                  <p style={{ margin: 0, fontSize: 9, color: C.sub }}>Tap to upgrade</p>
                </div>
              ) : (
                <div style={{ background: "rgba(232,255,71,0.1)", borderRadius: 10, padding: "4px 10px" }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: isElite ? C.purple : C.accent }}>{isElite ? "ELITE" : "PRO"}</p>
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 140 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 48 }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🏋</div>
                  <p style={{ color: C.sub, fontSize: 15, lineHeight: 1.6 }}>Your SJ AI coach is ready! Ask anything about fitness.</p>
                </div>
              )}
              {messages.map(function(m, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, maxWidth: "86%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                    {m.role === "assistant" && <span style={{ fontSize: 18, flexShrink: 0, marginTop: 4 }}>🤖</span>}
                    <div style={{ padding: "10px 14px", borderRadius: 16, fontSize: 13, lineHeight: 1.6, background: m.role === "user" ? C.accent : C.card2, color: m.role === "user" ? "#000" : C.text, border: m.role === "user" ? "none" : "1px solid " + C.border }}>
                      {m.content.split("\n").map(function(l, j) { return <p key={j} style={{ margin: "1px 0" }}>{l}</p>; })}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignSelf: "flex-start" }}>
                  <span style={{ fontSize: 18 }}>🤖</span>
                  <div style={{ background: C.card2, padding: "12px 16px", borderRadius: 16, border: "1px solid " + C.border, display: "flex", gap: 5, alignItems: "center" }}>
                    {[1, 2, 3].map(function(d) {
                      return <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "inline-block", animation: "dot" + d + " 1.2s ease-in-out infinite" }} />;
                    })}
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>
            <div style={{ position: "sticky", bottom: 0, background: C.bg, borderTop: "1px solid " + C.border, padding: "8px 14px" }}>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 8 }}>
                {["Give me a workout 💪", "Meal plan 🥗", "Motivate me 🔥", "Rest day tips 🧘"].map(function(q, i) {
                  return <div key={i} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: "5px 11px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", color: C.sub, flexShrink: 0 }} onClick={function() { sendMsg(q); }}>{q}</div>;
                })}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ flex: 1, background: C.card, border: "1px solid " + C.border, borderRadius: 22, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none" }} placeholder="Ask your SJ coach..." value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter" && input.trim()) sendMsg(input.trim()); }} />
                <button style={{ background: C.accent, border: "none", borderRadius: "50%", width: 42, height: 42, fontSize: 16, cursor: "pointer", fontWeight: 900 }} onClick={function() { if (input.trim()) sendMsg(input.trim()); }} disabled={loading}>▶</button>
              </div>
            </div>
          </div>
        )}

        {screen === "workout" && (
          <div style={S.pg}>
            <h2 style={S.title}>Workout Plan</h2>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 16, marginBottom: 16 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>REST TIMER</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
                  <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="44" cy="44" r={r2} fill="none" stroke={C.border} strokeWidth="5" />
                    <circle cx="44" cy="44" r={r2} fill="none" stroke={timerSec > 10 ? C.accent : C.accent2} strokeWidth="5" strokeDasharray={circ} strokeDashoffset={circ - (circ * timerPct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: timerSec > 10 ? C.text : C.accent2 }}>{timerSec}</span>
                    <span style={{ fontSize: 8, color: C.sub }}>sec</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", fontSize: 12, color: C.sub }}>{timerLabel}</p>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <button style={{ flex: 1, background: timerOn ? C.accent2 : C.accent, color: "#000", border: "none", borderRadius: 10, padding: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }} onClick={function() { setTimerOn(!timerOn); }}>{timerOn ? "Pause" : "Start"}</button>
                    <button style={{ background: C.card2, border: "1px solid " + C.border, borderRadius: 10, padding: "8px 12px", color: C.sub, fontSize: 14, cursor: "pointer" }} onClick={function() { setTimerSec(timerTotal); setTimerOn(false); }}>Reset</button>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[30, 60, 90, 120].map(function(s) {
                      return <button key={s} style={{ flex: 1, background: C.card2, border: "1px solid " + C.border, borderRadius: 8, padding: 5, fontSize: 10, color: C.sub, cursor: "pointer" }} onClick={function() { startTimer(s, s + "s Rest"); }}>{s}s</button>;
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14 }}>
              {workoutPlan.map(function(d, i) {
                return (
                  <div key={i} style={{ flexShrink: 0, background: selDay === i ? C.accent : C.card, border: "1px solid " + (selDay === i ? C.accent : C.border), borderRadius: 12, padding: "7px 11px", cursor: "pointer", textAlign: "center", minWidth: 46 }} onClick={function() { setSelDay(i); }}>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: selDay === i ? "#000" : C.sub }}>{d.day}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 14 }}>{d.emoji}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>{workoutPlan[selDay].name}</h3>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: C.sub }}>{workoutPlan[selDay].duration} | {workoutPlan[selDay].exercises.length} exercises</p>
              {workoutPlan[selDay].exercises.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: C.sub }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>😴</div>
                  <p style={{ margin: 0 }}>Rest day - recover!</p>
                </div>
              ) : workoutPlan[selDay].exercises.map(function(ex, i) {
                var key = selDay + "-" + i;
                var done = doneEx[key];
                return (
                  <div key={i} style={{ background: done ? "rgba(74,222,128,0.07)" : C.card2, border: "1px solid " + (done ? C.green : C.border), borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: done ? C.green : C.card, border: "2px solid " + (done ? C.green : C.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, cursor: "pointer", color: "#000", fontWeight: 900 }} onClick={function() { var nd = Object.assign({}, doneEx); nd[key] = !nd[key]; setDoneEx(nd); }}>
                        {done ? "✓" : ""}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: done ? C.green : C.text }}>{ex.name}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: C.sub }}>{ex.sets} sets | {ex.reps} | Rest: {ex.rest}</p>
                      </div>
                      <button style={{ background: "none", border: "1px solid " + C.border, borderRadius: 8, padding: "4px 8px", fontSize: 10, color: C.sub, cursor: "pointer" }} onClick={function() { startTimer(parseInt(ex.rest) || 30, "Rest - " + ex.name); }}>Timer</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {screen === "nutrition" && (
          <div style={S.pg}>
            <h2 style={S.title}>Nutrition Plan</h2>
            <div style={{ background: "linear-gradient(135deg,rgba(255,107,53,0.14),rgba(232,255,71,0.07))", border: "1px solid rgba(255,107,53,0.28)", borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: C.accent2, letterSpacing: 1.5 }}>TODAYS CALORIES</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 36, fontWeight: 900 }}>{totalCal}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.sub }}>of {tdee || 2000} kcal target</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.accent }}>{Math.max(0, (tdee || 2000) - totalCal)}</p>
                  <p style={{ margin: 0, fontSize: 11, color: C.sub }}>remaining</p>
                </div>
              </div>
              <div style={{ background: C.border, borderRadius: 6, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg," + C.accent2 + "," + C.accent + ")", borderRadius: 6, width: Math.min(100, (totalCal / (tdee || 2000)) * 100) + "%", transition: "width 0.5s" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[{ l: "Protein", v: totalP + "g", c: C.blue, i: "💪" }, { l: "Carbs", v: totalCb + "g", c: C.accent, i: "🌾" }, { l: "Fat", v: totalFt + "g", c: C.accent2, i: "🥑" }].map(function(m, i) {
                return (
                  <div key={i} style={{ flex: 1, background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "12px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 16 }}>{m.i}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: m.c, marginTop: 2 }}>{m.v}</div>
                    <div style={{ fontSize: 9, color: C.sub, marginTop: 1 }}>{m.l}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto" }}>
              {["breakfast", "lunch", "dinner", "snacks"].map(function(t) {
                return <div key={t} style={{ flexShrink: 0, background: mealTab === t ? C.accent : C.card, border: "1px solid " + (mealTab === t ? C.accent : C.border), borderRadius: 12, padding: "6px 13px", cursor: "pointer", fontSize: 12, fontWeight: 700, color: mealTab === t ? "#000" : C.sub, textTransform: "capitalize" }} onClick={function() { setMealTab(t); }}>{t}</div>;
              })}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[{ id: "all", label: "All", color: C.sub }, { id: "veg", label: "🟢 Veg", color: C.green }, { id: "nonveg", label: "🔴 Non-Veg", color: C.accent2 }].map(function(f) {
                return (
                  <div key={f.id} style={{ flex: 1, textAlign: "center", padding: "8px 6px", borderRadius: 12, cursor: "pointer", border: "2px solid " + (dietFilter === f.id ? f.color : C.border), background: dietFilter === f.id ? "rgba(255,255,255,0.05)" : "transparent" }} onClick={function() { setDietFilter(f.id); }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: dietFilter === f.id ? f.color : C.sub }}>{f.label}</span>
                  </div>
                );
              })}
            </div>
            {(meals[mealTab] || []).filter(function(meal) { if (dietFilter === "veg") return meal.veg; if (dietFilter === "nonveg") return !meal.veg; return true; }).map(function(meal, i) {
              return (
                <div key={i} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: 16, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{meal.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{meal.name}</p>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: meal.veg ? C.green : C.accent2, flexShrink: 0, display: "inline-block" }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: meal.veg ? C.green : C.accent2 }}>{meal.veg ? "VEG" : "NON-VEG"}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{meal.cal} kcal</p>
                    </div>
                    <button style={{ background: C.accent, border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: 800, color: "#000", cursor: "pointer" }} onClick={function() { setLogged(logged.concat([meal])); }}>Log</button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[{ l: "Protein", v: meal.protein + "g", c: C.blue }, { l: "Carbs", v: meal.carbs + "g", c: C.accent }, { l: "Fat", v: meal.fat + "g", c: C.accent2 }].map(function(n, j) {
                      return (
                        <div key={j} style={{ flex: 1, background: C.card2, borderRadius: 10, padding: 6, textAlign: "center" }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: n.c }}>{n.v}</p>
                          <p style={{ margin: 0, fontSize: 9, color: C.sub }}>{n.l}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {logged.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 1 }}>LOGGED TODAY</p>
                {logged.map(function(m, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: "1px solid rgba(74,222,128,0.3)", borderRadius: 12, padding: "9px 13px", marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{m.icon}</span>
                      <span style={{ flex: 1, fontSize: 13 }}>{m.name}</span>
                      <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>{m.cal} kcal</span>
                      <span style={{ cursor: "pointer", color: C.sub, fontSize: 18, lineHeight: 1 }} onClick={function() { setLogged(logged.filter(function(_, j) { return j !== i; })); }}>x</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {screen === "progress" && (
          <div style={S.pg}>
            <h2 style={S.title}>My Progress</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[{ l: "Starting", v: ((progLog[0] && progLog[0].weight) || 0) + "kg", i: "📍", c: C.sub }, { l: "Current", v: ((progLog[progLog.length - 1] && progLog[progLog.length - 1].weight) || 0) + "kg", i: "⚡", c: C.accent }, { l: "Lost", v: (((progLog[0] && progLog[0].weight) || 0) - ((progLog[progLog.length - 1] && progLog[progLog.length - 1].weight) || 0)).toFixed(1) + "kg", i: "🔥", c: C.green }].map(function(s, i) {
                return (
                  <div key={i} style={{ flex: 1, background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "14px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{s.i}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: s.c, marginTop: 4 }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>{s.l}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>WEIGHT TREND (kg)</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 100 }}>
                {progLog.map(function(p, i) {
                  var mn = Math.min.apply(null, progLog.map(function(x) { return x.weight; }));
                  var mx = Math.max.apply(null, progLog.map(function(x) { return x.weight; }));
                  var h = mx === mn ? 50 : ((p.weight - mn) / (mx - mn)) * 75 + 20;
                  var last = i === progLog.length - 1;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <span style={{ fontSize: 9, color: last ? C.accent : C.sub, fontWeight: last ? 900 : 400 }}>{p.weight}</span>
                      <div style={{ width: "100%", height: h, background: last ? C.accent : "rgba(232,255,71,0.28)", borderRadius: "4px 4px 0 0" }} />
                      <span style={{ fontSize: 8, color: C.sub }}>{p.date.replace("Mar ", "").replace("Apr ", "")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18 }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>LOG TODAYS WEIGHT</p>
              <div style={{ display: "flex", gap: 10 }}>
                <input style={Object.assign({}, S.inp, { flex: 1 })} type="number" placeholder="Weight (kg)" value={newW} onChange={function(e) { setNewW(e.target.value); }} />
                <button style={{ background: C.accent, border: "none", borderRadius: 12, padding: "0 18px", fontWeight: 800, color: "#000", cursor: "pointer", fontSize: 13 }} onClick={function() { if (newW) { setProgLog(progLog.concat([{ date: "Apr " + new Date().getDate(), weight: parseFloat(newW), workouts: 1 }])); setNewW(""); } }}>Log</button>
              </div>
            </div>
          </div>
        )}

        {screen === "paywall" && (
          <div style={{ minHeight: "100%", background: C.bg }}>
            {payStep === "plans" && (
              <div style={S.pg}>
                <div style={{ textAlign: "center", marginBottom: 24, paddingTop: 4 }}>
                  <div style={{ display: "inline-block", background: "rgba(232,255,71,0.12)", border: "1px solid rgba(232,255,71,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1, marginBottom: 12 }}>UPGRADE TO SJ PRO</div>
                  <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px" }}>Train with Indias Best <span style={{ color: C.accent }}>Mr India 2022</span></h2>
                  <p style={{ color: C.sub, fontSize: 14, margin: 0 }}>Join 50,000+ members trained by Suryakant Jadhav</p>
                </div>
                <div style={{ display: "flex", background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: 4, marginBottom: 20 }}>
                  {["monthly", "annual"].map(function(b) {
                    return (
                      <div key={b} style={{ flex: 1, textAlign: "center", padding: 9, borderRadius: 11, cursor: "pointer", background: billing === b ? C.card2 : "transparent", border: billing === b ? "1px solid " + C.border : "1px solid transparent" }} onClick={function() { setBilling(b); }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: billing === b ? C.text : C.sub, textTransform: "capitalize" }}>{b}</span>
                        {b === "annual" && <span style={{ marginLeft: 6, background: "rgba(74,222,128,0.2)", color: C.green, fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 8 }}>-40%</span>}
                      </div>
                    );
                  })}
                </div>
                {PLANS.map(function(p) {
                  var price = billing === "annual" && p.price > 0 ? (p.price * 0.6).toFixed(2) : p.price;
                  var inr = Math.round(parseFloat(price) * 83);
                  var isSel = selPlan === p.id;
                  return (
                    <div key={p.id} style={{ background: isSel ? "rgba(255,255,255,0.04)" : C.card, border: "2px solid " + (isSel ? p.color : C.border), borderRadius: 20, padding: 20, marginBottom: 12, cursor: "pointer", position: "relative" }} onClick={function() { setSelPlan(p.id); }}>
                      {p.badge && <div style={{ position: "absolute", top: -10, right: 16, background: p.color, color: "#000", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 8 }}>{p.badge}</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div>
                          <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 900, color: p.color }}>{p.name}</p>
                          {p.price > 0 ? (
                            <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.text }}>Rs.{inr}<span style={{ fontSize: 12, color: C.sub, fontWeight: 400 }}>/mo</span></p>
                          ) : (
                            <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.sub }}>Free</p>
                          )}
                        </div>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid " + (isSel ? p.color : C.border), background: isSel ? p.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isSel && <span style={{ fontSize: 12, color: "#000", fontWeight: 900 }}>✓</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {p.features.slice(0, isSel ? p.features.length : 4).map(function(f, fi) {
                          return (
                            <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 13, color: f.ok ? C.green : C.border, flexShrink: 0 }}>{f.ok ? "✓" : "x"}</span>
                              <span style={{ fontSize: 13, color: f.ok ? C.text : C.sub }}>{f.text}</span>
                            </div>
                          );
                        })}
                        {!isSel && p.features.length > 4 && <span style={{ fontSize: 12, color: C.sub }}>+{p.features.length - 4} more...</span>}
                      </div>
                    </div>
                  );
                })}
                {selPlan !== "free" ? (
                  <button style={Object.assign({}, S.btn, { background: selPlan === "elite" ? C.purple : C.accent, color: "#000", marginTop: 12 })} onClick={function() { setPayStep("checkout"); }}>
                    Continue - Rs.{cINR}/mo
                  </button>
                ) : (
                  <button style={Object.assign({}, S.btn, { background: C.card2, color: C.text, border: "1px solid " + C.border, marginTop: 12 })} onClick={function() { setSub({ plan: "free", billing: "monthly", nextBilling: null }); setScreen("home"); }}>
                    Continue with Free
                  </button>
                )}
                <p style={{ textAlign: "center", color: C.sub, fontSize: 11, margin: "10px 0 0" }}>Secure payment | Cancel anytime | No hidden fees</p>
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <span style={{ color: C.sub, fontSize: 12, cursor: "pointer" }} onClick={function() { setScreen("home"); }}>Back to Home</span>
                </div>
              </div>
            )}
            {payStep === "checkout" && (
              <div style={S.pg}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ cursor: "pointer", fontSize: 20, color: C.sub }} onClick={function() { setPayStep("plans"); }}>Back</span>
                  <h2 style={Object.assign({}, S.title, { margin: 0 })}>Payment</h2>
                </div>

                {/* Order Summary */}
                <div style={{ background: "linear-gradient(135deg,rgba(232,255,71,0.1),rgba(255,107,53,0.06))", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 18, padding: 18, marginBottom: 18 }}>
                  <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: cPlan.color, letterSpacing: 1.5 }}>ORDER SUMMARY</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Fit with SJ {cPlan.name}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: cPlan.color }}>Rs.{Math.round(parseFloat(cPrice) * 83)}/mo</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: C.sub }}>
                    <span>Billing</span>
                    <span style={{ textTransform: "capitalize" }}>{billing}</span>
                  </div>
                  <div style={{ borderTop: "1px solid " + C.border, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Total today</span>
                    <span style={{ fontSize: 20, fontWeight: 900 }}>Rs.{cINR}</span>
                  </div>
                  <div style={{ marginTop: 10, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>💳</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.green }}>Pay to: {OWNER_NAME}</p>
                      <p style={{ margin: 0, fontSize: 11, color: C.sub }}>UPI: {OWNER_UPI}</p>
                    </div>
                  </div>
                </div>

                {/* Scan QR */}
                <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 16, textAlign: "center" }}>
                  <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>SCAN TO PAY</p>
                  <div style={{ width: 160, height: 160, background: "#fff", borderRadius: 16, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <rect width="140" height="140" fill="white"/>
                      <rect x="5" y="5" width="42" height="42" rx="4" fill="none" stroke="#000" strokeWidth="4"/>
                      <rect x="15" y="15" width="22" height="22" rx="2" fill="#000"/>
                      <rect x="93" y="5" width="42" height="42" rx="4" fill="none" stroke="#000" strokeWidth="4"/>
                      <rect x="103" y="15" width="22" height="22" rx="2" fill="#000"/>
                      <rect x="5" y="93" width="42" height="42" rx="4" fill="none" stroke="#000" strokeWidth="4"/>
                      <rect x="15" y="103" width="22" height="22" rx="2" fill="#000"/>
                      <rect x="55" y="5" width="5" height="5" fill="#000"/>
                      <rect x="65" y="5" width="5" height="5" fill="#000"/>
                      <rect x="75" y="5" width="5" height="5" fill="#000"/>
                      <rect x="55" y="15" width="5" height="5" fill="#000"/>
                      <rect x="75" y="15" width="5" height="5" fill="#000"/>
                      <rect x="55" y="25" width="5" height="5" fill="#000"/>
                      <rect x="65" y="25" width="5" height="5" fill="#000"/>
                      <rect x="55" y="55" width="5" height="5" fill="#000"/>
                      <rect x="65" y="55" width="5" height="5" fill="#000"/>
                      <rect x="75" y="55" width="5" height="5" fill="#000"/>
                      <rect x="85" y="55" width="5" height="5" fill="#000"/>
                      <rect x="55" y="65" width="5" height="5" fill="#000"/>
                      <rect x="75" y="65" width="5" height="5" fill="#000"/>
                      <rect x="85" y="65" width="5" height="5" fill="#000"/>
                      <rect x="55" y="75" width="5" height="5" fill="#000"/>
                      <rect x="65" y="75" width="5" height="5" fill="#000"/>
                      <rect x="85" y="75" width="5" height="5" fill="#000"/>
                      <rect x="55" y="85" width="5" height="5" fill="#000"/>
                      <rect x="75" y="85" width="5" height="5" fill="#000"/>
                      <rect x="55" y="95" width="5" height="5" fill="#000"/>
                      <rect x="65" y="95" width="5" height="5" fill="#000"/>
                      <rect x="75" y="95" width="5" height="5" fill="#000"/>
                      <rect x="5" y="55" width="5" height="5" fill="#000"/>
                      <rect x="15" y="55" width="5" height="5" fill="#000"/>
                      <rect x="25" y="65" width="5" height="5" fill="#000"/>
                      <rect x="35" y="55" width="5" height="5" fill="#000"/>
                      <rect x="5" y="75" width="5" height="5" fill="#000"/>
                      <rect x="15" y="75" width="5" height="5" fill="#000"/>
                      <rect x="25" y="75" width="5" height="5" fill="#000"/>
                      <rect x="35" y="65" width="5" height="5" fill="#000"/>
                      <rect x="35" y="75" width="5" height="5" fill="#000"/>
                      <rect x="93" y="55" width="5" height="5" fill="#000"/>
                      <rect x="103" y="65" width="5" height="5" fill="#000"/>
                      <rect x="113" y="55" width="5" height="5" fill="#000"/>
                      <rect x="123" y="55" width="5" height="5" fill="#000"/>
                      <rect x="93" y="75" width="5" height="5" fill="#000"/>
                      <rect x="113" y="75" width="5" height="5" fill="#000"/>
                      <rect x="123" y="65" width="5" height="5" fill="#000"/>
                      <rect x="103" y="105" width="5" height="5" fill="#000"/>
                      <rect x="113" y="95" width="5" height="5" fill="#000"/>
                      <rect x="123" y="105" width="5" height="5" fill="#000"/>
                      <rect x="113" y="115" width="5" height="5" fill="#000"/>
                      <rect x="103" y="125" width="5" height="5" fill="#000"/>
                      <rect x="123" y="125" width="5" height="5" fill="#000"/>
                    </svg>
                  </div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: C.text }}>{OWNER_UPI}</p>
                  <p style={{ margin: "0 0 10px", fontSize: 11, color: C.sub }}>Scan with any UPI app | Amount: Rs.{cINR}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                    {["🟢", "💜", "🔵", "🇮🇳"].map(function(e, i) { return <span key={i} style={{ fontSize: 22 }}>{e}</span>; })}
                  </div>
                </div>

                {/* OR divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>OR OPEN APP DIRECTLY</span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                {/* UPI App Buttons — real deep links */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {UPI_APPS.map(function(app) {
                    return (
                      <div key={app.id} style={{ background: upiApp === app.id ? app.bg : C.card2, border: "2px solid " + (upiApp === app.id ? app.bd : C.border), borderRadius: 16, padding: "14px 8px", textAlign: "center", cursor: "pointer" }}
                        onClick={function() {
                          setUpiApp(app.id);
                          var link = buildUPILink(app.id, cINR, "FitSJ " + cPlan.name + " Subscription");
                          window.location.href = link;
                          // Mark payment pending - user comes back after paying
                          setPayLoading(true);
                          setTimeout(function() {
                            setPayLoading(false);
                            var now = new Date(); var next = new Date(now);
                            next.setMonth(next.getMonth() + (billing === "annual" ? 12 : 1));
                            setSub({ plan: selPlan, billing: billing, nextBilling: next.toLocaleDateString() });
                            setPayStep("success");
                          }, 5000);
                        }}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{app.emoji}</div>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: upiApp === app.id ? app.color : C.sub }}>{app.name}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Manual UPI ID entry */}
                <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 16 }}>
                  <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>PAY TO UPI ID</p>
                  <div style={{ background: C.card2, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: C.sub }}>Send payment to</p>
                      <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 800, color: C.accent }}>{OWNER_UPI}</p>
                    </div>
                    <button style={{ background: "none", border: "1px solid " + C.border, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: C.sub, cursor: "pointer" }}
                      onClick={function() {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(OWNER_UPI);
                        }
                      }}>Copy</button>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
                    1. Open any UPI app on your phone<br/>
                    2. Go to Send Money / Pay<br/>
                    3. Enter UPI ID: <span style={{ color: C.accent, fontWeight: 700 }}>{OWNER_UPI}</span><br/>
                    4. Enter amount: <span style={{ color: C.accent, fontWeight: 700 }}>Rs.{cINR}</span><br/>
                    5. Complete payment and tap below
                  </p>
                </div>

                {/* After manual payment - confirm button */}
                <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>PAID ALREADY?</p>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: C.sub }}>Enter your UPI Transaction ID or screenshot reference:</p>
                  <input style={Object.assign({}, S.inp, { marginBottom: 10 })} placeholder="Transaction ID (e.g. T2506XXXXXXXX)" value={upiId} onChange={function(e) { setUpiId(e.target.value); }} />
                  <button style={Object.assign({}, S.btn, { background: upiId.length > 5 ? C.green : C.card2, color: upiId.length > 5 ? "#000" : C.sub, marginTop: 0, opacity: upiId.length > 5 ? 1 : 0.6 })}
                    disabled={upiId.length < 5}
                    onClick={function() {
                      var now = new Date(); var next = new Date(now);
                      next.setMonth(next.getMonth() + (billing === "annual" ? 12 : 1));
                      setSub({ plan: selPlan, billing: billing, nextBilling: next.toLocaleDateString() });
                      setPayStep("success");
                    }}>
                    Confirm Payment - Rs.{cINR} Paid
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 8 }}>
                  {["UPI Secure", "RBI Regulated", "Instant Access"].map(function(t, i) {
                    return <span key={i} style={{ fontSize: 10, color: C.sub }}>{t}</span>;
                  })}
                </div>
                <p style={{ textAlign: "center", color: C.sub, fontSize: 11, margin: 0 }}>Having trouble? WhatsApp: {OWNER_PHONE}</p>
              </div>
            )}
            {payStep === "success" && (
              <div style={Object.assign({}, S.pg, { textAlign: "center", paddingTop: 60 })}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(74,222,128,0.15)", border: "2px solid " + C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, margin: "0 auto 20px" }}>🎉</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px" }}>Welcome to <span style={{ color: cPlan.color }}>Fit with SJ {cPlan.name}!</span></h2>
                <p style={{ color: C.sub, fontSize: 15, margin: "0 0 28px", lineHeight: 1.6 }}>Your subscription is active. All premium features unlocked!</p>
                <button style={S.btn} onClick={function() { setPayStep("plans"); setScreen("home"); }}>Start Training Now!</button>
              </div>
            )}
          </div>
        )}

        {screen === "profile" && (
          <div style={S.pg}>
            <div style={{ textAlign: "center", padding: "20px 0 20px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg," + C.accent + "," + C.accent2 + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 12px" }}>💪</div>
                {isPro && <div style={{ position: "absolute", bottom: 10, right: -4, background: isElite ? C.purple : C.accent, borderRadius: 10, padding: "2px 8px", fontSize: 9, fontWeight: 900, color: "#000" }}>{isElite ? "ELITE" : "PRO"}</div>}
              </div>
              <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 900 }}>{profile.name || "Athlete"}</h2>
              <p style={{ margin: 0, color: C.accent, fontSize: 14, fontWeight: 700 }}>{(GOALS.find(function(g) { return g.id === profile.goal; }) || { label: "Fitness Warrior" }).label}</p>
            </div>
            <div style={{ background: isPro ? "linear-gradient(135deg,rgba(232,255,71,0.1),rgba(255,107,53,0.05))" : "rgba(255,255,255,0.02)", border: "1px solid " + (isPro ? C.accent : C.border), borderRadius: 18, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: isPro ? C.accent : C.sub, letterSpacing: 1 }}>YOUR PLAN</p>
                  <p style={{ margin: "0 0 2px", fontSize: 18, fontWeight: 900 }}>Fit with SJ {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}</p>
                  {!isPro && <p style={{ margin: 0, fontSize: 11, color: C.sub }}>AI messages today: {msgCount}/3</p>}
                </div>
                {!isPro ? (
                  <button style={{ background: C.accent, border: "none", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 900, color: "#000", cursor: "pointer" }} onClick={function() { setScreen("paywall"); setPayStep("plans"); }}>Upgrade</button>
                ) : (
                  <div style={{ background: "rgba(232,255,71,0.15)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>{isElite ? "👑" : "⭐"}</div>
                    <div style={{ fontSize: 9, color: isElite ? C.purple : C.accent, fontWeight: 700, marginTop: 2 }}>ACTIVE</div>
                  </div>
                )}
              </div>
              {isPro && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid " + C.border, display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, background: "none", border: "1px solid " + C.border, borderRadius: 10, padding: 7, fontSize: 11, color: C.sub, cursor: "pointer" }} onClick={function() { setScreen("paywall"); setPayStep("plans"); }}>Change Plan</button>
                  <button style={{ flex: 1, background: "none", border: "1px solid rgba(255,100,100,0.3)", borderRadius: 10, padding: 7, fontSize: 11, color: "#ff6666", cursor: "pointer" }} onClick={function() { setSub({ plan: "free", billing: "monthly", nextBilling: null }); }}>Cancel Plan</button>
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[{ i: "🎂", v: profile.age || "-", l: "Age" }, { i: "⚖", v: profile.weight ? profile.weight + "kg" : "-", l: "Weight" }, { i: "📏", v: profile.height ? profile.height + "cm" : "-", l: "Height" }, { i: "📊", v: bmi || "-", l: "BMI" }, { i: "🔥", v: streak + " days", l: "Streak" }, { i: "🎯", v: tdee ? tdee + " kcal" : "-", l: "Daily Target" }].map(function(s, i) {
                return (
                  <div key={i} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <span style={{ fontSize: 22 }}>{s.i}</span>
                    <span style={{ fontSize: 15, fontWeight: 900 }}>{s.v}</span>
                    <span style={{ fontSize: 10, color: C.sub }}>{s.l}</span>
                  </div>
                );
              })}
            </div>
            <button style={Object.assign({}, S.btn, { background: C.card2, color: C.text, border: "1px solid " + C.border })} onClick={function() { setProfile({ name: "", age: "", weight: "", height: "", goal: "", equipment: "" }); setMessages([]); setScreen("onboard"); }}>
              Edit Profile
            </button>
          </div>
        )}

        {screen === "trainer" && (
          <div style={S.pg}>
            <div style={{ background: "linear-gradient(135deg,rgba(232,255,71,0.12),rgba(255,107,53,0.1))", border: "1px solid rgba(232,255,71,0.2)", borderRadius: 22, padding: 24, marginBottom: 18, textAlign: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg," + C.accent + "," + C.accent2 + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, margin: "0 auto 14px", border: "3px solid rgba(232,255,71,0.4)" }}>💪</div>
              <div style={{ display: "inline-block", background: "rgba(232,255,71,0.15)", border: "1px solid " + C.accent, borderRadius: 20, padding: "3px 14px", fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: 1.5, marginBottom: 10 }}>MR INDIA 2022</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>Suryakant Jadhav</h2>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: C.sub }}>Elite Fitness Coach and Champion</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                {[{ v: "8+", l: "Years Exp" }, { v: "5000+", l: "Clients" }, { v: "12+", l: "Titles" }].map(function(s, i) {
                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.accent }}>{s.v}</p>
                      <p style={{ margin: 0, fontSize: 10, color: C.sub }}>{s.l}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>ABOUT THE TRAINER</p>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: C.text, lineHeight: 1.7 }}>Suryakant Jadhav is Indias elite fitness champion, crowned <span style={{ color: C.accent, fontWeight: 700 }}>Mr India 2022</span>. With over 8 years of professional experience, he has transformed 5000+ lives through science-backed training.</p>
              <p style={{ margin: 0, fontSize: 14, color: C.sub, lineHeight: 1.7 }}>His philosophy combines strength, nutrition, and mindset - building champions from the inside out.</p>
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>CHAMPIONSHIPS</p>
              {[{ year: "2022", title: "Mr India", org: "National Bodybuilding Federation", icon: "🥇" }, { year: "2021", title: "Mr Maharashtra", org: "State Championship", icon: "🥇" }, { year: "2020", title: "Best Physique West Zone", org: "Regional Championship", icon: "🥈" }, { year: "2019", title: "Mr Mumbai", org: "City Championship", icon: "🥇" }, { year: "2018", title: "Best Newcomer", org: "State Federation", icon: "⭐" }].map(function(a, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid " + C.border : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(232,255,71,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{a.title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: C.sub }}>{a.org}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{a.year}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>EXPERTISE</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ icon: "🏋", title: "Strength Training", desc: "Power and muscle building" }, { icon: "🔥", title: "Fat Loss", desc: "Science-based cutting" }, { icon: "🥗", title: "Sports Nutrition", desc: "Meal planning and macros" }, { icon: "🧠", title: "Mental Coaching", desc: "Mindset and motivation" }, { icon: "🏃", title: "Functional Fitness", desc: "Athletic performance" }, { icon: "🧘", title: "Recovery and Yoga", desc: "Flexibility and mobility" }].map(function(e, i) {
                  return (
                    <div key={i} style={{ background: C.card2, border: "1px solid " + C.border, borderRadius: 14, padding: 14 }}>
                      <span style={{ fontSize: 22 }}>{e.icon}</span>
                      <p style={{ margin: "6px 0 2px", fontSize: 12, fontWeight: 700 }}>{e.title}</p>
                      <p style={{ margin: 0, fontSize: 10, color: C.sub }}>{e.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>PHILOSOPHY</p>
              {["Discipline is the bridge between goals and achievement.", "Every rep, every meal, every rest - all intentional.", "A champions body starts with a champions mindset."].map(function(q, i) {
                return (
                  <div key={i} style={{ borderLeft: "3px solid " + C.accent, paddingLeft: 14, marginBottom: i < 2 ? 12 : 0 }}>
                    <p style={{ margin: 0, fontSize: 13, color: C.text, fontStyle: "italic", lineHeight: 1.6 }}>{q}</p>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>CONNECT</p>
              {[{ icon: "📸", platform: "Instagram", handle: "@suryakant_jadhav_fitness", color: "#E1306C" }, { icon: "▶", platform: "YouTube", handle: "Fit with Suryakant Jadhav", color: "#FF0000" }, { icon: "💬", platform: "WhatsApp", handle: "+91 XXXXX XXXXX", color: "#25D366" }, { icon: "📧", platform: "Email", handle: "coach@fitsuryakant.in", color: C.accent }].map(function(s, i) {
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid " + C.border : "none" }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{s.platform}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: s.color }}>{s.handle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button style={S.btn} onClick={function() { setScreen("chat"); }}>Train with SJ AI Coach Now</button>
          </div>
        )}

        {/* ── DAILY CHALLENGE SCREEN ─────────────────────────────────────── */}
        {screen === "challenge" && (
          <div style={S.pg}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={Object.assign({}, S.title, { margin: 0 })}>SJ Daily Challenge</h2>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Total XP</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.accent }}>{totalXP} XP</p>
              </div>
            </div>

            {/* Streak and stats row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {[{ i: "🔥", v: challengeStreak + " days", l: "Streak" }, { i: "🏅", v: completedChallenges + "", l: "Completed" }, { i: "⚡", v: totalXP + "", l: "Total XP" }].map(function(s, i) {
                return (
                  <div key={i} style={{ flex: 1, background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "14px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 20 }}>{s.i}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: C.accent, marginTop: 4 }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>{s.l}</div>
                  </div>
                );
              })}
            </div>

            {/* Todays challenge */}
            <div style={{ background: challengeDone ? "rgba(74,222,128,0.08)" : "linear-gradient(135deg,rgba(232,255,71,0.12),rgba(255,107,53,0.08))", border: "2px solid " + (challengeDone ? C.green : C.accent), borderRadius: 22, padding: 22, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ display: "inline-block", background: "rgba(255,107,53,0.2)", borderRadius: 8, padding: "3px 10px", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.accent2 }}>{todayChallenge.difficulty} | +{todayChallenge.xp} XP</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{todayChallenge.emoji} {todayChallenge.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: C.sub }}>{todayChallenge.desc}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: C.sub }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>{challengeProgress}/{todayChallenge.target} {todayChallenge.unit}</span>
                </div>
                <div style={{ background: C.border, borderRadius: 8, height: 12, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: challengeDone ? C.green : "linear-gradient(90deg," + C.accent2 + "," + C.accent + ")", borderRadius: 8, width: Math.min(100, (challengeProgress / todayChallenge.target) * 100) + "%", transition: "width 0.4s" }} />
                </div>
              </div>

              {/* Input progress */}
              {!challengeDone && (
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input style={Object.assign({}, S.inp, { flex: 1 })} type="number" placeholder={"How many " + todayChallenge.unit + " done?"} value={challengeInput} onChange={function(e) { setChallengeInput(e.target.value); }} />
                    <button style={{ background: C.accent, border: "none", borderRadius: 12, padding: "0 16px", fontWeight: 800, color: "#000", cursor: "pointer", fontSize: 13 }}
                      onClick={function() {
                        var val = parseInt(challengeInput) || 0;
                        var newProg = Math.min(todayChallenge.target, challengeProgress + val);
                        setChallengeProgress(newProg);
                        setChallengeInput("");
                        speak("Great work! You did " + val + " " + todayChallenge.unit + ". Keep pushing!");
                        if (newProg >= todayChallenge.target) completeChallenge();
                      }}>Add</button>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[10, 25, 50, 100].filter(function(n) { return n <= todayChallenge.target; }).slice(0, 4).map(function(n) {
                      return (
                        <button key={n} style={{ flex: 1, background: C.card2, border: "1px solid " + C.border, borderRadius: 10, padding: 8, fontSize: 11, color: C.sub, cursor: "pointer" }}
                          onClick={function() {
                            var newProg = Math.min(todayChallenge.target, challengeProgress + n);
                            setChallengeProgress(newProg);
                            speak("" + n + " done! Keep going!");
                            if (newProg >= todayChallenge.target) completeChallenge();
                          }}>+{n}</button>
                      );
                    })}
                  </div>
                </div>
              )}

              {challengeDone && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <p style={{ margin: 0, fontSize: 28 }}>🎉</p>
                  <p style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 900, color: C.green }}>Challenge Complete!</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: C.sub }}>+{todayChallenge.xp} XP earned! Come back tomorrow!</p>
                </div>
              )}
            </div>

            {/* SJ Tip */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 16 }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>SJ COACH TIP</p>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg," + C.accent + "," + C.accent2 + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💪</div>
                <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6, fontStyle: "italic" }}>{todayChallenge.tip}</p>
              </div>
              <button style={Object.assign({}, S.btn, { marginTop: 12, background: C.purple, color: "#fff" })} onClick={function() { speak(todayChallenge.tip); }}>
                Hear SJ Coach Tip
              </button>
            </div>

            {/* Past badges */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>YOUR BADGES</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {CHALLENGE_BADGES.map(function(b) {
                  var unlocked = completedChallenges >= b.req;
                  return (
                    <div key={b.id} style={{ background: unlocked ? "rgba(232,255,71,0.07)" : C.card2, border: "1px solid " + (unlocked ? C.accent : C.border), borderRadius: 14, padding: 14, opacity: unlocked ? 1 : 0.4 }}>
                      <span style={{ fontSize: 24 }}>{b.emoji}</span>
                      <p style={{ margin: "6px 0 2px", fontSize: 13, fontWeight: 800, color: unlocked ? C.text : C.sub }}>{b.title}</p>
                      <p style={{ margin: 0, fontSize: 10, color: C.sub }}>{b.desc}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 10, color: unlocked ? C.green : C.sub }}>{unlocked ? "Unlocked!" : b.req + " challenges needed"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SLEEP & RECOVERY SCREEN ───────────────────────────────────── */}
        {screen === "sleep" && (
          <div style={S.pg}>
            <h2 style={S.title}>Sleep and Recovery</h2>

            {/* Todays recovery status */}
            <div style={{ background: "linear-gradient(135deg,rgba(96,165,250,0.12),rgba(167,139,250,0.08))", border: "2px solid " + todaySleepLevel.color + "66", borderRadius: 22, padding: 22, marginBottom: 18 }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: todaySleepLevel.color, letterSpacing: 1.5 }}>TODAYS RECOVERY STATUS</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 36, fontWeight: 900 }}>{todaySleep.hours}h</p>
                  <div style={{ display: "inline-block", background: todaySleepLevel.color + "22", border: "1px solid " + todaySleepLevel.color, borderRadius: 20, padding: "4px 14px" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: todaySleepLevel.color }}>{todaySleepLevel.intensity}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 12, color: C.sub }}>7-day avg</p>
                  <p style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 900, color: C.blue }}>{avgSleep}h</p>
                </div>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>{todaySleepLevel.message}</p>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "10px 14px" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: todaySleepLevel.color }}>Workout adjustment: {todaySleepLevel.mod}</p>
              </div>
              <button style={Object.assign({}, S.btn, { marginTop: 12, background: C.purple, color: "#fff" })} onClick={function() { speak(todaySleepLevel.message + " " + todaySleepLevel.mod); }}>
                Hear Recovery Advice
              </button>
            </div>

            {/* 7-day sleep chart */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 16 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.blue, letterSpacing: 1 }}>7-DAY SLEEP CHART</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                {sleepLog.map(function(d, i) {
                  var lvl = RECOVERY_LEVELS[getSleepLevel(d.hours)];
                  var h = Math.min(100, (d.hours / 10) * 100);
                  var isLast = i === sleepLog.length - 1;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <span style={{ fontSize: 9, color: isLast ? lvl.color : C.sub, fontWeight: isLast ? 900 : 400 }}>{d.hours}h</span>
                      <div style={{ width: "100%", height: h, background: isLast ? lvl.color : lvl.color + "44", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} />
                      <span style={{ fontSize: 8, color: C.sub }}>{d.date}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12 }}>
                {[{ c: "#a78bfa", l: "Elite 8h+" }, { c: "#4ade80", l: "Great 7-8h" }, { c: "#e8ff47", l: "Good 6-7h" }, { c: "#f97316", l: "OK 5-6h" }].map(function(x, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} />
                      <span style={{ fontSize: 9, color: C.sub }}>{x.l}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Log tonight sleep */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18, marginBottom: 16 }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>LOG LAST NIGHTS SLEEP</p>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: C.sub }}>How many hours did you sleep?</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[5, 6, 7, 8, 9].map(function(h) {
                  var lvl = RECOVERY_LEVELS[getSleepLevel(h)];
                  var sel = parseFloat(sleepInput) === h;
                  return (
                    <div key={h} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 12, cursor: "pointer", border: "2px solid " + (sel ? lvl.color : C.border), background: sel ? lvl.color + "22" : C.card2 }} onClick={function() { setSleepInput("" + h); }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: sel ? lvl.color : C.sub }}>{h}h</p>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input style={Object.assign({}, S.inp, { flex: 1 })} type="number" step="0.5" min="3" max="12" placeholder="Custom (e.g. 7.5)" value={sleepInput} onChange={function(e) { setSleepInput(e.target.value); }} />
                <button style={{ background: C.accent, border: "none", borderRadius: 12, padding: "0 18px", fontWeight: 800, color: "#000", cursor: "pointer", fontSize: 13 }}
                  onClick={function() {
                    var h = parseFloat(sleepInput) || 7;
                    var lvl = getSleepLevel(h);
                    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    var dayName = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
                    var newLog = sleepLog.slice(-6).concat([{ date: dayName, hours: h, quality: lvl }]);
                    setSleepLog(newLog);
                    speak("Sleep logged: " + h + " hours. " + RECOVERY_LEVELS[lvl].message);
                  }}>Log</button>
              </div>
              {sleepInput && (
                <div style={{ background: RECOVERY_LEVELS[getSleepLevel(parseFloat(sleepInput) || 7)].color + "11", border: "1px solid " + RECOVERY_LEVELS[getSleepLevel(parseFloat(sleepInput) || 7)].color + "44", borderRadius: 12, padding: "10px 14px" }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: RECOVERY_LEVELS[getSleepLevel(parseFloat(sleepInput) || 7)].color }}>{RECOVERY_LEVELS[getSleepLevel(parseFloat(sleepInput) || 7)].intensity}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: C.sub }}>{RECOVERY_LEVELS[getSleepLevel(parseFloat(sleepInput) || 7)].mod}</p>
                </div>
              )}
            </div>

            {/* Sleep tips */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 18, padding: 18 }}>
              <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>SLEEP SCIENCE TIPS</p>
              {["Sleep 7-9 hours. Muscle repair peaks at hour 6-8 of deep sleep.", "Avoid screens 1 hour before bed. Blue light reduces melatonin by 50%.", "Keep room temp at 18-20 degrees C for deeper sleep cycles.", "Consistent sleep and wake times regulate your circadian rhythm.", "Avoid caffeine after 2 PM. It has a 6-hour half-life in your body."].map(function(tip, i) {
                return (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue, marginTop: 5, flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{tip}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <div style={{ display: "flex", background: C.card, borderTop: "1px solid " + C.border, flexShrink: 0 }}>
        {NAV.map(function(n) {
          return (
            <div key={n.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 6px", cursor: "pointer", borderTop: "2px solid " + (screen === n.id ? C.accent : "transparent") }} onClick={function() { setScreen(n.id); }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              <span style={{ fontSize: 9, color: screen === n.id ? C.accent : C.sub, fontWeight: screen === n.id ? 700 : 400, marginTop: 2 }}>{n.label}</span>
            </div>
          );
        })}
      </div>
        </div>
      )}
    </div>
  );
}
