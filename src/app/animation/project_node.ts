import { Vector } from 'app/animation/vector';

export class ProjectNode {

  RING_RADIUS: number;
  MAX_LINK_LENGTH: number;
  MOUSE_HOVER_DIST: number;
  CLICKABLE_RADIUS_ADD: number;

  IDLE_DRAG: number;
  ACTIVE_DRAG: number;
  ACTIVE_RADIUS: number;
  IDLE_RADIUS: number;
  STROKE_WIDTH: number;
  LAME_STROKE_WIDTH: number;

  emptyVector;
  hoverState;
  fadeCount;
  start;
  age;
  pos;
  vel;
  acc;
  radius;
  center;
  active;
  link;
  linkStartTime;
  thumbImg;

  data: any;

  constructor(data) {
    this.data = data;

    this.RING_RADIUS = 265;
    this.MAX_LINK_LENGTH = 290;
    this.MOUSE_HOVER_DIST = 120;
    this.CLICKABLE_RADIUS_ADD = 0;
    this.IDLE_DRAG = 0.02;
    this.ACTIVE_DRAG = 0.5;
    this.ACTIVE_RADIUS = 175;
    this.STROKE_WIDTH = 10;

    const startAngle = Math.random() * Math.PI * 2;
    const startRadius = Math.random() * 20;
    const fallbackImg =
      '/assets/images/alphabet/'+ this.data.startsWith +'.gif';

    if (!this.data.lame && !this.data.small) {
      this.IDLE_RADIUS = 30;
    } else if (!this.data.lame && !this.active && this.data.small) {
      this.IDLE_RADIUS = 7;
      this.STROKE_WIDTH = 6;
    } else {
      this.STROKE_WIDTH = 5 - Math.floor(Math.random() * (3 - 0 + 1)) + 0;
      this.IDLE_RADIUS = 25 - (Math.floor(Math.random() * (22 - 17 + 1)) + 17);
    }

    this.emptyVector = new Vector(0, 0, 0);
    this.hoverState = 0;
    this.fadeCount = 0;
    this.start = new Date();
    this.age = 0;
    this.pos = new Vector(Math.cos(startAngle), Math.sin(startAngle), 0);
    this.pos = this.pos.mult(startRadius);
    this.vel = new Vector(0, 0, 0);
    this.acc = new Vector(0, 0, 0);
    this.radius = this.IDLE_RADIUS;
    this.center = new Vector(0, 0, 0);
    this.active = false;
    this.thumbImg = document.createElement('img');

    if (typeof this.data.iconUrlSmall !== 'undefined' && !this.data.lame) {
      this.thumbImg.src = this.data.iconUrlSmall;
    } else if (this.data.startsWith) {
      this.thumbImg.src = fallbackImg;
    }

    this.thumbImg.addEventListener('error', () => {
      this.thumbImg.src = fallbackImg;
    })
  }

  public getAge = () => {
    return new Date().getTime() - this.start;
  }

  public applyForces = () => {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc = new Vector(0, 0, 0);
  }

  public update = () => {
    if (this.active) {
      this.STROKE_WIDTH = 10;
    }  else if (!this.data.lame && this.data.small) {
      this.STROKE_WIDTH = 6;
    }
    this.age += 1;
    this.applyForces();
    this.updateLerps();
    this.drag(this.active ? this.ACTIVE_DRAG : this.IDLE_DRAG);

    if (!this.active) {
      this.jitter(0.15);
      this.keepInRing(this.RING_RADIUS, 0.00007);
      this.rotate(-0.003);
    } else {
      this.moveToCenter();
    }

    this.updateLink();
  }

  public moveToCenter = () => {
    this.pos.mult(0.85).add(this.center.mult(0.15));
  }

  public updateMousePos = (mousePos) => {
    if (!mousePos || this.data.lame) {
      return;
    }
    let diff = this.pos.copy().sub(mousePos);

    this.hoverState =
      Math.max((this.MOUSE_HOVER_DIST - diff.mag()) / this.MOUSE_HOVER_DIST, 0);
    this.hoverState *=
      Math.max(0, Math.min(1, (this.getAge() - 1000) / 5000));
  }

  public updateLerps = () => {
    const targetRadius = this.active ? this.ACTIVE_RADIUS : this.IDLE_RADIUS;
    this.radius = targetRadius * 0.1 + this.radius * 0.9;
  }

  public hitTest = (x, y) => {
    return new Vector(x, y, 0)
      .sub(this.pos).mag() < this.getDisplayRadius() +
      this.CLICKABLE_RADIUS_ADD;
  }

  public onClick = () => {
    if (this.active) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  public activate = () => {
    if (!this.data.lame) {
      this.active = true;
    }
  }

  public deactivate = () => {
    this.active = false;
  }

  public getDisplayRadius = () => {
    let r = this.radius;
    if (!this.active && !this.data.lame) {
      if (this.data.small) {
        r += (this.hoverState || 0) * 26;
      } else {
        r += (this.hoverState || 0) * 10;
      }
    }
    return r;
  }

  public keepInRing = (radius, amt) => {
    const diff = this.pos.copy();
    const mag = diff.mag();
    const force = amt * (radius - mag);
    // avoid divide by zero. #jitter() should take care of moving it off the origin
    if (mag != 0) {
      diff.normalize().mult(force);
    }
    if (mag < 80) {
      diff.mult(10); //push out faster from center on load
    }
    this.acc.add(diff);
  }

  public jitter = (amt) => {
    let force = new Vector(Math.random()-0.5, Math.random()-0.5, 0);
    force.mult(amt);
    this.acc.add(force);
  }

  public drag = (amt) => {
    this.vel.mult(1 - amt);
  }

  public rotate = (amt) => {
    let force = this.pos.copy();
    [force.x, force.y] = [-force.y, force.x];
    force.mult(amt);
    this.pos.add(force);
  }

  public render = (ctx) => {
    const r = this.getDisplayRadius();
    const alpha = (this.data.small && !this.data.focus) ? .65 : .5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI*2, true);
    ctx.fillStyle =
      this.data.lame ?
      '#ececec' :
      'rgba('+
        this.data.RGB.r +','+
        this.data.RGB.g +','+
        this.data.RGB.b +','+
        alpha +')';

    ctx.fill();
    this.renderWhiteFill(ctx);

    if (!this.data.small || this.active || this.data.lame || this.data.focus) {
      // Wait a tick before drawing the logo
      if (!this.active && !this.data.lame && this.fadeCount >= .5) {
        this.renderLogo(ctx);
      }
    }
    ctx.closePath();
    ctx.restore();
  }

  private renderWhiteFill = (ctx) => {
    let r = this.getDisplayRadius();
    r = (this.getDisplayRadius() > this.STROKE_WIDTH / 2) ?
        (r - this.STROKE_WIDTH / 2) : r;

    ctx.globalAlpha = this.active ? 1 : this.fadeCount;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI*2, true);
    ctx.fillStyle = 'white';
    ctx.fill();

    if (this.fadeCount < 1) {
      this.fadeCount += .05;
    }
  }

  public renderLogo = (ctx) => {
    const logoSize = this.getDisplayRadius() / 1.05;
    const logoPos = {
      x: this.pos.x - logoSize / 2,
      y: this.pos.y - logoSize / 2
    };

    ctx.globalAlpha = (this.fadeCount <= .9) ? this.fadeCount : .9;
    ctx.drawImage(this.thumbImg, logoPos.x, logoPos.y, logoSize, logoSize);

    // Colorize fallback logo
    if (typeof this.data.iconUrlSmall == 'undefined') {
      ctx.globalCompositeOperation = 'lighten';
      ctx.fillStyle = this.data.fallbackColor;
      ctx.fillRect(logoPos.x, logoPos.y, logoSize, logoSize);
    }
  }

  public getLineStart = () => {
    return new Vector(this.pos.x, this.pos.y, 0);
  }

  public getLineEnd = () => {
    return new Vector(this.link.pos.x, this.link.pos.y, 0);
  }

  public getDotAlpha = () => {
    return Math.min(1, this.age / 10);
  }

  public getLinkAlpha = () => {
    const distance = this.pos.copy().sub(this.link.pos).mag();
    return Math.max( 0,
      (this.MAX_LINK_LENGTH - distance) / this.MAX_LINK_LENGTH);
  }

  public renderLink = (ctx, filter) => {
    if (this.link != null && !this.data.lame) {
      ctx.save();
      ctx.beginPath();
      this.doLinkPath(ctx);
      ctx.strokeStyle = '#ececec';
      ctx.globalAlpha = this.getLinkAlpha();
      ctx.lineWidth = this.STROKE_WIDTH - 8;
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  }

  public doLinkPath = (ctx) => {
    const start = this.getLineStart();
    const end = this.getLineEnd()

    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  }

  public updateLink = () => {
    let ref;
    if (((ref = this.link) != null ?
          ref.pos.copy().sub(this.pos).mag() : void 0) > this.MAX_LINK_LENGTH) {
      this.killLink();
    }
  }

  public linkTo = (node) => {
    if (!node.data.lame) {
      this.linkStartTime = new Date;
      this.link = node;
    }
  }

  public killLink = () => {
    this.link = null;
  }

}
