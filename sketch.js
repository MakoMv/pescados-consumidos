let peces = [];
let agujeroNegro;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(173, 216, 230);

  // Crea un agujero negro en el centro del canvas
  agujeroNegro = new AgujeroNegro(width / 2, height / 2, 50);
}

function draw() {
  background(173, 216, 230);

  // Dibuja y actualiza la posición del agujero negro
  agujeroNegro.mostrar();

  // Dibuja y actualiza la posición de cada pez
  for (let i = peces.length - 1; i >= 0; i--) {
    peces[i].mover();
    peces[i].verificarAtraccion(agujeroNegro);
    peces[i].mostrarSombra(); // Agrega la sombra debajo del pez
    peces[i].mostrar();

    // Verifica si el pez ha llegado al centro del agujero negro y lo elimina
    if (peces[i].llegoAlCentro(agujeroNegro)) {
      peces.splice(i, 1);
    }
  }
}

function mouseClicked() {
  // Agrega un nuevo pez en la posición del clic
  let nuevoPez = new Pez(mouseX, mouseY);
  peces.push(nuevoPez);
}

class AgujeroNegro {
  constructor(x, y, radio) {
    this.x = x;
    this.y = y;
    this.radio = radio;
  }

  mostrar() {
    // Dibuja el agujero negro
    fill(0);
    noStroke();
    ellipse(this.x, this.y, this.radio * 2);
  }
}

class Pez {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velX = random(1, 3) * (random() > 0.5 ? 1 : -1);
    this.velY = random(1, 3) * (random() > 0.5 ? 1 : -1);
    this.tamano = random(20, 50);
    this.angulo = atan2(this.velY, this.velX); // Ángulo inicial
    this.tailAngle = 0;
    this.tailDirection = 1;
  }

  mover() {
    // Cambia de dirección suavemente
    let nuevoAngulo = atan2(this.velY, this.velX);
    this.angulo = lerpAngle(this.angulo, nuevoAngulo, 0.1);

    this.x += this.velX;
    this.y += this.velY;

    if (this.x < 0 || this.x > width) {
      this.velX *= -1;
    }

    if (this.y < 0 || this.y > height) {
      this.velY *= -1;
    }
  }

  verificarAtraccion(agujeroNegro) {
    let distancia = dist(this.x, this.y, agujeroNegro.x, agujeroNegro.y);
    if (distancia < agujeroNegro.radio * 1.5) {
      // Calcula la dirección hacia el agujero negro
      let dx = agujeroNegro.x - this.x;
      let dy = agujeroNegro.y - this.y;
      let angulo = atan2(dy, dx);

      // Atracción hacia el agujero negro
      this.velX = cos(angulo) * 2;
      this.velY = sin(angulo) * 2;
    }
  }

  llegoAlCentro(agujeroNegro) {
    let distancia = dist(this.x, this.y, agujeroNegro.x, agujeroNegro.y);
    return distancia < agujeroNegro.radio * 0.5;
  }

  mostrar() {
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    fill(255, 165, 0);

    let tailOffset = sin(this.tailAngle) * 10;
    triangle(
      -this.tamano / 2, 0,
      -this.tamano - tailOffset, -this.tamano / 4,
      -this.tamano - tailOffset, this.tamano / 4
    );

    this.tailAngle += 0.1 * this.tailDirection;
    if (this.tailAngle > PI / 6 || this.tailAngle < -PI / 6) {
      this.tailDirection *= -1;
    }

    ellipse(0, 0, this.tamano, this.tamano / 2);
    triangle(
      -this.tamano / 2, 0,
      -this.tamano, -this.tamano / 4,
      -this.tamano, this.tamano / 4
    );
    pop();
  }

  mostrarSombra() {
    push();
    translate(this.x, this.y + this.tamano / 4);
    rotate(this.angulo);
    fill(100, 100, 100, 100); // Color de sombra (gris oscuro con transparencia)
    ellipse(0, 0, this.tamano, this.tamano / 2);
    pop();
  }
}

// Función para interpolar ángulos suavemente
function lerpAngle(start, end, t) {
  let maxAngle = PI * 2;
  let da = (end - start) % maxAngle;
  let change = 2 * da % maxAngle - da;
  return start + change * t;
}
