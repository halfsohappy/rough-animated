import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughSliderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  width?: number;
  roughOptions?: Partial<Options>;
  label?: string;
}

export function RoughSlider({
  value,
  onChange,
  width = 240,
  roughOptions,
  label,
}: RoughSliderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = 16;
    const trackHeight = 4;
    const totalW = width + padding * 2;
    const totalH = 40;
    svg.setAttribute('width', `${totalW}`);
    svg.setAttribute('height', `${totalH}`);

    const trackY = totalH / 2 - trackHeight / 2;

    // Track
    const trackOpts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: sw,
      fill: 'none',
    });
    const track = rc.rectangle(padding, trackY, width, trackHeight, trackOpts);
    svg.appendChild(track);

    // Filled portion
    const fillWidth = (width * Math.max(0, Math.min(100, value))) / 100;
    if (fillWidth > 2) {
      const fillOpts = mergeOptions(theme, {
        ...roughOptions,
        animate: false,
        strokeWidth: sw,
        fill: theme.fill,
        fillStyle: 'solid',
      });
      const filled = rc.rectangle(padding, trackY, fillWidth, trackHeight, fillOpts);
      svg.appendChild(filled);
    }

    // Knob
    const knobX = padding + fillWidth;
    const knobY = totalH / 2;
    const knobOpts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: sw,
      fill: '#ffffff',
      fillStyle: 'solid',
    });
    const knob = rc.circle(knobX, knobY, 16, knobOpts);
    svg.appendChild(knob);
  }, [theme, value, width, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  const handlePointerEvent = useCallback((e: React.MouseEvent | MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left - 16; // padding
    const pct = Math.max(0, Math.min(100, (x / width) * 100));
    onChange(Math.round(pct));
  }, [width, onChange]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => handlePointerEvent(e);
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging, handlePointerEvent]);

  return (
    <div style={{ display: 'inline-block' }}>
      {label && (
        <div style={{ fontSize: '12px', color: theme.stroke, marginBottom: '4px' }}>
          {label}: {value}
        </div>
      )}
      <div
        ref={trackRef}
        onMouseDown={(e) => { setDragging(true); handlePointerEvent(e); }}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <svg ref={svgRef} />
      </div>
    </div>
  );
}
