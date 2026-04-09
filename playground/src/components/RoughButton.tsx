import React, { useRef, useEffect, useState, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  width?: number;
  height?: number;
  hoverStrokeWidth?: number;
  hoverFill?: string;
  hoverFillStyle?: string;
  hoverFillWeight?: number;
  hoverHachureGap?: number;
  disabled?: boolean;
  roughOptions?: Partial<Options>;
  style?: React.CSSProperties;
}

export function RoughButton({
  children,
  onClick,
  width = 160,
  height = 48,
  hoverStrokeWidth,
  hoverFill,
  hoverFillStyle,
  hoverFillWeight,
  hoverHachureGap,
  disabled = false,
  roughOptions,
  style,
}: RoughButtonProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();
  const [hovered, setHovered] = useState(false);

  const draw = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const isHover = hovered && !disabled;
    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: isHover
        ? (hoverStrokeWidth ?? theme.strokeWidth * 2)
        : (roughOptions?.strokeWidth ?? theme.strokeWidth),
      fill: isHover
        ? (hoverFill ?? roughOptions?.fill)
        : roughOptions?.fill,
      fillStyle: isHover
        ? (hoverFillStyle ?? roughOptions?.fillStyle ?? theme.fillStyle)
        : (roughOptions?.fillStyle ?? theme.fillStyle),
      fillWeight: isHover
        ? (hoverFillWeight ?? roughOptions?.fillWeight ?? theme.fillWeight)
        : (roughOptions?.fillWeight ?? theme.fillWeight),
      hachureGap: isHover
        ? (hoverHachureGap ?? roughOptions?.hachureGap ?? theme.hachureGap)
        : (roughOptions?.hachureGap ?? theme.hachureGap),
    });

    const padding = Math.max(opts.strokeWidth ?? 2, 4);
    svg.setAttribute('width', `${width + padding * 2}`);
    svg.setAttribute('height', `${height + padding * 2}`);
    const node = rc.rectangle(padding, padding, width, height, opts);
    svg.appendChild(node);
  }, [theme, hovered, disabled, width, height, hoverStrokeWidth, hoverFill, hoverFillStyle, hoverFillWeight, hoverHachureGap, roughOptions]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        ref={svgRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      />
      <span style={{
        position: 'relative',
        zIndex: 1,
        padding: '8px 24px',
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: 500,
        color: theme.stroke,
        userSelect: 'none',
      }}>
        {children}
      </span>
    </button>
  );
}
