export function normalizeCharityIds(charity) {
  const charityIds = Array.isArray(charity) ? charity : [charity];
  return charityIds.filter(
    (charityId) => typeof charityId === "string" && charityId.trim(),
  );
}
