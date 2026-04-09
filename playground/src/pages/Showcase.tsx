import React, { useState } from 'react';
import {
  useRoughTheme,
  RoughButton,
  RoughCheckbox,
  RoughRadio,
  RoughToggle,
  RoughInput,
  RoughCard,
  RoughDivider,
  RoughBadge,
  RoughProgressBar,
  RoughModal,
  RoughSelect,
  RoughSlider,
  RoughTooltip,
} from '../components';

export function Showcase() {
  const { theme, setTheme } = useRoughTheme();

  // Demo state
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [radio, setRadio] = useState('a');
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectVal, setSelectVal] = useState('opt1');
  const [progress, setProgress] = useState(65);
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: theme.stroke, marginBottom: '4px' }}>Rough Animated UI</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '32px' }}>
        A hand-drawn component suite. Every stroke shares one adjustable width.
      </p>

      {/* ── Global Controls ── */}
      <RoughCard width={860} height={200} roughOptions={{ fill: '#f8f9fa', fillStyle: 'solid' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>🎛 Global Theme Controls</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <RoughSlider
            label="Stroke Width"
            value={theme.strokeWidth * 10}
            onChange={(v) => setTheme({ strokeWidth: Math.max(0.5, v / 10) })}
            width={180}
          />
          <RoughSlider
            label="Fill Weight"
            value={theme.fillWeight * 10}
            onChange={(v) => setTheme({ fillWeight: Math.max(0.5, v / 10) })}
            width={180}
          />
          <RoughSlider
            label="Hachure Gap"
            value={theme.hachureGap * 5}
            onChange={(v) => setTheme({ hachureGap: Math.max(1, v / 5) })}
            width={180}
          />
          <RoughSlider
            label="Roughness"
            value={theme.roughness * 20}
            onChange={(v) => setTheme({ roughness: Math.max(0, v / 20) })}
            width={180}
          />
          <div>
            <div style={{ fontSize: '12px', color: theme.stroke, marginBottom: '4px' }}>Stroke Color</div>
            <input
              type="color"
              value={theme.stroke}
              onChange={(e) => setTheme({ stroke: e.target.value })}
              style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: theme.stroke, marginBottom: '4px' }}>Fill Color</div>
            <input
              type="color"
              value={theme.fill}
              onChange={(e) => setTheme({ fill: e.target.value })}
              style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer' }}
            />
          </div>
          <RoughSelect
            value={theme.fillStyle}
            onChange={(v) => setTheme({ fillStyle: v })}
            options={[
              { value: 'hachure', label: 'Hachure' },
              { value: 'solid', label: 'Solid' },
              { value: 'zigzag', label: 'Zigzag' },
              { value: 'cross-hatch', label: 'Cross-hatch' },
              { value: 'dots', label: 'Dots' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'zigzag-line', label: 'Zigzag-line' },
            ]}
            width={140}
          />
        </div>
      </RoughCard>

      <div style={{ height: '32px' }} />

      {/* ── Buttons ── */}
      <Section title="Buttons">
        <p style={descStyle}>
          Hover to see stroke width double. The hatch-filled button shows fill weight &amp; gap changing on hover.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <RoughButton onClick={() => alert('Clicked!')}>
            Click Me
          </RoughButton>

          <RoughButton
            roughOptions={{ fill: theme.fill, fillStyle: 'hachure', hachureGap: 12, fillWeight: 1 }}
            hoverFillWeight={3}
            hoverHachureGap={4}
            hoverStrokeWidth={theme.strokeWidth * 2.5}
          >
            Hatch → Bold
          </RoughButton>

          <RoughButton
            roughOptions={{ fill: theme.fill, fillStyle: 'cross-hatch' }}
            hoverFillStyle="solid"
          >
            Cross → Solid
          </RoughButton>

          <RoughButton disabled>
            Disabled
          </RoughButton>

          <RoughTooltip text="I'm a rough tooltip!">
            <RoughButton>
              Hover for Tooltip
            </RoughButton>
          </RoughTooltip>
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Checkboxes ── */}
      <Section title="Checkboxes">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <RoughCheckbox checked={check1} onChange={setCheck1} label="Unchecked" />
          <RoughCheckbox checked={check2} onChange={setCheck2} label="Checked" />
          <RoughCheckbox checked={true} onChange={() => { /* noop */ }} label="Always on" size={32} />
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Radio Buttons ── */}
      <Section title="Radio Buttons">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <RoughRadio checked={radio === 'a'} onChange={() => setRadio('a')} label="Option A" />
          <RoughRadio checked={radio === 'b'} onChange={() => setRadio('b')} label="Option B" />
          <RoughRadio checked={radio === 'c'} onChange={() => setRadio('c')} label="Option C" />
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Toggles ── */}
      <Section title="Toggle Switches">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <RoughToggle checked={toggle1} onChange={setToggle1} label="Off" />
          <RoughToggle checked={toggle2} onChange={setToggle2} label="On" />
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Input ── */}
      <Section title="Text Input">
        <p style={descStyle}>Focus to see stroke thicken.</p>
        <RoughInput
          value={inputVal}
          onChange={setInputVal}
          placeholder="Type something sketchy..."
          width={320}
        />
      </Section>

      <RoughDivider width={860} />

      {/* ── Select ── */}
      <Section title="Select / Dropdown">
        <RoughSelect
          value={selectVal}
          onChange={setSelectVal}
          options={[
            { value: 'opt1', label: 'First Option' },
            { value: 'opt2', label: 'Second Option' },
            { value: 'opt3', label: 'Third Option' },
          ]}
        />
      </Section>

      <RoughDivider width={860} />

      {/* ── Slider ── */}
      <Section title="Slider">
        <RoughSlider value={sliderVal} onChange={setSliderVal} label="Volume" width={300} />
      </Section>

      <RoughDivider width={860} />

      {/* ── Progress Bar ── */}
      <Section title="Progress Bar">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <RoughProgressBar value={progress} width={400} />
          <RoughButton
            width={80}
            height={32}
            onClick={() => setProgress(p => Math.min(100, p + 10))}
          >
            +10%
          </RoughButton>
          <RoughButton
            width={80}
            height={32}
            onClick={() => setProgress(0)}
          >
            Reset
          </RoughButton>
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Badges ── */}
      <Section title="Badges">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <RoughBadge>Default</RoughBadge>
          <RoughBadge color="#e03131">Error</RoughBadge>
          <RoughBadge color="#2f9e44">Success</RoughBadge>
          <RoughBadge color="#f08c00">Warning</RoughBadge>
          <RoughBadge color="#7048e8">Beta</RoughBadge>
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Cards ── */}
      <Section title="Cards">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <RoughCard width={250} height={120}>
            <h4 style={{ margin: '0 0 8px 0' }}>Plain Card</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Simple hand-drawn container for content.
            </p>
          </RoughCard>
          <RoughCard width={250} height={120} roughOptions={{ fill: theme.fill, fillStyle: 'hachure', hachureGap: 10 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Hatch Fill Card</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              With hachure background fill.
            </p>
          </RoughCard>
          <RoughCard width={250} height={120} roughOptions={{ fill: theme.fill, fillStyle: 'cross-hatch' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Cross-hatch Card</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              Cross-hatched background.
            </p>
          </RoughCard>
        </div>
      </Section>

      <RoughDivider width={860} />

      {/* ── Modal ── */}
      <Section title="Modal">
        <RoughButton onClick={() => setModalOpen(true)}>
          Open Modal
        </RoughButton>
        <RoughModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Sketchy Dialog"
          width={440}
          height={200}
        >
          <p style={{ margin: '0 0 16px 0' }}>
            This modal is drawn with the same stroke width as everything else on the page.
            Adjust the global controls and reopen to see it change!
          </p>
          <RoughButton onClick={() => setModalOpen(false)} width={100} height={36}>
            Close
          </RoughButton>
        </RoughModal>
      </Section>

      <div style={{ height: '48px' }} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <h2 style={{ fontSize: '20px', margin: '16px 0 12px 0' }}>{title}</h2>
      {children}
    </div>
  );
}

const descStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '13px',
  margin: '0 0 12px 0',
};
