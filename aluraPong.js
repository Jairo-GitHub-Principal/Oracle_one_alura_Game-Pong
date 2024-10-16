// Variáveis para armazenar as raquetes, a bola e as barras horizontais
let raqueteJogador, raqueteComputador, bola, barraSuperior, barraInferior;
// Variáveis para armazenar as imagens de fundo, bola e barras
let fundoImg, bolaImg, barra1Img, barra2Img; 

// Função preload é usada para carregar as imagens antes de o jogo começar
function preload() {
  fundoImg = loadImage('fundo1.png'); // Carrega a imagem de fundo
  bolaImg = loadImage('bola.png'); // Carrega a imagem da bola
  barra1Img = loadImage('barra01.png'); // Carrega a imagem da raquete do jogador
  barra2Img = loadImage('barra02.png'); // Carrega a imagem da raquete do computador
}

// Função setup define a configuração inicial do jogo
function setup() {
  createCanvas(800, 400); // Cria o canvas (área de desenho) com 800x400 pixels
  // Cria as raquetes para o jogador e para o computador
  raqueteJogador = new Raquete(30, height / 2, 10, 60); // Raquete do jogador (esquerda)
  raqueteComputador = new Raquete(width - 40, height / 2, 10, 60); // Raquete do computador (direita)
  bola = new Bola(10); // Cria a bola com raio 10
  // Cria as barras superiores e inferiores (bordas do campo de jogo)
  barraSuperior = new Barra(0, 0, width, 5); 
  barraInferior = new Barra(0, height, width, 5);
}

// Função draw é chamada repetidamente para atualizar a tela do jogo
function draw() {
  // Escala a imagem de fundo para preencher o canvas
  let escala = Math.max(width / fundoImg.width, height / fundoImg.height);
  let imgWidth = fundoImg.width * escala;
  let imgHeight = fundoImg.height * escala;
  let imgX = (width - imgWidth) / 2;
  let imgY = (height - imgHeight) / 2;
  image(fundoImg, imgX, imgY, imgWidth, imgHeight); // Desenha a imagem de fundo

  // Atualiza as posições das raquetes, bola e barras horizontais
  raqueteJogador.atualizar(); // Atualiza a posição da raquete do jogador
  raqueteComputador.atualizar(); // Atualiza a posição da raquete do computador
  bola.atualizar(barraSuperior, barraInferior); // Atualiza a posição da bola e verifica colisões com as barras

  // Verifica colisões entre a bola e as raquetes
  bola.verificarColisaoRaquete(raqueteJogador); // Colisão com a raquete do jogador
  bola.verificarColisaoRaquete(raqueteComputador); // Colisão com a raquete do computador

  // Desenha as raquetes, a bola e as barras horizontais na tela
  raqueteJogador.exibir(); // Desenha a raquete do jogador
  raqueteComputador.exibir(); // Desenha a raquete do computador
  bola.exibir(); // Desenha a bola
  barraSuperior.exibir(); // Desenha a barra superior
  barraInferior.exibir(); // Desenha a barra inferior
}

// Classe Raquete define o comportamento das raquetes (jogador e computador)
class Raquete {
  constructor(x, y, w, h) {
    // Atributos da raquete: posição (x, y), largura (w) e altura (h)
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // Função atualizar controla o movimento da raquete
  atualizar() {
    if (this === raqueteJogador) {
      // Se for a raquete do jogador, segue o movimento do mouse no eixo Y
      this.y = mouseY;
    } else {
      // Raquete do computador segue a bola com velocidade limitada
      if (bola.y > this.y + this.h / 2) {
        this.y += 3; // Move para baixo se a bola estiver abaixo
      } else if (bola.y < this.y - this.h / 2) {
        this.y -= 3; // Move para cima se a bola estiver acima
      }
    }
    // Limita o movimento das raquetes para não sair da área de jogo
    this.y = constrain(this.y, this.h / 2 + barraSuperior.h, height - this.h / 2 - barraInferior.h);
  }

  // Função exibir desenha a raquete no canvas
  exibir() {
    let img;
    // Seleciona a imagem correta para a raquete (jogador ou computador)
    if (this === raqueteJogador) {
      img = barra1Img; // Imagem da raquete do jogador
    } else {
      img = barra2Img; // Imagem da raquete do computador
    }
    push();
    imageMode(CENTER); // Define o modo de exibição da imagem no centro
    translate(this.x, this.y); // Posiciona a raquete
    scale(this.h / 400.0); // Escala a imagem de acordo com a altura da raquete
    image(img, 0, 0, img.width, img.height); // Desenha a imagem da raquete
    pop();
  }
}

// Classe Bola define o comportamento da bola no jogo
class Bola {
  constructor(r) {
    this.r = r; // Define o raio da bola
    this.reiniciar(); // Inicializa a bola no centro do campo
  }
  
  // Função para aumentar a velocidade da bola após uma colisão
  aumentarVelocidade() {
    const fatorAumento = 1.1; // Fator de aumento de velocidade
    this.velocidadeX *= fatorAumento; // Aumenta a velocidade no eixo X
    this.velocidadeY *= fatorAumento; // Aumenta a velocidade no eixo Y
  }

  // Função para reiniciar a bola no centro após marcar ponto
  reiniciar() {
    this.anguloRotacao = 0; // Reseta o ângulo de rotação
    this.x = width / 2; // Posição inicial no centro do campo (eixo X)
    this.y = height / 2; // Posição inicial no centro do campo (eixo Y)
    this.velocidadeX = random([-4, -3, 3, 4]); // Define a velocidade inicial aleatória no eixo X
    this.velocidadeY = random(-3, 3); // Define a velocidade inicial aleatória no eixo Y
  }

  // Função atualizar move a bola e verifica colisões com as barras
  atualizar(barraSuperior, barraInferior) {
    this.x += this.velocidadeX; // Move a bola no eixo X
    this.y += this.velocidadeY; // Move a bola no eixo Y

    // Verifica colisão com as barras superior e inferior
    if (
      this.y - this.r / 2 <= barraSuperior.y + barraSuperior.h || // Colisão com a barra superior
      this.y + this.r / 2 >= barraInferior.y - barraInferior.h // Colisão com a barra inferior
    ) {
      this.velocidadeY *= -1; // Inverte a direção no eixo Y
    }

    // Verifica se a bola saiu da tela pela direita ou esquerda
    if (this.x + this.r / 2 >= width) {
      this.reiniciar(); // Reinicia a bola se sair pela direita (ponto do jogador)
    } else if (this.x - this.r / 2 <= 0) {
      raqueteComputador.y = random(height - raqueteComputador.h); // Movimenta a raquete do computador
      this.reiniciar(); // Reinicia a bola se sair pela esquerda (ponto do computador)
    }

    // Atualiza o ângulo de rotação da bola
    this.anguloRotacao += Math.atan2(this.velocidadeY, this.velocidadeX) / 5;
  }

  // Função para verificar a colisão da bola com uma raquete
  verificarColisaoRaquete(raquete) {
    if (
      this.x - this.r / 2 <= raquete.x + raquete.w / 2 && // Verifica colisão no eixo X
      this.x + this.r / 2 >= raquete.x - raquete.w / 2 &&
      this.y + this.r / 2 >= raquete.y - raquete.h / 2 && // Verifica colisão no eixo Y
      this.y - this.r / 2 <= raquete.y + raquete.h / 2
    ) {
      this.velocidadeX *= -1; // Inverte a direção no eixo X
      let posicaoRelativa = (this.y - raquete.y) / raquete.h; // Calcula a posição relativa da bola na raquete
      let anguloBola = posicaoRelativa * PI / 3 * 2.3; // Define o ângulo da bola após a colisão
      this.velocidadeY = this.velocidadeX * Math.tan(anguloBola); // Ajusta a velocidade no eixo Y com base no ângulo
      this.aumentarVelocidade(); // Aumenta a velocidade da bola
    }
  }

  // Função exibir desenha a bola na tela
  exibir() {
    push();
    translate(this.x, this.y); // Posiciona a bola
    rotate(this.anguloRotacao); // Aplica rotação à bola
    imageMode(CENTER); // Define o modo de exibição da imagem no centro
    image(bolaImg, 0, 0, 100, 100); // Desenha a imagem da bola
    pop();
  }
}

// Classe Barra define as barras superior e inferior do campo
class Barra {
  constructor(x, y, w, h) {
    this.x = x; // Posição no eixo X
    this.y = y; // Posição no eixo Y
    this.w = w; // Largura da barra
    this.h = h; // Altura da barra
  }

  // Função exibir desenha a barra na tela
  exibir() {
    noFill(); // Define a cor de preenchimento como transparente
    strokeWeight(4); // Define a espessura da borda da barra
    rect(this.x, this.y, this.w, this.h); // Desenha a barra no canvas
  }
}
