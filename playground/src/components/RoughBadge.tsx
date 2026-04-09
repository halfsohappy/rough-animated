import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughBadgeProps {
  children: React.ReactNode;
  color?: string;
  roughOptions?: Partial<Options>;
}

export function RoughBadge({
  children,
  color,
  roughOptions,
}: RoughBadgeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { theme } = useRoughTheme();
  const [dims, setDims] = useState({ w: 60, h: 26 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setDims({ w: Math.ceil(rect.width) + 20, h: Math.ceil(rect.height) + 10 });
    }
  }, [children]);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw, 4);
    svg.setAttribute('width', `${dims.w + padding * 2}`);
    svg.setAttribute('height', `${dims.h + padding * 2}`);

    const fillColor = color ?? theme.fill;
    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
      fill: fillColor,
      fillStyle: 'solid',
    });

    const rect = rc.rectangle(padding, padding, dims.w, dims.h, opts);
    svg.appendChild(rect);
  }, [theme, dims, hovered, color, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
  const padding = Math.max(sw, 4);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: `${dims.w + padding * 2}px`,
        height: `${dims.h + padding * 2}px`,
      }}
    >
      <svg
        ref={svgRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      />
      <span
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '12px',
          fontWeight: 600,
          color: '#fff',
          padding: '0 4px',
        }}
      >
        {children}
      </span>
    </span>
  );
}
