import React, { useRef, useEffect, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughCardProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  roughOptions?: Partial<Options>;
  style?: React.CSSProperties;
}

export function RoughCard({
  children,
  width = 300,
  height = 200,
  roughOptions,
  style,
}: RoughCardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw, 4);
    const totalW = width + padding * 2;
    const totalH = height + padding * 2;
    svg.setAttribute('width', `${totalW}`);
    svg.setAttribute('height', `${totalH}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      fill: roughOptions?.fill ?? 'none',
    });

    const rect = rc.rectangle(padding, padding, width, height, opts);
    svg.appendChild(rect);
  }, [theme, width, height, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
  const padding = Math.max(sw, 4);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${width + padding * 2}px`,
        height: `${height + padding * 2}px`,
        ...style,
      }}
    >
      <svg
        ref={svgRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      />
      <div
        style={{
          position: 'relative',
          padding: `${padding + 12}px`,
          zIndex: 1,
          color: theme.stroke,
        }}
      >
        {children}
      </div>
    </div>
  );
}
