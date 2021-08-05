export type Pie = Array<{
  color: string;
  pie: number;
}>;

const RADIAN = Math.PI / 50;
const START_ANGLE = -25;
const PIE_CHART_RADIUS = 127;

function drawPieChart(element: HTMLElement, canvasID: string, info: Pie): void {
  const canvas: HTMLCanvasElement | null = element.querySelector(`#${canvasID}`);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const x = PIE_CHART_RADIUS;
  const y = PIE_CHART_RADIUS;
  const radius = PIE_CHART_RADIUS;

  let angle = START_ANGLE;

  if (info.length === 0) {
    const startAngle = RADIAN * angle;
    const endAngle = RADIAN * (angle + 100);

    ctx.fillStyle = '#2ac1bc';
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    ctx?.arc(x, y, radius, startAngle, endAngle);
    ctx?.closePath();
    ctx?.fill();
  }

  info.forEach(({ color, pie }) => {
    const startAngle = RADIAN * angle;
    angle += pie;
    const endAngle = RADIAN * angle;

    ctx.fillStyle = color;
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    ctx?.arc(x, y, radius, startAngle, endAngle);
    ctx?.closePath();
    ctx?.fill();
  });
}

export default drawPieChart;
