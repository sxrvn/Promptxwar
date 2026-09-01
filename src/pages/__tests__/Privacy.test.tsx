// @vitest-environment happy-dom
/**
 * Component smoke tests for the Privacy page.
 * Verifies: renders without crashing, myth accordion interaction,
 * and key accessibility attributes.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Privacy from '../Privacy';

// The Privacy component uses useLang(); provide a minimal stub context.
import { LangProvider } from '../../i18n/LangContext';

function renderPrivacy() {
  return render(
    <LangProvider>
      <Privacy />
    </LangProvider>,
  );
}

describe('Privacy page', () => {
  it('renders the page heading', () => {
    renderPrivacy();
    // The heading text comes from the translation key 'privacyPageTitle'.
    // We just assert an h1 exists — the exact text varies by locale.
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
  });

  it('renders the three info cards', () => {
    renderPrivacy();
    expect(screen.getByText('Legal Confidentiality')).toBeTruthy();
    expect(screen.getByText('Aggregated Publication')).toBeTruthy();
    expect(screen.getByText('Secure Digital Portal')).toBeTruthy();
  });

  it('renders myth accordion buttons', () => {
    renderPrivacy();
    const buttons = screen.getAllByRole('button');
    // There should be at least one accordion button (one per myth).
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('toggles the accordion open and closed on click', () => {
    renderPrivacy();
    const buttons = screen.getAllByRole('button');
    const firstBtn = buttons[0];

    // Initially closed — aria-expanded should be false.
    expect(firstBtn.getAttribute('aria-expanded')).toBe('false');

    // Click to open.
    fireEvent.click(firstBtn);
    expect(firstBtn.getAttribute('aria-expanded')).toBe('true');

    // Click again to close.
    fireEvent.click(firstBtn);
    expect(firstBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals the fact panel with role="region" when opened', () => {
    renderPrivacy();
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    // The revealed panel must have role="region" for accessibility.
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThan(0);
  });

  it('renders the scam alert section', () => {
    renderPrivacy();
    expect(screen.getByText(/Spotted a Census Scam/i)).toBeTruthy();
  });

  it('renders the cybercrime portal link with correct href', () => {
    renderPrivacy();
    const link = screen.getByText(/Report on Cybercrime Portal/i).closest('a');
    expect(link?.getAttribute('href')).toBe('https://cybercrime.gov.in/');
  });

  it('renders the helpline number link', () => {
    renderPrivacy();
    const link = screen.getByText(/1930/i).closest('a');
    expect(link?.getAttribute('href')).toBe('tel:1930');
  });
});
