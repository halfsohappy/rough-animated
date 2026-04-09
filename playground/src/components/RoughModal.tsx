import React, { useRef, useEffect, useCallback } from 'react';
import rough from '../../../src/rough';
import { useRoughTheme } from './RoughThemeContext';
import { mergeOptions } from './useRoughSvg';
import type { Options } from '../../../src/core';

export interface RoughModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  roughOptions?: Partial<Options>;
}

export function RoughModal({
  open,
  onClose,
  title,
  children,
  width = 400,
  height = 260,
  roughOptions,
}: RoughModalProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const closeSvgRef = useRef<SVGSVGElement>(null);
  const { theme } = useRoughTheme();

  const draw = useCallback(() => {
    // Draw main border
    const svg = svgRef.current;
    if (!svg) return;
    const rc = rough.svg(svg);
    svg.replaceChildren();

    const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
    const padding = Math.max(sw * 2, 8);
    const totalW = width + padding * 2;
    const totalH = height + padding * 2;
    svg.setAttribute('width', `${totalW}`);
    svg.setAttribute('height', `${totalH}`);

    const opts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      fill: '#ffffff',
      fillStyle: 'solid',
    });

    const rect = rc.rectangle(padding, padding, width, height, opts);
    svg.appendChild(rect);

    // Title divider
    if (title) {
      const lineOpts = mergeOptions(theme, {
        ...roughOptions,
        animate: false,
        fill: 'none',
      });
      const divider = rc.line(padding + 8, padding + 48, padding + width - 8, padding + 48, lineOpts);
      svg.appendChild(divider);
    }

    // Draw close X
    const closeSvg = closeSvgRef.current;
    if (!closeSvg) return;
    const rc2 = rough.svg(closeSvg);
    closeSvg.replaceChildren();
    closeSvg.setAttribute('width', '24');
    closeSvg.setAttribute('height', '24');

    const xOpts = mergeOptions(theme, {
      ...roughOptions,
      animate: false,
      strokeWidth: sw,
    });
    closeSvg.appendChild(rc2.line(4, 4, 20, 20, xOpts));
    closeSvg.appendChild(rc2.line(20, 4, 4, 20, xOpts));
  }, [theme, width, height, title, roughOptions]);

  useEffect(() => {
    if (open) draw();
  }, [open, draw]);

  if (!open) return null;

  const sw = roughOptions?.strokeWidth ?? theme.strokeWidth;
  const padding = Math.max(sw * 2, 8);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        <svg
          ref={svgRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: `${width}px`,
            padding: `${padding}px`,
          }}
        >
          {title && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: theme.stroke }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 0,
                }}
              >
                <svg ref={closeSvgRef} />
              </button>
            </div>
          )}
          <div style={{ color: theme.stroke, fontSize: '14px' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
