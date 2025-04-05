import ColorThief from 'colorthief';

export const extractDominantColor = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Important for CORS
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        resolve(color);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
  });
};
