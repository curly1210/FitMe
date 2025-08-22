/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatCurrencyVND(amount: any) {
  if (typeof amount !== "number") return "";

  // Dùng toLocaleString và thay dấu phẩy bằng dấu chấm
  return amount.toLocaleString().replace(/,/g, ".") + " đ";
}
