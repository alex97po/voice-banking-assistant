import { useEffect, useRef } from 'react';

export default function Waveform({ getAnalyserData, isRecording }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const draw = () => {
      const data = getAnalyserData?.();
      ctx.clearRect(0, 0, w, h);

      if (!data) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const barCount = 40;
      const barWidth = (w / barCount) * 0.6;
      const gap = (w / barCount) * 0.4;
      const centerY = h / 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * data.length);
        const value = (data[dataIndex] - 128) / 128;
        const barHeight = Math.max(2, Math.abs(value) * centerY * 1.8);

        const x = i * (barWidth + gap) + gap / 2;
        const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.9)');
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.6)');
        gradient.addColorStop(1, 'rgba(14, 165, 233, 0.9)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight, barWidth, barHeight * 2, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording, getAnalyserData]);

  if (!isRecording) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: 60,
        borderRadius: 8,
        opacity: 0.9,
      }}
    />
  );
}
