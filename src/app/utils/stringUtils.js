export const formatDescription = (desc) => {
  const maxLength = 70; // Jumlah maksimal karakter untuk satu baris
  if (desc?.length > maxLength) {
    return `${desc.substring(0, maxLength)}...`;
  }
  return desc;
};