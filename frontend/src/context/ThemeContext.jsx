import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

const hexToRgbSpace = (hex) => {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [customColors, setCustomColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customColors') || '{}');
    } catch { return {}; }
  });

  useEffect(() => {
    const root = document.documentElement;
    document.body.classList.remove('dark', 'light');

    if (theme === 'light') {
      document.body.classList.add('light');
    }
    // Remove any leftover custom properties on theme switch
    if (theme !== 'custom') {
      root.style.removeProperty('--c-bg');
      root.style.removeProperty('--c-accent');
      root.style.removeProperty('--c-accent-2');
      root.style.removeProperty('--c-surface');
      root.style.removeProperty('--c-elevated');
    } else {
      // Apply custom colors
      if (customColors.bg)      root.style.setProperty('--c-bg',       hexToRgbSpace(customColors.bg));
      if (customColors.accent)  root.style.setProperty('--c-accent',   hexToRgbSpace(customColors.accent));
      if (customColors.accent2) root.style.setProperty('--c-accent-2', hexToRgbSpace(customColors.accent2));
      if (customColors.surface) root.style.setProperty('--c-surface',  hexToRgbSpace(customColors.surface));
    }
    localStorage.setItem('theme', theme);
  }, [theme, customColors]);

  const updateCustomColors = (newColors) => {
    setCustomColors(prev => {
      const updated = { ...prev, ...newColors };
      localStorage.setItem('customColors', JSON.stringify(updated));
      return updated;
    });
    if (theme !== 'custom') setTheme('custom');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColors, updateCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
