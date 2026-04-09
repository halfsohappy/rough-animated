import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: number;
  roughOptions?: Partial<Options>;
}

export function RoughCheckbox({
  checked,
  onChange,
  label,
  size = 24,
  roughOptions,
}: RoughCheckboxProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [hovered, setHovered] = useState(false);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw, 4);
    const totalSize = size + padding * 2;
    svg.setAttribute('width', `${totalSize}`);
    svg.setAttribute('height', `${totalSize}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
    });

    // Draw box
    const box = rc.rectangle(padding, padding, size, size, opts);
    svg.appendChild(box);

    // Draw checkmark if checked
    if (checked) {
      const checkOpts = mergeOptions(theme, {
        ...roughOptions,
        animate: false,
        strokeWidth: hovered ? sw * 1.5 : sw,
        fill: 'none',
      });
      const x = padding;
      const y = padding;
      const check = rc.linearPath(
        [
          [x + size * 0.2, y + size * 0.5],
          [x + size * 0.45, y + size * 0.75],
          [x + size * 0.85, y + size * 0.2],
        ],
        checkOpts,
      );
      svg.appendChild(check);
    }
  }, [theme, checked, hovered, size, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <label
      onClick={() => onChange(!checked)}
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
