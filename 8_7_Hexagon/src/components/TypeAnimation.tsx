import React, { useState, useEffect } from 'react';

export default function TypeAnimation({
  sequence,
  typeSpeed = 80,
  eraseSpeed = 45,
  delay = 1500,
}: {
  sequence: string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  delay?: number;
}) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'type' | 'pause' | 'erase'>('type');

  useEffect(() => {
    if (sequence.length === 0) return;
    const currentText = sequence[index % sequence.length];

    if (phase === 'type') {
      if (text.length >= currentText.length) {
        setPhase('pause');
        return;
      }
      const timeout = setTimeout(() => {
        setText(currentText.slice(0, text.length + 1));
      }, typeSpeed);
      return () => clearTimeout(timeout);
    } else if (phase === 'pause') {
      const timeout = setTimeout(() => {
        setPhase('erase');
      }, delay);
      return () => clearTimeout(timeout);
    } else if (phase === 'erase') {
      if (text.length === 0) {
        setIndex((prev) => prev + 1);
        setPhase('type');
        return;
      }
      const timeout = setTimeout(() => {
        setText(currentText.slice(0, text.length - 1));
      }, eraseSpeed);
      return () => clearTimeout(timeout);
    }
  }, [text, phase, index, sequence, typeSpeed, eraseSpeed, delay]);

  return (
    <span>
      {text}
      <span aria-hidden="true" className="inline-block w-[3px] h-[0.85em] ml-1 bg-current align-middle animate-pulse"></span>
    </span>
  );
}
