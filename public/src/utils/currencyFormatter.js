export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount);
};