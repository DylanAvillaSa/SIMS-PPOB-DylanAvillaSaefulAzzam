export const formatRupiah = (amount) => {
  const formatCurrency = new Intl.NumberFormat("id-ID").format(amount);

  return formatCurrency;
};
