// Centralized date helper utilities for habit due logic

// Return start and end (exclusive) of the local day for a given Date
function getDayBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  return { start, end };
}

// Get start of the current week (Sunday) - change offset for Monday if desired
function getWeekStart(d = new Date(), weekStartsOnMonday = false) {
  const copy = new Date(d);
  copy.setHours(0,0,0,0);
  const day = copy.getDay(); // 0 = Sunday
  const diff = weekStartsOnMonday ? (day === 0 ? 6 : day - 1) : day; // Monday-start logic
  copy.setDate(copy.getDate() - diff);
  return copy;
}

function getMonthStart(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Find the last completed log entry (status === 'completed') for a habit
function lastCompleted(habit) {
  if (!habit || !habit.habitLog || habit.habitLog.length === 0) return null;
  // Use a single pass reduce instead of sort for efficiency
  return habit.habitLog.reduce((acc, log) => {
    if (log.status !== 'completed') return acc;
    if (!acc) return log;
    return new Date(log.date) > new Date(acc.date) ? log : acc;
  }, null);
}

// Determine if a habit is due based on its frequency and last completion
function isHabitDue(habit, now = new Date(), options = { weekStartsOnMonday: false }) {
  const lc = lastCompleted(habit);
  if (!lc) return true; // Never completed => due
  const last = new Date(lc.date);
  switch (habit.frequency) {
    case 'daily':
      return last.toDateString() !== now.toDateString();
    case 'weekly': {
      const weekStart = getWeekStart(now, options.weekStartsOnMonday);
      return last < weekStart; // Not completed since current week started
    }
    case 'monthly':
      return last < getMonthStart(now);
    default: // 'custom' or unknown => treat as due
      return true;
  }
}

module.exports = {
  getDayBounds,
  getWeekStart,
  getMonthStart,
  lastCompleted,
  isHabitDue,
};
