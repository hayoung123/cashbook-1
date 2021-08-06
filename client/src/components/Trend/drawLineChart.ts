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

  // Chart start
  ctx.moveTo(gridWidth, 270 - (info[0] * heightUnit - offset));
  ctx.beginPath();

  let preX = gridWidth;
  let preY = 270 - (info[0] * heightUnit - offset);

  // Draw chart
  info.forEach((price, i) => {
    const x = gridWidth * (i + 1);
    const y = 270 - (price * heightUnit - offset);

    ctx.bezierCurveTo((preX + x) / 2, preY, (preX + x) / 2, y, x, y);

    preX = x;
    preY = y;
  });
  ctx.stroke();

  // Draw points and texts
  const point = element.querySelector('#point') as SVGImageElement;
  point.addEventListener('load', () => {
    info.forEach((price, i) => {
      const x = gridWidth * (i + 1);
      const y = 270 - (price * heightUnit - offset);
      ctx.fillText(getNumberWithComma(price), x, y - 12);
      ctx.drawImage(point, x - 5, y - 5);
    });
  });
}

export default drawLineChart;
