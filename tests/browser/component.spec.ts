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
  expect(genres.length).toBe(13);
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
