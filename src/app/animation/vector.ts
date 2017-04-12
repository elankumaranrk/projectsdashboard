export class Vector {

  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  public copy = () => {
    return new Vector(this.x, this.y, this.z);
  };

  public mag = () => {
    return Math.sqrt(this.magSq());
  };

  public magSq = () => {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  };

  public normalize = () => {
    this.div(this.mag());
    return this;
  };

  public add = (p) => {
    this.x += p.x;
    this.y += p.y;
    this.z += p.z;
    return this;
  };

  public sub = (p) => {
    this.x -= p.x;
    this.y -= p.y;
    this.z -= p.z;
    return this;
  };

  public mult = (n) => {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  };

  public div = (n) => {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  };
}
