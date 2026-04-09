import React, { useRef, useEffect, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughDividerProps {
  width?: number;
  roughOptions?: Partial<Options>;
}

export function RoughDivider({
  width = 300,
  roughOptions,
}: RoughDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw * 2, 8);
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${padding * 2}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      fill: 'none',
    });

    const line = rc.line(0, padding, width, padding, opts);
    svg.appendChild(line);
  }, [theme, width, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
      <svg ref={svgRef} />
    </div>
  );
}
