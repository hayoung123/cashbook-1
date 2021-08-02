export const COORDINATE_WIDTH = 750;
export const COORDINATE_HEIGHT = 300;
export const COLUMNS = 13;
export const ROWS = 10;

function drawCoordinatePlane(element: HTMLElement, canvasID: string): void {
  const canvas: HTMLCanvasElement | null = element.querySelector(`#${canvasID}`);

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const gridHeight = COORDINATE_HEIGHT / ROWS;
  const gridWidth = COORDINATE_WIDTH / COLUMNS;

  for (let i = 0; i < COLUMNS; i++) {
    ctx.strokeStyle = '#ccd3d3';
    ctx.beginPath();
    ctx.moveTo(0, gridHeight * i);
    ctx.lineTo(COORDINATE_WIDTH, gridHeight * i);
    ctx.stroke();
  }

  for (let i = 0; i < COLUMNS; i++) {
    ctx.strokeStyle = '#ccd3d3';
    ctx.beginPath();
    ctx.moveTo(gridWidth * i, 0);
    ctx.lineTo(gridWidth * i, COORDINATE_HEIGHT);
    ctx.stroke();
  }
}

export default drawCoordinatePlane;
