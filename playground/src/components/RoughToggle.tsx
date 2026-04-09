import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  width?: number;
  height?: number;
  roughOptions?: Partial<Options>;
}

export function RoughToggle({
  checked,
  onChange,
  label,
  width = 52,
  height = 28,
  roughOptions,
}: RoughToggleProps) {
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
    const totalW = width + padding * 2;
    const totalH = height + padding * 2;
    svg.setAttribute('width', `${totalW}`);
    svg.setAttribute('height', `${totalH}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
      fill: checked ? theme.fill : 'none',
      fillStyle: checked ? 'solid' : 'hachure',
    });

    // Track (rounded rectangle approximated as a rectangle)
    const track = rc.rectangle(padding, padding, width, height, opts);
    svg.appendChild(track);

    // Knob
    const knobRadius = height * 0.7;
    const knobX = checked
      ? padding + width - knobRadius / 2 - 4
      : padding + knobRadius / 2 + 4;
    const knobY = padding + height / 2;

    const knobOpts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
      fill: '#ffffff',
      fillStyle: 'solid',
    });
    const knob = rc.circle(knobX, knobY, knobRadius, knobOpts);
    svg.appendChild(knob);
  }, [theme, checked, hovered, width, height, roughOptions]);

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
