import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface RoughTheme {
  strokeWidth: number;
  stroke: string;
  fill: string;
  fillStyle: string;
  fillWeight: number;
  hachureGap: number;
  hachureAngle: number;
  roughness: number;
  bowing: number;
  animate: boolean;
  animationDuration: number;
  seed: number;
}

interface RoughThemeContextValue {
  theme: RoughTheme;
  setTheme: (updates: Partial<RoughTheme>) => void;
}

const defaultTheme: RoughTheme = {
  strokeWidth: 2,
  stroke: '#000000',
  fill: '#228BE6',
  fillStyle: 'hachure',
  fillWeight: 2,
  hachureGap: 6,
  hachureAngle: -41,
  roughness: 1,
  bowing: 1,
  animate: true,
  animationDuration: 600,
  seed: 1,
};

const RoughThemeContext = createContext<RoughThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => { /* noop */ },
});

export function useRoughTheme(): RoughThemeContextValue {
  return useContext(RoughThemeContext);
}

export function RoughThemeProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<RoughTheme> }) {
  const [theme, setThemeState] = useState<RoughTheme>({ ...defaultTheme, ...initial });

  const setTheme = useCallback((updates: Partial<RoughTheme>) => {
    setThemeState(prev => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <RoughThemeContext.Provider value={value}>
      {children}
    </RoughThemeContext.Provider>
  );
}
