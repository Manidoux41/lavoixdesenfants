export type EditorialStatus = "DRAFT" | "IN_REVIEW" | "SCHEDULED" | "PUBLISHED";

export function publicationDate(status: EditorialStatus, value: string, now = new Date()) {
  const selectedDate = value ? new Date(value) : null;
  if (status === "SCHEDULED") {
    if (!selectedDate || Number.isNaN(selectedDate.getTime()) || selectedDate <= now) {
      return { date: null, error: "Choisissez une date future pour programmer l’article." };
    }
    return { date: selectedDate, error: null };
  }
  if (status === "PUBLISHED") {
    if (selectedDate && (Number.isNaN(selectedDate.getTime()) || selectedDate > now)) {
      return { date: null, error: "La date est dans le futur : choisissez le statut « Programmé »." };
    }
    return { date: selectedDate ?? now, error: null };
  }
  return { date: null, error: null };
}
