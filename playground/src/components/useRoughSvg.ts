import { useRef, useEffect, useCallback } from 'react';
import rough from '../../../src/rough';
import type { Options } from '../../../src/core';
import { useRoughTheme } from './RoughThemeContext';

/**
 * Shared hook that manages a rough SVG element.
 * Returns a ref to attach to an <svg> and a redraw function.
 */
export function useRoughSvg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();

  const getRc = useCallback(() => {
    if (!svgRef.current) return null;
    return rough.svg(svgRef.current);
  }, []);

  return { svgRef, getRc, theme };
}

/**
 * Merges theme defaults with per-component overrides.
 */
export function mergeOptions(
  theme: ReturnType<typeof useRoughTheme>['theme'],
  overrides?: Partial<Options>,
): Options {
  return {
    strokeWidth: theme.strokeWidth,
    stroke: theme.stroke,
    roughness: theme.roughness,
    bowing: theme.bowing,
    fillStyle: theme.fillStyle,
    fillWeight: theme.fillWeight,
    hachureGap: theme.hachureGap,
    hachureAngle: theme.hachureAngle,
    animate: theme.animate,
    animationDuration: theme.animationDuration,
    seed: theme.seed,
    ...overrides,
  };
}
