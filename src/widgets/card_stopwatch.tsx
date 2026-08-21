import React, { useEffect, useRef, useState } from 'react';
import {
  AppEvents,
  renderWidget,
  useAPIEventListener,
  usePlugin,
} from '@remnote/plugin-sdk';

import '../style.css';

function formatElapsed(ms: number, showDecimals: boolean) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return showDecimals
    ? `${mm}:${ss}.${tenths}`
    : `${mm}:${ss}`;
}

function CardStopwatch() {
  const plugin = usePlugin();

  const [warnSeconds, setWarnSeconds] = useState(15);
  const [slowSeconds, setSlowSeconds] = useState(30);
  const [showDecimals, setShowDecimals] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef(Date.now());

  // Cargar tus ajustes: 15 s, 30 s y décimas.
  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      const warn = await plugin.settings.getSetting<number>('warn-seconds');
      const slow = await plugin.settings.getSetting<number>('slow-seconds');
      const decimals =
        await plugin.settings.getSetting<boolean>('show-decimals');

      if (!active) return;

      if (typeof warn === 'number') setWarnSeconds(warn);
      if (typeof slow === 'number') setSlowSeconds(slow);
      if (typeof decimals === 'boolean') setShowDecimals(decimals);
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, [plugin]);

  // Cuando calificas una tarjeta y RemNote pasa a la siguiente:
  // volver inmediatamente a 00:00.
  useAPIEventListener(
    AppEvents.QueueCompleteCard,
    undefined,
    () => {
      startedAtRef.current = Date.now();
      setElapsed(0);
    }
  );

  // Cronómetro ascendente.
  useEffect(() => {
    startedAtRef.current = Date.now();
    setElapsed(0);

    const timer = window.setInterval(() => {
      setElapsed(Date.now() - startedAtRef.current);
    }, showDecimals ? 100 : 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [showDecimals]);

  const seconds = elapsed / 1000;

  const state =
    seconds >= slowSeconds
      ? 'slow'
      : seconds >= warnSeconds
      ? 'warn'
      : 'ok';

  return (
    <div className="cs-wrap">
      <div className={`cs-timer cs-${state}`}>
        <span className="cs-icon">⏱</span>
        <span>{formatElapsed(elapsed, showDecimals)}</span>
      </div>
    </div>
  );
}

renderWidget(CardStopwatch);