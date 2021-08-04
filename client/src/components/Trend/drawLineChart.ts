import { COORDINATE_WIDTH, COLUMNS } from './drawCoordinatePlane';

import { getNumberWithComma } from 'src/utils/price';

function drawLineChart(element: HTMLElement, canvasID: string, info: number[]): void {
  const canvas: HTMLCanvasElement | null = element.querySelector(`#${canvasID}`);

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  // CANVAS Style
  ctx.strokeStyle = '#a0e1e0';
  ctx.lineWidth = 4;
  ctx.textAlign = 'center';
  ctx.font = '12px Do Hyeon';

  // Chart height range setting
  const minValue = Math.min(...info);
  const maxValue = Math.max(...info);

  const gridWidth = COORDINATE_WIDTH / COLUMNS;
  const heightUnit = 240 / (maxValue - minValue);
  const offset = minValue * heightUnit;

  // Chart Start
  ctx.moveTo(gridWidth, 270 - (minValue * heightUnit - offset));
  ctx.beginPath();

  info.forEach((price, i) => {
    const x = gridWidth * (i + 1);
    const y = 270 - (price * heightUnit - offset);

    ctx.lineTo(x, y);
  });
  ctx.stroke();

  info.forEach((price, i) => {
    const x = gridWidth * (i + 1);
    const y = 270 - (price * heightUnit - offset);
    ctx.fillText(getNumberWithComma(price), x, y - 12);
  });
}

export default drawLineChart;
