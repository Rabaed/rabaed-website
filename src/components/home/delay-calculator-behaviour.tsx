'use client';

import { useEffect } from 'react';
import {
  calculatorDisplay,
  figureText,
  settingsFromValues,
  type CalculatorWords,
  type Figure,
} from '@/components/home/delay-calculator-state';

/**
 * Redraws the calculator whenever a slider moves, attached to markup the server
 * already sent: the three readings, the cost and its two parts, and each track
 * filled up to its thumb. Renders nothing. The words it writes beside the
 * numbers are handed down by `DelayCalculator`.
 *
 * It also redraws once on arrival, from whatever the sliders hold. A browser
 * that restores a form on the way back to a page puts the sliders back where
 * the visitor left them, and the figures the server drew would then describe
 * other settings.
 */
export function DelayCalculatorBehaviour({ words }: { words: CalculatorWords }) {
  useEffect(() => {
    const calculator = document.getElementById('calc');
    if (!calculator) return;
    const sliders = [...calculator.querySelectorAll<HTMLInputElement>('input[type="range"]')];
    const readings = [...calculator.querySelectorAll<HTMLElement>('.lr b')];
    const cost = calculator.querySelector<HTMLElement>('.out b');
    const breakdown = calculator.querySelectorAll<HTMLElement>('.out small')[1];
    if (sliders.length !== 3 || readings.length !== 3 || !cost || !breakdown) return;

    const write = (target: HTMLElement, figure: Figure) => {
      const [number, word] = target.querySelectorAll('span');
      number.textContent = figure.number;
      word.textContent = ` ${figure.word}`;
    };

    const redraw = () => {
      const display = calculatorDisplay(settingsFromValues(sliders.map((slider) => Number(slider.value))), words);
      sliders.forEach((slider, index) => {
        write(readings[index], display.readings[index]);
        slider.setAttribute('aria-valuetext', figureText(display.readings[index]));
        slider.style.background = display.tracks[index];
      });
      write(cost, display.cost);
      breakdown.textContent = display.breakdown;
    };

    sliders.forEach((slider) => slider.addEventListener('input', redraw));
    redraw();

    return () => sliders.forEach((slider) => slider.removeEventListener('input', redraw));
  }, [words]);

  return null;
}
