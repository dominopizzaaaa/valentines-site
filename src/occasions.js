// src/occasions.js

const START_YEAR = 2026;
const MAX_YEARS = 80;

const ANNIVERSARY_MONTH_DAY = "12-04";
const VALENTINES_MONTH_DAY = "02-14";
const ASHLEY_BIRTHDAY_MONTH_DAY = "10-26";
const DOMINIC_BIRTHDAY_MONTH_DAY = "05-23";

/* Ashley birthday specifics */
const ASHLEY_BIRTH_YEAR = 2002; // 26 Oct 2002 → 24 in 2026
const ASHLEY_NAME = "Ashley";
const DOMINIC_NAME = "Dominic";

export const occasions = Array.from({ length: MAX_YEARS }, (_, i) => {
  const n = i + 1;
  const year = START_YEAR + i;

  const birthdayAge = year - ASHLEY_BIRTH_YEAR;

  return [
    /* 💘 VALENTINE’S */
    {
      id: `${n}thvalentines`,
      title: `${n}${ordinal(n)} Valentine’s 💘`,
      date: `${year}-${VALENTINES_MONTH_DAY}`,
      emoji: "💘",
      image: `/valentines-${n}.jpg`,
      routes:
        n === 1
          ? {
              ask: "/1stvalentines/ask",
              itinerary: "/1stvalentines/itinerary"
            }
          : undefined
    },

    /* 🎂 DOMINIC’S BIRTHDAY */{
      id: `dominic-${birthdayAge}th-birthday`,
      title: `${DOMINIC_NAME}’s ${birthdayAge}${ordinal(
        birthdayAge
      )} Birthday 🎂`,
      date: `${year}-${DOMINIC_BIRTHDAY_MONTH_DAY}`,
      emoji: "🎂",
      image: `/birthday-${birthdayAge}.jpg`
    },

    /* 🎂 ASHLEY’S BIRTHDAY */
    {
      id: `ashley-${birthdayAge}th-birthday`,
      title: `${ASHLEY_NAME}’s ${birthdayAge}${ordinal(
        birthdayAge
      )} Birthday 🎂`,
      date: `${year}-${ASHLEY_BIRTHDAY_MONTH_DAY}`,
      emoji: "🎂",
      image: `/birthday-${birthdayAge}.jpg`
    },

    /* 🌹 ANNIVERSARY */
    {
      id: `${n}thanniversary`,
      title: `${n}${ordinal(n)} Anniversary 🌹`,
      date: `${year}-${ANNIVERSARY_MONTH_DAY}`,
      emoji: "🌹",
      image: `/anniversary-${n}.jpg`
    }

    
  ];
}).flat();

/* ---------- HELPERS ---------- */

export function isUnlocked(date) {
  const target = new Date(date);
  const unlockTime = new Date(target);
  unlockTime.setDate(target.getDate() - 14); // unlock 2 weeks early
  return new Date() >= unlockTime;
}

function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
