import React, { useRef, useEffect, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughProgressBarProps {
  value: number; // 0-100
  width?: number;
  height?: number;
  fillColor?: string;
  roughOptions?: Partial<Options>;
}

export function RoughProgressBar({
  value,
  width = 300,
  height = 24,
  fillColor,
  roughOptions,
}: RoughProgressBarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw * 2, 6);
    const totalW = width + padding * 2;
    const totalH = height + padding * 2;
    svg.setAttribute('width', `${totalW}`);
    svg.setAttribute('height', `${totalH}`);

    // Background track
    const bgOpts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      fill: 'none',
    });
    const bg = rc.rectangle(padding, padding, width, height, bgOpts);
    svg.appendChild(bg);

    // Fill bar
    const clampedValue = Math.max(0, Math.min(100, value));
    const fillWidth = (width * clampedValue) / 100;
    if (fillWidth > 2) {
      const fillOpts = mergeOptions(theme, {
        ...roughOptions,
        animate: false,
        fill: fillColor ?? theme.fill,
        fillStyle: roughOptions?.fillStyle ?? theme.fillStyle,
      });
      const bar = rc.rectangle(padding, padding, fillWidth, height, fillOpts);
      svg.appendChild(bar);
    }
  }, [theme, value, width, height, fillColor, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div style={{ display: 'inline-block' }}>
      <svg ref={svgRef} />
    </div>
  );
}
