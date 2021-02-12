import "./style.css";
import p5 from "p5";
import { collideRectCircle, collideCirclePoly } from "p5collide";
import { Asteroid } from "./asteroid";
import { Laser } from "./laser";
import { Explosion } from "./explosion";
import { Spaceship } from "./spaceship";
import { Stars } from "./stars";

let spaceship: Spaceship;
let stars: Stars;
let lasers: Laser[] = [];
const asteroids: Asteroid[] = [];
let explosions: Explosion[] = [];
let gameOver = false;

function preload(p: p5) { 
  Spaceship.preload(p);
  Laser.preload(p);
  Asteroid.preload(p);
  Explosion.preload(p);
  spaceship = new Spaceship(p, 250, 360);
  stars = new Stars(p);
}

function setup(p: p5) {
  p.createCanvas(500, 400);
}

function draw(p: p5) {
  p.background("black");
  if (gameOver) {
    p.textSize(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill("red");
    p.noStroke();
    p.text("GAME OVER", p.width / 2, p.height / 2);
    return;
  }

  stars.draw();
  drawAsteroids(p);
  drawLasers(p);
  drawSpaceship(p);
  drawExplosions(p);
  detectCollisions(p);
}

function drawExplosions(p: p5) {
  for (const   explosion of explosions) {
    explosion.draw();
    explosion.duration++;
  }

  explosions = explosions.filter(e => !e.reachedAnimationEnd);
}

function detectCollisions(p: p5) {
  const asteroidCollisions = Asteroid.getCollidingLasers(lasers, asteroids);
  explosions.push(
    ...asteroidCollisions.map(c => {
      return new Explosion(p, lasers[c.laserIndex].x, lasers[c.laserIndex].y);
    })
  );

  for (let i = 0; i < asteroidCollisions.length; i++) {
    asteroids.splice(asteroidCollisions[i].asteroidIndex, 1);
  }
  if (spaceship.isCollidingWithAsteroids(p, asteroids)) {
    gameOver = true;
  }
}

function drawSpaceship(p: p5) {
  // https://keycode.info/
  if (p.keyIsDown(p.LEFT_ARROW) && spaceship.x >= 5) spaceship.x -= 5;
  else if (p.keyIsDown(p.RIGHT_ARROW) && spaceship.x <= p.width - 2)
    spaceship.x += 5;

  spaceship.draw();
}

function keyPressed(p: p5) {
  if (p.keyCode === 32) {
    lasers.push(new Laser(p, spaceship.x, spaceship.y));
  }
}

function drawAsteroids(p: p5) {
  if (p.frameCount % 120 === 0) {
    asteroids.push(new Asteroid(p, p.random(0, p.width), 0, 10));
  }

  for (const asteroid of asteroids) {
    asteroid.draw();
    asteroid.y++;
    asteroid.size += 0.05;
  }
}

function drawLasers(p: p5) {
  for (const laser of lasers) {
    laser.draw();
    laser.move();
  }
}

const p = new p5((p: p5) => {
  p.preload = () => preload(p);
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.keyPressed = () => keyPressed(p);
  return p;
});
