export function portraitPointer(scene: HTMLElement, pointerX: number, pointerY: number) {
  const sceneRect = scene.getBoundingClientRect();
  const canvasRect = scene.closest('.home-hero')?.querySelector('.hero-grid')?.getBoundingClientRect();
  const centerX = sceneRect.left + sceneRect.width / 2;
  const centerY = sceneRect.top + sceneRect.height / 2;
  const left = canvasRect?.left ?? 0;
  const right = canvasRect?.right ?? window.innerWidth;
  const top = canvasRect?.top ?? 0;
  const bottom = canvasRect?.bottom ?? window.innerHeight;
  const farthestCorner = Math.hypot(
    Math.max(Math.abs(left - centerX), Math.abs(right - centerX)),
    Math.max(Math.abs(top - centerY), Math.abs(bottom - centerY)),
  );

  const dx = pointerX - centerX;
  const dy = pointerY - centerY;
  const reference = Math.max(1, farthestCorner, Math.hypot(dx, dy));
  return { x: dx / reference, y: dy / reference };
}

export function portraitLightPoint(figure: HTMLElement, frame: HTMLElement, x: number, y: number) {
  // Both transforms are centered on the scene. The frame flattens the figure
  // before projecting it, so compose the two planar projections.
  const planarTransform = (element: HTMLElement) => {
    const transform = getComputedStyle(element).transform;
    const matrix = new DOMMatrix(transform === 'none' ? undefined : transform);
    matrix.m13 = matrix.m23 = matrix.m31 = matrix.m32 = matrix.m34 = matrix.m43 = 0;
    matrix.m33 = 1;
    return matrix;
  };
  const scene = frame.parentElement!.getBoundingClientRect();
  const projection = planarTransform(frame).multiply(planarTransform(figure));
  const point = projection.inverse().transformPoint({
    x: x - scene.left - scene.width / 2,
    y: y - scene.top - scene.height / 2,
  });
  return {
    x: .5 + point.x / point.w / figure.offsetWidth,
    y: .5 + point.y / point.w / figure.offsetHeight,
  };
}
