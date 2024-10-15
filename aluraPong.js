// Variáveis para as raquetes, bola e barras horizontais
let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;

function setup() {
  createCanvas(800, 400);
  raqueteJogador = new Raquete(30, height / 2, 10, 60);
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60);
  bola = new Bola(10);
  barraSuperior = new Barra(0, 0, width, 5);
  barraInferior = new Barra(0, height, width, 5);
}

function draw() {
  background(0);

  // Atualiza as posições das raquetes, bola e barras horizontais
  raqueteJogador.atualizar();
  raqueteComputador.atualizar();
  bola.atualizar(barraSuperior, barraInferior);

  // Verifica colisões entre bola e raquetes
  bola.verificarColisaoRaquete(raqueteJogador);
  bola.verificarColisaoRaquete(raqueteComputador);

  // Desenha as raquetes, a bola e as barras horizontais
  raqueteJogador.exibir();
  raqueteComputador.exibir();
  bola.exibir();
  barraSuperior.exibir();
  barraInferior.exibir();
}

class Raquete {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  atualizar() {
    if (this === raqueteJogador) {
      this.y = mouseY;
    } else {
      if (bola.y > this.y + this.h / 2) {
        this.y += 3;
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3;
      }
    }
    this.y = constrain(this.y, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
  }

  exibir() {
    fill(255);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Bola {
  constructor(r) {
    this.r = r;
    this.reiniciar();
  }
  
    aumentarVelocidade() {
    const fatorAumento = 1.1;
    this.velocidadeX *= fatorAumento;
    this.velocidadeY *= fatorAumento;
  }

  reiniciar() {
    this.x = width / 2;
    this.y = height / 2;
    this.velocidadeX = random([-4, -3, 3, 4]);
    this.velocidadeY = random(-3, 3);
  }

  atualizar(barraSuperior, barraInferior) {
    this.x += this.velocidadeX;
    this.y += this.velocidadeY;

    if (
      this.y - this.r / 2 <= barraSuperior.y + barraSuperior.h ||
      this.y + this.r / 2 >= barraInferior.y - barraInferior.h
    ) {
      this.velocidadeY *= -1;
    }

    if (this.x + this.r / 2 >= width) {
      this.reiniciar();
    } else if (this.x - this.r / 2 <= 0) {
      raqueteComputador.y = random(height - raqueteComputador.h);
      this.reiniciar();
    }
  }
verificarColisaoRaquete(raquete) {
  if (
    this.x - this.r / 2 <= raquete.x + raquete.w / 2 &&
    this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
    this.y + this.r / 2 >= raquete.y - raquete.h / 2 &&
    this.y - this.r / 2 <= raquete.y + raquete.h / 2
  ) {
    // Inverte a direção horizontal da bola
    this.velocidadeX *= -1;

    // Calcula a posição relativa da bola na raquete (entre -0.5 e 0.5)
    let posicaoRelativa = (this.y - raquete.y) / raquete.h;

    // Define o ângulo da bola após a colisão
    let anguloBola = posicaoRelativa * PI / 3 * 2.3;

    // Atualiza a velocidade vertical da bola com base no ângulo
    this.velocidadeY = this.velocidadeX * Math.tan(anguloBola);

    // Aumenta a velocidade da bola
    this.aumentarVelocidade();
  }
}

  exibir() {
    fill(255);
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.r);
  }
}

class Barra {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  exibir() {
    fill(color(255, 0,0));
    rectMode(CENTER);
    rect(this.x + this.w / 2, this.y, this.w, this.h);
  }
}







/************************codigos do arquivo index.js */

// Função para desenhar as bordas superior e inferior
function desenharBordas() {
  ctx.strokeStyle = 'orange'; // Cor das bordas
  ctx.lineWidth = 5; // Largura da borda

  // Desenhar borda superior
  ctx.beginPath();
  ctx.moveTo(0, 2.5);  // Corrigido para começar na posição correta
  ctx.lineTo(canvas.width, 2.5);
  ctx.stroke();

  // Desenhar borda inferior
  ctx.beginPath();
  ctx.moveTo(0, canvas.height -2.5);  // Corrigido para desenhar na borda inferior
  ctx.lineTo(canvas.width, canvas.height - 2.5);
  ctx.stroke();
}
