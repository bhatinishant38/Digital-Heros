export function validateScoreInput(date, score) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Enter a valid date." };
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return { error: "Enter a valid date." };
  }

  if (date > new Date().toISOString().slice(0, 10)) {
    return { error: "The date can't be in the future." };
  }

  const numericScore = Number(score);
  if (!Number.isInteger(numericScore) || numericScore < 1 || numericScore > 45) {
    return { error: "Score must be a whole number from 1 to 45." };
  }

  return { date: parsedDate, score: numericScore, error: null };
}
