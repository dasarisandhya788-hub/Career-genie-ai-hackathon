export function calculateProgressPercentage(completedCount, totalSteps) {
  if (!totalSteps || totalSteps === 0) return 0;
  return Math.min(100, Math.round((completedCount / totalSteps) * 100));
}

export function formatDate(timestamp) {
  if (!timestamp) return "Recently";
  try {
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (e) {
    return "Recently";
  }
}
