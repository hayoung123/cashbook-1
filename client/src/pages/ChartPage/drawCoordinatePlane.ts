function drawCoordinatePlane(element: HTMLElement, canvasID: string): void {
  const canvas: HTMLCanvasElement = element.querySelector(`#${canvasID}`);

  if (!canvas) {
    return;
  }

  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

  const coordinateWidth = 750;
  const coordinateHeight = 300;
  const gridHeight = 25;
  const gridWidth = 32.6;

  for (let i = 0; i < 13; i++) {
    ctx.strokeStyle = '#ccd3d3';
    ctx?.beginPath();
    ctx?.moveTo(0, gridHeight * i);
    ctx?.lineTo(coordinateWidth, gridHeight * i);
    ctx?.stroke();
  }

  for (let i = 0; i < 24; i++) {
    ctx.strokeStyle = '#ccd3d3';
    ctx?.beginPath();
    ctx?.moveTo(gridWidth * i, 0);
    ctx?.lineTo(gridWidth * i, coordinateHeight);
    ctx?.stroke();
  }
}

export default drawCoordinatePlane;
