import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughRadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: number;
  roughOptions?: Partial<Options>;
}

export function RoughRadio({
  checked,
  onChange,
  label,
  size = 24,
  roughOptions,
}: RoughRadioProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [hovered, setHovered] = useState(false);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw * 2, 6);
    const totalSize = size + padding * 2;
    svg.setAttribute('width', `${totalSize}`);
    svg.setAttribute('height', `${totalSize}`);

    const cx = totalSize / 2;
    const cy = totalSize / 2;

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
      fill: 'none',
    });

    // Outer circle
    const outer = rc.circle(cx, cy, size, opts);
    svg.appendChild(outer);

    // Inner fill dot if checked
    if (checked) {
      const innerOpts = mergeOptions(theme, {
        ...roughOptions,
        animate: false,
        strokeWidth: hovered ? sw * 1.5 : sw,
        fill: theme.stroke,
        fillStyle: 'solid',
      });
      const dot = rc.circle(cx, cy, size * 0.5, innerOpts);
      svg.appendChild(dot);
    }
  }, [theme, checked, hovered, size, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span
        onClick={() => onChange(!checked)}
        style={{ display: 'inline-flex', lineHeight: 0 }}
      >
        <svg ref={svgRef} />
      </span>
      {label && (
        <span style={{ fontSize: '14px', color: theme.stroke }}>
          {label}
        </span>
      )}
    </label>
  );
}
