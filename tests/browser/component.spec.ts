import { test, expect } from '@playwright/test';

test('component renders the source star and responds to controls without starting notes', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await expect(composer.getByRole('button', { name: 'Start composing' })).toBeVisible();
  await expect(composer.locator('path[data-family]')).toHaveCount(32);
  await page.screenshot({ path: testInfo.outputPath('composer.png'), fullPage: true });
  await composer.getByLabel('Emotion family').selectOption('sadness');
  await expect(composer.locator('#emotion-label')).toHaveText('Sadness');
  await expect(composer.getByRole('button', { name: 'Stop', exact: true })).toBeDisabled();
  await composer.getByText('Theme & harmony').click();
  for (const algorithm of ['markov', 'life', 'evolution', 'grammar', 'euclidean', 'torus']) {
    await composer.getByLabel('Generator').selectOption(algorithm);
    await expect(composer.locator('.chord')).toHaveCount(8);
    expect(await composer.locator('.roll rect').count()).toBeGreaterThan(0);
  }
  const path = composer.locator('path[tabindex="0"]'); await path.focus(); await page.keyboard.press('ArrowRight');
  await expect(composer.getByLabel('Emotion family')).toHaveValue('disgust');
  expect(errors).toEqual([]);
});

test('selected expression waits for the next phrase and stop releases AudioBus notes', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const el = document.querySelector('audiobus-composer') as any;
    (window as any).sent = [];
    el.peer = { sendMidi: (bytes: number[]) => (window as any).sent.push([...bytes]) };
  });
  const composer = page.locator('audiobus-composer');
  await composer.getByRole('button', { name: 'Start composing' }).click();
  await expect(composer.locator('#live-label')).toHaveText('Composing live');
  await composer.getByLabel('Emotion family').selectOption('fear');
  await expect(composer.locator('#applied')).toContainText('Selected changes apply next phrase');
  await composer.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(composer.locator('#live-label')).toHaveText('Ready to compose');
  const balance = await page.evaluate(() => {
    const active = new Set(); const sent = (window as any).sent as number[][];
    for (const [s, p] of sent) { const key = `${s & 15}:${p}`; if ((s & 240) === 144) active.add(key); else if ((s & 240) === 128) active.delete(key); }
    return { active: active.size, count: sent.length };
  });
  expect(balance.count).toBeGreaterThan(0); expect(balance.active).toBe(0);
});

test('MIDI download, browser audition, reconnect and mobile containment work', async ({ page }) => {
  await page.goto('/'); const composer = page.locator('audiobus-composer');
  const downloadPromise = page.waitForEvent('download');
  await composer.getByRole('button', { name: 'Export MIDI' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('composition.mid');
  await composer.getByRole('button', { name: 'Start composing' }).click();
  await expect(composer.locator('#live-label')).toHaveText('Composing live');
  await page.evaluate(() => { const el = document.querySelector('audiobus-composer')!; el.remove(); document.querySelector('main')!.append(el); });
  await expect(composer.locator('#live-label')).toHaveText('Ready to compose');
  await composer.getByRole('button', { name: 'Start composing' }).click();
  await expect(composer.locator('#live-label')).toHaveText('Composing live');
  await composer.getByRole('button', { name: 'Stop', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('deployed standalone component modules can be embedded without the demo bundle', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const library = await import(/* @vite-ignore */ './library/index.js');
    const score = library.compose({ seed: 'standalone', bars: 8 });
    const component = await import(/* @vite-ignore */ './library/component/index.js');
    component.defineComposer();
    return { events: score.events.length, registered: !!customElements.get('audiobus-composer') };
  });
  expect(result.events).toBeGreaterThan(0); expect(result.registered).toBe(true);
});

test('hosted integration keeps graph output and transport ownership when its panel moves', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    const element = document.querySelector('audiobus-composer') as any;
    (window as any).hostNotes = [];
    element.hostClock = true;
    element.setOutput({ label: 'Graph chain', send: (bytes: number[]) => (window as any).hostNotes.push([...bytes]) });
    element.configure({ tempo: 90, emotion: 'anticipation' });
    await element.start();
  });
  const composer = page.locator('audiobus-composer');
  await expect(composer.getByRole('button', { name: 'Start composing' })).toBeHidden();
  await expect(composer.getByLabel('Output', { exact: true })).toBeHidden();
  await expect(composer.getByLabel('Tempo / BPM')).toBeDisabled();
  await composer.getByLabel('Emotion family').selectOption('fear');
  await expect(composer.locator('#applied')).toContainText('Selected changes apply next phrase');
  const result = await page.evaluate(() => {
    const element = document.querySelector('audiobus-composer') as any;
    const parent = element.parentElement;
    element.remove();
    const playingWhileDetached = element.playing;
    element.advance(32.25);
    parent.append(element);
    const score = element.score;
    element.stop();
    const active = new Set();
    for (const [status, pitch] of (window as any).hostNotes as number[][]) {
      const key = `${status & 15}:${pitch}`;
      if ((status & 240) === 144) active.add(key);
      else if ((status & 240) === 128) active.delete(key);
    }
    return { playingWhileDetached, emotion: score.options.emotion, notes: (window as any).hostNotes.length, active: active.size };
  });
  expect(result.playingWhileDetached).toBe(true);
  expect(result.emotion).toBe('fear');
  expect(result.notes).toBeGreaterThan(0);
  expect(result.active).toBe(0);
});

test('every genre renders a phrase, suggests its tempo and names its idiom', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  const genres = await composer.getByLabel('Genre').locator('option').evaluateAll(options => options.map(o => [(o as HTMLOptionElement).value, o.textContent]));
  expect(genres.length).toBe(20);
  for (const [value, label] of genres) {
    await composer.getByLabel('Genre').selectOption(value!);
    await expect(composer.locator('#score-meta')).toContainText(label!);
    await expect(composer.locator('.chord')).toHaveCount(8);
    await expect(composer.locator('.tension-target')).toHaveCount(8);
  }
  await composer.getByLabel('Genre').selectOption('jazz');
  await expect(composer.getByLabel('Tempo / BPM')).toHaveValue('160');
  expect(errors).toEqual([]);
});

test('energy changes while playing enter at the next bar, not the next phrase', async ({ page }) => {
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await page.evaluate(() => { (document.querySelector('audiobus-composer') as any).setOutput({ label: 'Test', send: () => {} }); });
  await composer.getByRole('button', { name: 'Start composing' }).click();
  await composer.getByLabel('Energy', { exact: true }).fill('0.95');
  await expect(composer.locator('#applied')).toContainText('enter at the next bar');
  await composer.getByRole('button', { name: 'Stop', exact: true }).click();
});

test('the page link holds the settings, so a shared link reproduces them', async ({ page }) => {
  await page.goto('/#genre=jazz&energy=0.8&seed=shared');
  const composer = page.locator('audiobus-composer');
  await expect(composer.getByLabel('Genre')).toHaveValue('jazz');
  await expect(composer.locator('[name="seed"]')).toHaveValue('shared');
  await composer.getByLabel('Emotion family').selectOption('trust');
  await expect(page).toHaveURL(/emotion=trust/);
  await expect(page).toHaveURL(/genre=jazz/);
  await page.goto('/#genre=nonsense'); await page.reload();
  await expect(composer.getByLabel('Genre')).toHaveValue('pop');
});

test('MIDI input following is offered, and the played theme waits for an input', async ({ page }) => {
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await composer.getByText('Sound & MIDI').click();
  await expect(composer.getByLabel('Follow MIDI input')).toHaveValue('none');
  await expect(composer.getByRole('button', { name: 'Use played theme' })).toBeDisabled();
});

test('the gallery shows every emotion for a genre and a summary of all genres', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/gallery.html');
  await expect(page.locator('.card')).toHaveCount(8);
  await expect(page.locator('#summary tbody tr')).toHaveCount(20);
  await page.getByLabel('Genre').selectOption('reggae');
  await expect(page.locator('.card').first()).toContainText('Repeated bars');
  await page.locator('button[data-play]').first().click();
  await expect(page.locator('button[data-play]').first()).toHaveAttribute('aria-pressed', 'true');
  await page.locator('button[data-play]').first().click();
  await expect(page.locator('button[data-play]').first()).toHaveAttribute('aria-pressed', 'false');
  expect(errors).toEqual([]);
});

test('tempo is set with a slider or by tapping the beat', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await composer.getByLabel('Tempo / BPM').fill('140');
  await expect(composer.locator('#tempo-value')).toHaveText('140 BPM');
  await expect(composer.locator('#score-meta')).toContainText('140 BPM');
  const tap = composer.getByRole('button', { name: 'Tap' });
  // Freeze time so only the simulated 500 ms between taps counts.
  await page.clock.pauseAt(Date.now() + 60_000);
  for (let i = 0; i < 4; i++) { await tap.click(); await page.clock.runFor(500); }
  await expect(composer.getByLabel('Tempo / BPM')).toHaveValue('120');
  await expect(composer.locator('#tempo-value')).toHaveText('120 BPM');
});

test('bars can be chosen by click or keyboard to play from them', async ({ page }) => {
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await page.evaluate(() => { (document.querySelector('audiobus-composer') as any).setOutput({ label: 'Test', send: () => {} }); });
  const bars = composer.getByRole('toolbar', { name: /Bars/ }).getByRole('button');
  await expect(bars).toHaveCount(8);
  await bars.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(bars.nth(1)).toBeFocused();
  await page.keyboard.press('End');
  await expect(bars.nth(7)).toBeFocused();
  await expect(bars.nth(7)).toHaveAttribute('tabindex', '0');
  await expect(bars.first()).toHaveAttribute('tabindex', '-1');
  await bars.nth(5).click();
  await expect(composer.locator('#live-label')).toHaveText('Composing live');
  await expect(composer.locator('#bar-pill')).toHaveText('Bar 6 / 8');
  await expect(bars.nth(5)).toHaveAttribute('aria-current', '');
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(composer.locator('#bar-pill')).toHaveText('Bar 1 / 8');
  await composer.getByRole('button', { name: 'Stop', exact: true }).click();
});

test('performance panel offers six next-bar options with dynamic hints and arms/cancels cleanly', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  const cues = composer.locator('#perf-cues .cue');
  await expect(cues).toHaveCount(6);
  await expect(composer.locator('[data-cue-hint="key-change"]')).toHaveText('C → D');

  await composer.getByLabel('Genre').selectOption('house');
  await expect(composer.locator('[data-cue-hint="bridge"]')).toHaveText('→ Break');
  await expect(composer.locator('[data-cue-hint="drop"]')).toHaveText('Full band peak');

  await composer.getByLabel('Genre').selectOption('rock');
  await expect(composer.locator('[data-cue-hint="bridge"]')).toHaveText('Contrast shift');
  await expect(composer.locator('[data-cue-hint="drop"]')).toHaveText('→ Last chorus');

  const keyChange = composer.locator('[data-cue="key-change"]');
  await keyChange.click();
  await expect(keyChange).toHaveAttribute('aria-pressed', 'true');
  await expect(composer.locator('#perf-status')).toContainText('Key change armed');
  await expect(composer.locator('#perf-clear')).toBeVisible();
  await expect(composer.locator('#live-label')).toHaveText('Ready to compose');
  await expect(composer.locator('#score-meta')).toContainText('Key change');

  // Second click toggles off, Cancel and Escape also clear armed cues, and keys 1-6 arm cues.
  await keyChange.click();
  await expect(keyChange).toHaveAttribute('aria-pressed', 'false');
  await expect(composer.locator('#perf-clear')).toBeHidden();

  await composer.locator('[data-cue="crescendo"]').focus();
  await page.keyboard.press('2');
  await expect(composer.locator('[data-cue="breakdown"]')).toHaveAttribute('aria-pressed', 'true');
  await composer.locator('#perf-clear').click();
  await expect(composer.locator('[data-cue="breakdown"]')).toHaveAttribute('aria-pressed', 'false');

  await page.keyboard.press('6');
  await expect(composer.locator('[data-cue="resolve"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(composer.locator('.chord')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(composer.locator('[data-cue="resolve"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(composer.locator('.chord')).toHaveCount(8);
  expect(errors).toEqual([]);
});

test('performance panel steers the track on the next bar in real time', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await page.evaluate(() => {
    const el = document.querySelector('audiobus-composer') as any;
    (window as any).perfNotes = [];
    (window as any).cueEvents = [];
    el.hostClock = true;
    el.setOutput({ label: 'Perf sink', send: (bytes: number[]) => (window as any).perfNotes.push([...bytes]) });
    el.addEventListener('composer-cue', (e: CustomEvent) => (window as any).cueEvents.push(e.detail));
    el.configure({ genre: 'rock', root: 0, energy: 0.35, tempo: 120 });
    return el.start();
  });

  await composer.locator('[data-cue="bridge"]').click();
  await expect(composer.locator('#perf-status')).toContainText('Bridge armed for bar 2');
  await page.evaluate(() => {
    const el = document.querySelector('audiobus-composer') as any;
    el.advance(3.6);
    el.advance(0.5);
  });
  await expect(composer.locator('#score-meta')).toContainText('Bridge');

  await composer.locator('[data-cue="key-change"]').click();
  await page.evaluate(() => {
    const el = document.querySelector('audiobus-composer') as any;
    el.advance(3.5);
    el.advance(0.5);
  });
  await expect(composer.locator('[name="root"]')).toHaveValue('2');
  await expect(composer.locator('[data-cue-hint="key-change"]')).toHaveText('D → E');
  await expect(composer.locator('#applied')).toContainText('Applied:');

  await composer.locator('[data-cue="crescendo"]').click();
  await page.evaluate(() => (document.querySelector('audiobus-composer') as any).advance(3.6));
  await expect(composer.locator('#perf-status')).toContainText('Active: Crescendo');
  const energyAfter = await composer.locator('[name="energy"]').inputValue();
  expect(Number(energyAfter)).toBeGreaterThanOrEqual(0.65);

  await page.evaluate(() => (document.querySelector('audiobus-composer') as any).finish());
  await composer.locator('[data-cue="resolve"]').click();
  await page.evaluate(() => {
    const el = document.querySelector('audiobus-composer') as any;
    el.advance(0.1);
    el.advance(4.5);
  });
  await expect(composer.locator('#live-label')).toHaveText('Ready to compose');

  const check = await page.evaluate(() => {
    const active = new Set();
    for (const [s, p] of (window as any).perfNotes as number[][]) {
      const k = `${s & 15}:${p}`;
      if ((s & 240) === 144) active.add(k);
      else if ((s & 240) === 128) active.delete(k);
    }
    return {
      active: active.size,
      count: (window as any).perfNotes.length,
      cueEvents: (window as any).cueEvents.length,
      overflow: document.documentElement.scrollWidth <= innerWidth,
    };
  });
  expect(check.count).toBeGreaterThan(0);
  expect(check.active).toBe(0);
  expect(check.cueEvents).toBeGreaterThanOrEqual(4);
  expect(check.overflow).toBe(true);
  expect(errors).toEqual([]);
});

test('tuning, groove, dynamics, genre mixing and algorithm combination work in the UI', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const composer = page.locator('audiobus-composer');
  await composer.getByText('Theme & harmony').click();
  await composer.getByLabel('Tuning').selectOption('just');
  await expect(composer.locator('#score-meta')).toContainText('Just Intonation');
  await composer.getByLabel('Groove').selectOption('polyrhythm');
  await expect(composer.locator('#score-meta')).toContainText('Polyrhythm');
  await composer.getByLabel('Blend style').selectOption('dnb');
  await expect(composer.locator('#score-meta')).toContainText('Pop × Drum & bass');
  await expect(composer.getByLabel('Blend mode')).toBeEnabled();
  await composer.getByLabel('Combine algorithm').selectOption('life');
  await expect(composer.getByLabel('Combine mode')).toBeEnabled();
  await expect(composer.locator('#reason')).toContainText('game of life');
  await expect(page).toHaveURL(/tuning=just/);
  await expect(page).toHaveURL(/mixGenre=dnb/);
  await expect(page).toHaveURL(/mixAlgo=life/);
  expect(errors).toEqual([]);
});
