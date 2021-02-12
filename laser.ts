import p5 from "p5";

export class Laser {
  private static image: p5.Image;
  private age = 0;

  static preload(p: p5) {
    Laser.image = p.loadImage(
      "https://linz.coderdojo.net/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/img/shot.png"
    );
  }

  constructor(private p: p5, public x: number, public y: number) {}

  draw() {
    this.p.push();
    this.p.translate(this.x, this.y);

    const imgNumber = Math.min(3, Math.floor(this.age / 3));
    this.p.image(Laser.image, -6, 0, 12, 60);
    this.p.pop();
  }

  move() {
    //this.x += 10;
    this.y -= 10;
    this.age++;
  }
}
