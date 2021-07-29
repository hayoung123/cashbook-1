function drawPieChart(canvasID: string): void {
  const canvas: HTMLCanvasElement | void = document.getElementById(canvasID);

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');

  const x = 127;
  const y = 127;
  const radius = 127;
  const startAngle = (Math.PI / 180) * 90 * -1;
  const endAngle = (Math.PI / 180) * 120;

  ctx.fillStyle = '#2ac1bc';
  ctx?.beginPath();
  ctx?.moveTo(x, y);
  ctx?.arc(x, y, radius, startAngle, endAngle);
  ctx?.closePath();
  ctx?.fill();
}

export default drawPieChart;
