import { FAMILIES, type EmotionFamily } from './types.js';
import { clamp, EMOTIONS, mod } from './theory.js';

export interface EmotionPoint {
  emotion: EmotionFamily;
  /** Continuous intensity 0–1 (Plutchik tiers map to 1/3, 2/3, 1). */
  intensity: number;
}

export interface EmotionStep extends EmotionPoint {
  /** 1-based Plutchik intensity ring: 1 = mild (outer), 2 = core (middle), 3 = intense (inner). */
  tier: 1 | 2 | 3;
  /** Human-readable Plutchik label, e.g. 'Serenity', 'Joy', 'Ecstasy'. */
  label: string;
  /** True on the final step when the target emotion is reached. */
  arrival: boolean;
}

/** Maps continuous 0–1 intensity to its 1–3 Plutchik ring tier. */
export function intensityTier(intensity: number): 1 | 2 | 3 {
  return clamp(Math.ceil(intensity * 3), 1, 3) as 1 | 2 | 3;
}

/** Human-readable Plutchik label for an emotion family and intensity. */
export function emotionLabel(emotion: EmotionFamily, intensity: number): string {
  return EMOTIONS[emotion].labels[intensityTier(intensity) - 1];
}

/**
 * Shortest step-by-step path across Plutchik's Wheel of Emotions from `from` to `to`.
 * Each step moves at most one petal around the wheel and at most one intensity ring inward/outward,
 * ensuring one transitional bar per step so emotional shifts never jump-scare the listener.
 */
export function plutchikPath(from: EmotionPoint, to: EmotionPoint): EmotionStep[] {
  const fromIdx = FAMILIES.indexOf(from.emotion);
  const toIdx = FAMILIES.indexOf(to.emotion);
  const fromTier = intensityTier(from.intensity);
  const toTier = intensityTier(to.intensity);

  const cw = mod(toIdx - fromIdx, FAMILIES.length);
  const ccw = mod(fromIdx - toIdx, FAMILIES.length);
  const angularDist = Math.min(cw, ccw);
  const angularDir = angularDist === 0 ? 0 : cw <= ccw ? 1 : -1;

  const radialDelta = toTier - fromTier;
  const radialDist = Math.abs(radialDelta);
  const radialDir = Math.sign(radialDelta);

  const totalSteps = Math.max(angularDist, radialDist);
  if (totalSteps === 0) {
    if (Math.abs(to.intensity - from.intensity) > 0.05) {
      return [{
        emotion: to.emotion,
        intensity: to.intensity,
        tier: toTier,
        label: emotionLabel(to.emotion, to.intensity),
        arrival: true,
      }];
    }
    return [];
  }

  const steps: EmotionStep[] = [];
  let curIdx = fromIdx;
  let curTier: number = fromTier;
  for (let s = 1; s <= totalSteps; s++) {
    if (s <= angularDist) curIdx = mod(curIdx + angularDir, FAMILIES.length);
    if (s <= radialDist) curTier = clamp(curTier + radialDir, 1, 3);
    const arrival = s === totalSteps;
    const emotion = FAMILIES[curIdx];
    const intensity = arrival ? to.intensity : curTier / 3;
    const tier = arrival ? toTier : (curTier as 1 | 2 | 3);
    steps.push({
      emotion,
      intensity,
      tier,
      label: EMOTIONS[emotion].labels[tier - 1],
      arrival,
    });
  }
  return steps;
}

/**
 * Tracks the current sounding emotion on Plutchik's wheel and queues one bar per step
 * whenever a new target emotion is selected, preventing abrupt emotional jumps.
 */
export class EmotionFollower {
  private currentPoint: EmotionPoint;
  private targetPoint: EmotionPoint;
  private queue: EmotionStep[] = [];
  private activePath: EmotionStep[] = [];

  constructor(initial: EmotionPoint = { emotion: 'joy', intensity: 2 / 3 }) {
    this.currentPoint = { ...initial };
    this.targetPoint = { ...initial };
  }

  get current(): EmotionPoint { return { ...this.currentPoint }; }
  get target(): EmotionPoint { return { ...this.targetPoint }; }
  /** Steps remaining in the active Plutchik transition queue. */
  get remaining(): readonly EmotionStep[] { return this.queue.map(s => ({ ...s })); }
  /** Full path computed by the most recent `guideTo` call (for UI visualisation). */
  get path(): readonly EmotionStep[] { return this.activePath.map(s => ({ ...s })); }
  get transitioning(): boolean { return this.queue.length > 0; }

  /** Guide toward a new target emotion from the current sounding position on the Plutchik wheel. */
  guideTo(target: EmotionPoint): readonly EmotionStep[] {
    this.targetPoint = { ...target };
    this.queue = plutchikPath(this.currentPoint, this.targetPoint);
    this.activePath = [...this.queue];
    return this.remaining;
  }

  /**
   * Consume up to `bars` steps from the queue (one bar per Plutchik step).
   * Advances `current` to the last consumed step.
   */
  takeForBars(bars: number): EmotionStep[] {
    const taken = this.queue.splice(0, Math.max(0, Math.floor(bars)));
    if (taken.length) {
      const last = taken[taken.length - 1];
      this.currentPoint = { emotion: last.emotion, intensity: last.intensity };
    }
    return taken;
  }

  /** Advance a single bar along the queued Plutchik path. */
  stepBar(): EmotionStep {
    const next = this.queue.shift();
    if (next) {
      this.currentPoint = { emotion: next.emotion, intensity: next.intensity };
      return next;
    }
    const tier = intensityTier(this.currentPoint.intensity);
    return {
      emotion: this.currentPoint.emotion,
      intensity: this.currentPoint.intensity,
      tier,
      label: EMOTIONS[this.currentPoint.emotion].labels[tier - 1],
      arrival: true,
    };
  }

  /** Update the current sounding position (e.g. when redirecting mid-phrase from a specific bar). */
  setCurrent(point: EmotionPoint): void {
    this.currentPoint = { ...point };
  }

  /** Reset directly to an initial emotion with no pending transition. */
  reset(point: EmotionPoint): void {
    this.currentPoint = { ...point };
    this.targetPoint = { ...point };
    this.queue = [];
    this.activePath = [];
  }
}
