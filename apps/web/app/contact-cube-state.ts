export type Axis = 0 | 1 | 2;
type Sign = -1 | 1;
type Vector = [number, number, number];
export type Turn = { axis: Axis; side: Sign | 0; direction: Sign };

export const faces = [
  { axis: 2, side: 1, rotation: '', right: [0, 1], down: [1, 1], color: '#50b99b', label: 'verde' },
  { axis: 2, side: -1, rotation: 'rotateY(180deg)', right: [0, -1], down: [1, 1], color: '#679ce8', label: 'azul' },
  { axis: 0, side: 1, rotation: 'rotateY(90deg)', right: [2, -1], down: [1, 1], color: '#eb9459', label: 'laranja' },
  { axis: 0, side: -1, rotation: 'rotateY(-90deg)', right: [2, 1], down: [1, 1], color: '#ef76ae', label: 'rosa' },
  { axis: 1, side: -1, rotation: 'rotateX(90deg)', right: [0, 1], down: [2, 1], color: '#faf4ff', label: 'branca' },
  { axis: 1, side: 1, rotation: 'rotateX(-90deg)', right: [0, 1], down: [2, -1], color: '#f3d36f', label: 'amarela' },
] as const;

export const solvedCube = Array.from({ length: 27 }, (_, id) => {
  const position: Vector = [id % 3 - 1, Math.floor(id / 3) % 3 - 1, Math.floor(id / 9) - 1];
  const stickers = faces.flatMap(({ axis, side, color }) => {
    if (position[axis] !== side) return [];
    const normal: Vector = [0, 0, 0];
    normal[axis] = side;
    return [{ normal, color }];
  });
  return { id, position, stickers };
}).filter(({ position }) => position.some(Boolean));

type Cube = typeof solvedCube;
export const loosePiece = solvedCube.find(({ position: [x, y, z] }) => x === 0 && y === -1 && z === 1)!;

export function turnFace(cube: Cube, { axis, side, direction }: Turn): Cube {
  const a = (axis + 1) % 3;
  const b = (axis + 2) % 3;
  const rotate = (vector: Vector): Vector => {
    const result: Vector = [...vector];
    result[a] = -direction * vector[b];
    result[b] = direction * vector[a];
    return result;
  };
  return cube.map((piece) => piece.position[axis] === side ? {
    ...piece,
    position: rotate(piece.position),
    stickers: piece.stickers.map((sticker) => ({ ...sticker, normal: rotate(sticker.normal) })),
  } : piece);
}

const tutorialTurns = [
  { axis: 0, side: 1, direction: 1 },
  { axis: 1, side: 1, direction: 1 },
  { axis: 0, side: 1, direction: -1 },
] satisfies Turn[];

export const tutorialCube = tutorialTurns.reduce(turnFace, solvedCube);
export const tutorialSolution: Turn[] = [...tutorialTurns].reverse().map(({ direction, ...move }) => ({
  ...move, direction: direction === 1 ? -1 : 1,
}));

export function scrambleCube(): Cube {
  return scrambleTurns().reduce(turnFace, solvedCube);
}

export function scrambleTurns(): Turn[] {
  const moves: Turn[] = [];
  let previous = -1;
  for (let i = 0; i < 14; i++) {
    const choices = faces.filter(({ axis }) => axis !== previous);
    const { axis, side } = choices[Math.floor(Math.random() * choices.length)];
    moves.push({ axis, side, direction: Math.random() > .5 ? 1 : -1 });
    previous = axis;
  }
  return moves;
}

export function isSolved(cube: Cube) {
  return faces.every(({ axis, side }) => {
    const stickers = cube.flatMap(({ stickers }) => stickers.filter(({ normal }) => normal[axis] === side));
    return stickers.length === 9 && stickers.every(({ color }) => color === stickers[0].color);
  });
}

export function sliceTurn(face: typeof faces[number], horizontal: boolean, index: Sign | 0, toward: Sign): Turn {
  const [axis, sign] = horizontal ? face.down : face.right;
  // Positive rotation around local down moves the face toward local right.
  // Positive rotation around local right moves the face toward local up.
  return {
    axis,
    side: index === 0 ? 0 : index === sign ? 1 : -1,
    direction: toward === sign ? (horizontal ? 1 : -1) : (horizontal ? -1 : 1),
  };
}

export function frontFace(pitch: number, yaw: number) {
  const x = pitch * Math.PI / 180;
  const y = yaw * Math.PI / 180;
  const depth = [-Math.sin(y) * Math.cos(x), Math.sin(x), Math.cos(y) * Math.cos(x)];
  return faces.reduce((front, face) =>
    depth[face.axis] * face.side > depth[front.axis] * front.side ? face : front,
  );
}
