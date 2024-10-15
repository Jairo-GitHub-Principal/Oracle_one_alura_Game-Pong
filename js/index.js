
// Selecionando o canvas e definindo o contexto 2D
const canvas = document.getElementById('pongCanvas'); // selecinamos o elemento canvas 
const ctx = canvas.getContext('2d'); // solicita um contexto bidimenssional para desenhar no canvas

// Carregando as imagens
const imagemDeFundo = new Image();
imagemDeFundo.src = '../imgs/Sprites/fundo1.png';  // Caminho para a imagem de fundo

const imagemRaqueteJogador = new Image();
imagemRaqueteJogador.src = '../imgs/Sprites/barra02.png';  // Caminho para a imagem da raquete do jogador

const imagemRaqueteComputador = new Image();
imagemRaqueteComputador.src = '../imgs/Sprites/barra01.png';  // Caminho para a imagem da raquete do computador

const bolaPong = new Image();
bolaPong.src = '../imgs/Sprites/bola.png';
bolaPong.onload = function() {
    loopDoJogo(); // Inicia o jogo apenas depois que a imagem for carregada
};

// Função para desenhar a imagem de fundo
function desenharImagemDeFundo() {
    ctx.drawImage(imagemDeFundo, 0, 0, canvas.width, canvas.height);
}

// Definindo a largura e altura do canvas
canvas.width = 1200;  // Largura interna
canvas.height = 600; // Altura interna 

// Configurações iniciais
const larguraRaquete = 30;
const alturaRaqueteJogador = 300; // Altura da raquete do jogador
const alturaRaqueteComputador = 300; // Altura da raquete do computador
const tamanhoBola = 25;

// Posição inicial das barras e da bola
let posicaoJogadorY = (canvas.height - alturaRaqueteJogador) / 2;
let posicaoComputadorY = (canvas.height - alturaRaqueteComputador) / 2;
// aqui nos configuramos a direção inicial da bola quando o game for iniciado a primeira vez
let posicaoBolaX = canvas.width / 0; 
let posicaoBolaY = canvas.height / 0;

// Velocidade inicial da bola e direções
let velocidadeInicialX = 4; // Velocidade inicial no eixo X
let velocidadeInicialY = 4; // Velocidade inicial no eixo Y
let velocidadeBolaX = velocidadeInicialX;
let velocidadeBolaY = velocidadeInicialY;
let incrementoVelocidade = 0.5;  // Incremento de velocidade a cada colisão

// Defina um limite máximo para a velocidade da bola
const velocidadeMaxima = 20; // Ajuste conforme necessário

// Função para desenhar as bordas superior e inferior
function desenharBordas() {
    ctx.strokeStyle = 'blue'; // Cor das bordas
    ctx.lineWidth = 5; // Largura da borda

    // Desenhar borda superior
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // Desenhar borda inferior
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
}

// Função para desenhar a raquete do jogador
function desenharRaqueteJogador() {
    ctx.drawImage(imagemRaqueteJogador, 30, posicaoJogadorY, larguraRaquete, alturaRaqueteJogador);
}

// Função para desenhar a raquete do computador
function desenharRaqueteComputador() {
    ctx.drawImage(imagemRaqueteComputador, canvas.width - 40, posicaoComputadorY, larguraRaquete, alturaRaqueteComputador);
}

// Função para desenhar a bola
function desenharBola() {
    ctx.drawImage(bolaPong, posicaoBolaX - (tamanhoBola / 2), posicaoBolaY - (tamanhoBola / 2), tamanhoBola, tamanhoBola);
    
    // Se quiser adicionar um contorno, crie um círculo sobre a bola
    ctx.beginPath();
    ctx.arc(posicaoBolaX, posicaoBolaY, tamanhoBola / 2, 0, Math.PI * 2); // Desenhe um círculo
    ctx.strokeStyle = 'orange'; // Define a cor do contorno
    ctx.lineWidth = 2; // Aumenta a largura do contorno
    ctx.stroke(); // Desenha o contorno
}


// Função para mover a bola
function moverBola() {
    posicaoBolaX += velocidadeBolaX;
    posicaoBolaY += velocidadeBolaY;

    // Colisão com as paredes superior e inferior
    if (posicaoBolaY + tamanhoBola / 2 > canvas.height || posicaoBolaY - tamanhoBola / 2 < 0) {
        velocidadeBolaY = -velocidadeBolaY; // Inverte a direção vertical
    }

    // Verifica colisão com a barra do jogador
    if (
                posicaoBolaX - tamanhoBola / 2 < 40 &&
                posicaoBolaY > posicaoJogadorY &&
                posicaoBolaY < posicaoJogadorY + alturaRaqueteJogador
            ) {
                const parteRaquete = (posicaoBolaY - posicaoJogadorY) / alturaRaqueteJogador;
        
                // Define um ângulo de impacto com base na parte da raquete atingida
                let anguloImpacto;
                if (parteRaquete < 0.10) {
                    anguloImpacto = -1; // Maior ângulo para cima
                } else if (parteRaquete < 0.25) {
                    anguloImpacto = -0.6; // Ângulo médio para cima
                   
                } else if(parteRaquete <0.35){
                    anguloImpacto = 0; // Ângulo médio para cima
        
                } else if (parteRaquete < 0.70) {
                    anguloImpacto = 0; // Ângulo médio para baixo
                }
                else if (parteRaquete < 0.75) {
                    anguloImpacto = 0.7; // Ângulo médio para baixo
                } else {
                    anguloImpacto = 1; // Maior ângulo para baixo
                }
        
                velocidadeBolaX = -velocidadeBolaX; // Inverte a direção horizontal
                velocidadeBolaY = anguloImpacto * velocidadeInicialY; // Define a nova velocidade Y com base no ângulo de impacto
        
                // Aumenta a velocidade da bola a cada colisão com a raquete do jogador
                velocidadeBolaX *= (1 + incrementoVelocidade);
                velocidadeBolaY *= (1 + incrementoVelocidade);
        
                // Limita a velocidade da bola
                if (Math.abs(velocidadeBolaX) > velocidadeMaxima) {
                    velocidadeBolaX = Math.sign(velocidadeBolaX) * velocidadeMaxima; // Mantém a direção e aplica o limite
                }
                if (Math.abs(velocidadeBolaY) > velocidadeMaxima) {
                    velocidadeBolaY = Math.sign(velocidadeBolaY) * velocidadeMaxima; // Mantém a direção e aplica o limite
                }
            }

    // Verifica colisão com a barra do computador
    if (
        posicaoBolaX + tamanhoBola / 2 > canvas.width - 40 &&
        posicaoBolaY > posicaoComputadorY &&
        posicaoBolaY < posicaoComputadorY + alturaRaqueteComputador
    ) {
        velocidadeBolaX = -velocidadeBolaX; // Inverte a direção horizontal
    }

    // Se o jogador ou o computador fizerem ponto
    if (posicaoBolaX + tamanhoBola / 2 > canvas.width) {
        reiniciarBola(); // Jogador faz ponto
    } else if (posicaoBolaX - tamanhoBola / 2 < 0) {
        reiniciarBola(); // Computador faz ponto
    }
}

// Função para reiniciar a bola no centro da tela e resetar a velocidade
function reiniciarBola() {
    posicaoBolaX = canvas.width / 2;
    posicaoBolaY = canvas.height / 2;
    velocidadeBolaX = velocidadeInicialX;  // Reseta a velocidade X ao valor original
    velocidadeBolaY = 0;  // Reseta a velocidade Y ao valor original
}

// Função para mover a raquete do computador automaticamente
function moverRaqueteComputador() {
    if (posicaoComputadorY + alturaRaqueteComputador / 2 < posicaoBolaY) {
        posicaoComputadorY += 4; // Movimento para baixo
    } else {
        posicaoComputadorY -= 4; // Movimento para cima
    }

    // Verifica se a raquete do computador não ultrapassa os limites do canvas
    if (posicaoComputadorY < 0) {
        posicaoComputadorY = 0; // Limite superior
    } else if (posicaoComputadorY + alturaRaqueteComputador > canvas.height) {
        posicaoComputadorY = canvas.height - alturaRaqueteComputador; // Limite inferior
    }
}

// Função de renderização do jogo
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa o canvas
    desenharImagemDeFundo();  // Desenha o fundo
    desenharBordas();  // Desenha as bordas
    desenharRaqueteJogador();
    desenharRaqueteComputador();
    desenharBola();
    moverBola();
    moverRaqueteComputador();
}

// Movimento do jogador com o mouse
canvas.addEventListener('mousemove', function (event) {
    const relativeY = event.clientY - canvas.getBoundingClientRect().top;
    if (relativeY > 0 && relativeY < canvas.height - alturaRaqueteJogador) {
        posicaoJogadorY = relativeY;
    }
});

// Função que atualiza o jogo constantemente
function loopDoJogo() {
    desenhar();
    requestAnimationFrame(loopDoJogo); // Faz o loop de animação
}

// Inicia o jogo
loopDoJogo();








// // Selecionando o canvas e definindo o contexto 2D
// const canvas = document.getElementById('pongCanvas');
// const ctx = canvas.getContext('2d');

// const imagemDeFundo = new Image();
// imagemDeFundo.src = '../imgs/Sprites/fundo1.png';  // Caminho para a imagem de fundo

// // Função para desenhar a imagem de fundo
// function desenharImagemDeFundo() {
//     ctx.drawImage(imagemDeFundo, 0, 0, canvas.width, canvas.height);
// }

// // Definindo a largura e altura do canvas
// canvas.width = 1200;  // Largura interna
// canvas.height = 600; // Altura interna 

// // Configurações iniciais
// const larguraRaquete = 10;
// const alturaRaqueteJogador = 300; // Altura da raquete do jogador
// const alturaRaqueteComputador = 300; // altura da raquete do computador

// const tamanhoBola = 15;

// // Posição inicial das barras e da bola
// let posicaoJogadorY = (canvas.height - alturaRaqueteJogador) / 2;
// let posicaoComputadorY = (canvas.height - alturaRaqueteComputador) / 2;
// let posicaoBolaX = canvas.width / 2;
// let posicaoBolaY = canvas.height / 2;

// // Velocidade inicial da bola e direções
// let velocidadeInicialX = 4; // Velocidade inicial no eixo X
// let velocidadeInicialY = 4; // Velocidade inicial no eixo Y
// let velocidadeBolaX = velocidadeInicialX;
// let velocidadeBolaY = velocidadeInicialY;
// let incrementoVelocidade = 0.5;  // Incremento de velocidade a cada colisão

// // Defina um limite máximo para a velocidade da bola
// const velocidadeMaxima = 20; // Ajuste conforme necessário

// // Função para desenhar as bordas superior e inferior
// function desenharBordas() {
//     ctx.strokeStyle = 'orange'; // Cor das bordas
//     ctx.lineWidth = 5; // Largura da borda

//     // Desenhar borda superior
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.lineTo(canvas.width, 0);
//     ctx.stroke();

//     // Desenhar borda inferior
//     ctx.beginPath();
//     ctx.moveTo(0, canvas.height);
//     ctx.lineTo(canvas.width, canvas.height);
//     ctx.stroke();
// }

// // Função para desenhar a barra do jogador
// function desenharRaqueteJogador() {
//     ctx.fillStyle = 'yellow';
//     ctx.fillRect(30, posicaoJogadorY, larguraRaquete, alturaRaqueteJogador);
// }

// // Função para desenhar a barra do computador
// function desenharRaqueteComputador() {
//     ctx.fillStyle = '#fff';
//     ctx.fillRect(canvas.width - 40, posicaoComputadorY, larguraRaquete, alturaRaqueteComputador);
// }

// // Função para desenhar a bola
// function desenharBola() {
//     ctx.beginPath();
//     ctx.arc(posicaoBolaX, posicaoBolaY, tamanhoBola / 2, 0, Math.PI * 4);
//     ctx.fillStyle = 'white';
//     ctx.fill(); // define o preenchimento da bola
//     // Desenhar o contorno
//     ctx.strokeStyle = 'orange'; // Define a cor do contorno
//     ctx.stroke(); // Desenha o contorno da bola
//     ctx.lineWidth = 2; // Aumenta a largura do contorno
// }

// // Função para mover a bola
// function moverBola() {
//     posicaoBolaX += velocidadeBolaX;
//     posicaoBolaY += velocidadeBolaY;

//     // Colisão com as paredes superior e inferior
//     if (posicaoBolaY + tamanhoBola / 2 > canvas.height || posicaoBolaY - tamanhoBola / 2 < 0) {
//         velocidadeBolaY = -velocidadeBolaY; // Inverte a direção vertical
//     }

//     // Verifica colisão com a barra do jogador
//     if (
//         posicaoBolaX - tamanhoBola / 2 < 40 &&
//         posicaoBolaY > posicaoJogadorY &&
//         posicaoBolaY < posicaoJogadorY + alturaRaqueteJogador
//     ) {
//         const parteRaquete = (posicaoBolaY - posicaoJogadorY) / alturaRaqueteJogador;

//         // Define um ângulo de impacto com base na parte da raquete atingida
//         let anguloImpacto;
//         if (parteRaquete < 0.10) {
//             anguloImpacto = -1; // Maior ângulo para cima
//         } else if (parteRaquete < 0.25) {
//             anguloImpacto = -0.6; // Ângulo médio para cima
           
//         } else if(parteRaquete <0.35){
//             anguloImpacto = 0; // Ângulo médio para cima

//         } else if (parteRaquete < 0.70) {
//             anguloImpacto = 0; // Ângulo médio para baixo
//         }
//         else if (parteRaquete < 0.75) {
//             anguloImpacto = 0.7; // Ângulo médio para baixo
//         } else {
//             anguloImpacto = 1; // Maior ângulo para baixo
//         }

//         velocidadeBolaX = -velocidadeBolaX; // Inverte a direção horizontal
//         velocidadeBolaY = anguloImpacto * velocidadeInicialY; // Define a nova velocidade Y com base no ângulo de impacto

//         // Aumenta a velocidade da bola a cada colisão com a raquete do jogador
//         velocidadeBolaX *= (1 + incrementoVelocidade);
//         velocidadeBolaY *= (1 + incrementoVelocidade);

//         // Limita a velocidade da bola
//         if (Math.abs(velocidadeBolaX) > velocidadeMaxima) {
//             velocidadeBolaX = Math.sign(velocidadeBolaX) * velocidadeMaxima; // Mantém a direção e aplica o limite
//         }
//         if (Math.abs(velocidadeBolaY) > velocidadeMaxima) {
//             velocidadeBolaY = Math.sign(velocidadeBolaY) * velocidadeMaxima; // Mantém a direção e aplica o limite
//         }
//     }

//     // Verifica colisão com a barra do computador
//     if (
//         posicaoBolaX + tamanhoBola / 2 > canvas.width - 40 &&
//         posicaoBolaY > posicaoComputadorY &&
//         posicaoBolaY < posicaoComputadorY + alturaRaqueteComputador
//     ) {
//         velocidadeBolaX = -velocidadeBolaX; // Inverte a direção horizontal
//     }

//     // Se o jogador ou o computador fizerem ponto
//     if (posicaoBolaX + tamanhoBola / 2 > canvas.width) {
//         reiniciarBola(); // Jogador faz ponto
//     } else if (posicaoBolaX - tamanhoBola / 2 < 0) {
//         reiniciarBola(); // Computador faz ponto
//     }
// }

// // Função para reiniciar a bola no centro da tela e resetar a velocidade
// function reiniciarBola() {
//     posicaoBolaX = canvas.width / 2;
//     posicaoBolaY = canvas.height / 2;
//     velocidadeBolaX = velocidadeInicialX;  // Reseta a velocidade X ao valor original
//     velocidadeBolaY = 0;  // Reseta a velocidade Y ao valor original
// }

// // Função para mover a barra do computador automaticamente
// function moverRaqueteComputador() {
//     if (posicaoComputadorY + alturaRaqueteComputador / 2 < posicaoBolaY) {
//         posicaoComputadorY += 4; // Movimento para baixo
//     } else {
//         posicaoComputadorY -= 4; // Movimento para cima
//     }

//     // Verifica se a raquete do computador não ultrapassa os limites do canvas
//     if (posicaoComputadorY < 0) {
//         posicaoComputadorY = 0; // Limite superior
//     } else if (posicaoComputadorY + alturaRaqueteComputador > canvas.height) {
//         posicaoComputadorY = canvas.height - alturaRaqueteComputador; // Limite inferior
//     }
// }

// // Função de renderização do jogo
// function desenhar() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa o canvas
//     desenharImagemDeFundo();  // Desenha o fundo
//     desenharBordas();  // Desenha as bordas
//     desenharRaqueteJogador();
//     desenharRaqueteComputador();
//     desenharBola();
//     moverBola();
//     moverRaqueteComputador();
// }

// // Movimento do jogador com o mouse
// canvas.addEventListener('mousemove', function (event) {
//     const relativeY = event.clientY - canvas.getBoundingClientRect().top;
//     if (relativeY > 0 && relativeY < canvas.height - alturaRaqueteJogador) {
//         posicaoJogadorY = relativeY;
//     }
// });

// // Função que atualiza o jogo constantemente
// function loopDoJogo() {
//     desenhar();
//     requestAnimationFrame(loopDoJogo); // Faz o loop de animação
// }

// // Inicia o jogo
// loopDoJogo();


