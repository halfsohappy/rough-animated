import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number;
  height?: number;
  roughOptions?: Partial<Options>;
}

export function RoughInput({
  value,
  onChange,
  placeholder,
  width = 240,
  height = 40,
  roughOptions,
}: RoughInputProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [focused, setFocused] = useState(false);

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
      strokeWidth: focused ? sw * 1.5 : sw,
      fill: 'none',
    });

    const rect = rc.rectangle(padding, padding, width, height, opts);
    svg.appendChild(rect);
  }, [theme, focused, width, height, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
  const padding = Math.max(sw, 4);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        ref={svgRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          position: 'relative',
          width: `${width - 16}px`,
          height: `${height}px`,
          padding: `0 8px`,
          margin: `${padding}px`,
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: '14px',
          color: theme.stroke,
          zIndex: 1,
        }}
      />
    </div>
  );
}
