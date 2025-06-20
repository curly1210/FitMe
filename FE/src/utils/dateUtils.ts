/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatDate(isoString: any, plusDays?: number) {
  const date = new Date(isoString);

  // Nếu có truyền số ngày cần cộng
  if (plusDays && typeof plusDays === "number") {
    date.setDate(date.getDate() + plusDays);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
