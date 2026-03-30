export const appColors = {
 darkBackground: '#202123',
 darkHover: '#4B4C4F',
 darPaperBackground: '#2E3440',
 white: '#EFECE9',
};

export const hexToRgba = (hex: string, alpha: number) => {
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
