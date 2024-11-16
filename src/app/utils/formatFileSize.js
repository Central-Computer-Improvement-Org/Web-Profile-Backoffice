export const formatFileSize = (sizeInBytes) => {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  // Mengonversi ukuran ke satuan yang lebih besar jika diperlukan
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Menggunakan Intl.NumberFormat untuk format angka
  const formattedSize = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(size);

  return `${formattedSize} ${units[unitIndex]}`;
};
