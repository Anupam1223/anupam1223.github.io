// Shared helper functions used across multiple section components

export const generateGaussianPath = (mu, sigma, heightScale = 1, width = 400, height = 200) => {
  let path = `M 0 ${height} `;
  for (let x = 0; x <= width; x += 2) {
    const scaledX = ((x / width) * 8) - 4;
    const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - mu) / sigma, 2));
    const visualY = height - (y * heightScale);
    path += `L ${x} ${visualY} `;
  }
  path += `L ${width} ${height} Z`;
  return path;
};

export const generateComplexPath = (width = 400, height = 200) => {
  let path = `M 0 ${height} `;
  for (let x = 0; x <= width; x += 2) {
    const scaledX = ((x / width) * 8) - 4;
    const y1 = (1 / (0.8 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX + 2) / 0.8, 2));
    const y2 = (1 / (0.4 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 1) / 0.4, 2));
    const y3 = (1 / (1.2 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 3) / 1.2, 2));
    const totalY = (y1 * 0.4) + (y2 * 0.5) + (y3 * 0.3);
    const visualY = height - (totalY * 180);
    path += `L ${x} ${visualY} `;
  }
  path += `L ${width} ${height} Z`;
  return path;
};

export const generateBlendedPath = (t, width = 120, height = 60) => {
  let path = `M 0 ${height} `;
  for (let x = 0; x <= width; x += 2) {
    const scaledX = ((x / width) * 8) - 4;
    const yG = (1 / (1 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(scaledX / 1, 2));
    const y1 = (1 / (0.8 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX + 2) / 0.8, 2));
    const y2 = (1 / (0.4 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 1) / 0.4, 2));
    const y3 = (1 / (1.2 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((scaledX - 3) / 1.2, 2));
    const yC = (y1 * 0.4) + (y2 * 0.5) + (y3 * 0.3);
    const finalY = (yC * (1 - t)) + (yG * t);
    const scale = (180 * (1 - t)) + (80 * t);
    const visualY = height - (finalY * scale * (height / 200));
    path += `L ${x} ${visualY} `;
  }
  path += `L ${width} ${height} Z`;
  return path;
};
