import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughTooltipProps {
  children: React.ReactNode;
  text: string;
  roughOptions?: Partial<Options>;
}

export function RoughTooltip({
  children,
  text,
  roughOptions,
}: RoughTooltipProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [visible, setVisible] = useState(false);
  const [dims, setDims] = useState({ w: 100, h: 32 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && tooltipRef.current) {
      const textEl = tooltipRef.current.querySelector('span');
      if (textEl) {
        const rect = textEl.getBoundingClientRect();
        setDims({ w: Math.ceil(rect.width) + 24, h: Math.ceil(rect.height) + 16 });
      }
    }
  }, [visible, text]);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw, 4);
    svg.setAttribute('width', `${dims.w + padding * 2}`);
    svg.setAttribute('height', `${dims.h + padding * 2}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      fill: '#333',
      fillStyle: 'solid',
      stroke: '#333',
    });

    const rect = rc.rectangle(padding, padding, dims.w, dims.h, opts);
    svg.appendChild(rect);
  }, [theme, dims, roughOptions]);

  useEffect(() => { if (visible) draw(); }, [visible, draw]);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          <svg
            ref={svgRef}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          <span style={{
            position: 'relative',
            zIndex: 1,
            display: 'block',
            padding: '6px 12px',
            fontSize: '12px',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}>
            {text}
          </span>
        </div>
      )}
    </span>
  );
}
