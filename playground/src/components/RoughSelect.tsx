import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  width?: number;
  height?: number;
  roughOptions?: Partial<Options>;
}

export function RoughSelect({
  value,
  onChange,
  options,
  width = 200,
  height = 40,
  roughOptions,
}: RoughSelectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dropSvgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const drawMain = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw, 4);
    svg.setAttribute('width', `${width + padding * 2}`);
    svg.setAttribute('height', `${height + padding * 2}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
      fill: 'none',
    });

    const rect = rc.rectangle(padding, padding, width, height, opts);
    svg.appendChild(rect);

    // Chevron
    const chevOpts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: hovered ? sw * 1.5 : sw,
    });
    const cx = padding + width - 20;
    const cy = padding + height / 2;
    const chevron = rc.linearPath([
      [cx - 5, cy - 3],
      [cx, cy + 3],
      [cx + 5, cy - 3],
    ], chevOpts);
    svg.appendChild(chevron);
  }, [theme, hovered, width, height, roughOptions]);

  const drawDropdown = useCallback(() => {
    const svg = dropSvgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw, 4);
    const dropHeight = options.length * 36 + 8;
    svg.setAttribute('width', `${width + padding * 2}`);
    svg.setAttribute('height', `${dropHeight + padding * 2}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      fill: '#ffffff',
      fillStyle: 'solid',
    });

    const rect = rc.rectangle(padding, padding, width, dropHeight, opts);
    svg.appendChild(rect);
  }, [theme, width, options.length, roughOptions]);

  useEffect(() => { drawMain(); }, [drawMain]);
  useEffect(() => { if (isOpen) drawDropdown(); }, [isOpen, drawDropdown]);

  const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
  const padding = Math.max(sw, 4);
  const selectedLabel = options.find(o => o.value === value)?.label ?? '';

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          width: `${width + padding * 2}px`,
          height: `${height + padding * 2}px`,
        }}
      >
        <svg
          ref={svgRef}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        />
        <span style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: `0 ${padding + 12}px`,
          fontSize: '14px',
          color: theme.stroke,
          userSelect: 'none',
        }}>
          {selectedLabel}
        </span>
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: `${height + padding * 2 + 2}px`,
          left: 0,
          zIndex: 10,
        }}>
          <svg
            ref={dropSvgRef}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
          <div style={{ position: 'relative', zIndex: 1, padding: `${padding + 4}px` }}>
            {options.map((opt, i) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                style={{
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.stroke,
                  background: hoveredIdx === i ? 'rgba(0,0,0,0.05)' : 'transparent',
                  fontWeight: opt.value === value ? 600 : 400,
                  borderRadius: '2px',
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
