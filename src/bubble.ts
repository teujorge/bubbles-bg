export type Vector = {
  x: number;
  y: number;
};

export type ColorRGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type BubbleParams = {
  blur: number;
  minSpeed: number;
  maxSpeed: number;
  minSize: number;
  maxSize: number;
  colors?: ColorRGBA[];
};

export class Bubble {
  blur: number; // px
  size!: number; // px
  speed!: number; // p/s
  colors?: ColorRGBA[]; // list of rgba

  minSize: number; // % of width
  maxSize: number; // % of width

  minSpeed: number; // px/s
  maxSpeed: number; // px/s

  color!: ColorRGBA; // rgba

  position!: Vector; // spawn point
  destination!: Vector; // move vector

  constructor({
    blur,
    minSpeed,
    maxSpeed,
    minSize,
    maxSize,
    colors,
  }: BubbleParams) {
    this.blur = blur;
    this.colors = colors;

    this.minSize = minSize;
    this.maxSize = maxSize;

    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;

    this.resetBubble(true);
  }

  resetBubble(firstReset = false) {
    this.size = this.randSize();
    this.speed = this.randSpeed();
    this.color = this.randColor();

    const newInitialPosition = this.randInitialPosition(firstReset);
    this.position = newInitialPosition;

    const newFinalPosition = this.randFinalPosition(newInitialPosition);
    this.destination = newFinalPosition;
  }

  widthPercentageToPixels(p: number): number {
    const pixels = (innerWidth * p) / 100;
    return pixels;
  }

  randInitialPosition(firstTime: boolean): Vector {
    const pos = {
      x: Math.random() * innerWidth,
      y: innerHeight + (this.size + this.blur) / 2,
    };

    if (firstTime) pos.y = Math.random() * innerHeight;

    return pos;
  }

  randFinalPosition(origin: Vector): Vector {
    const pos = {
      x: Math.random() * innerWidth,
      y: -origin.y,
    };

    return pos;
  }

  randSpeed(): number {
    const speed =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    return speed > 0 ? speed : 1;
  }

  randSize(): number {
    const percentage =
      Math.random() * (this.maxSize - this.minSize) + this.minSize;
    return percentage >= 0 ? this.widthPercentageToPixels(percentage) : 0;
  }

  randColor(): ColorRGBA {
    if (this.colors && this.colors.length > 0) {
      let randIndex = Math.round(Math.random() * this.colors.length - 1);

      const color = this.colors[randIndex];
      if (color) return color;
      return { r: 0, g: 0, b: 0, a: 0 };
    }

    const minOpacity = 0.4;
    const maxOpacity = 0.8;

    return {
      r: Math.random() * 200,
      g: Math.random() * 200,
      b: Math.random() * 200,
      a: Math.random() * (maxOpacity - minOpacity) + minOpacity,
    };
  }

  getMoveDirection(): Vector {
    const direction = {
      x: this.destination.x - this.position.x,
      y: this.destination.y - this.position.y,
    };

    const directionLength = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    direction.x /= directionLength;
    direction.y /= directionLength;

    return direction;
  }
}
