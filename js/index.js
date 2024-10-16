
// Selecionando o canvas e definindo o contexto 2D
const canvas = document.getElementById('pongCanvas'); // selecinamos o elemento canvas 
const ctx = canvas.getContext('2d'); // solicita um contexto bidimenssional para desenhar no canvas
const btn_player = document.querySelector('#btn-play');
const btn_pause = document.querySelector('#btn-pausar');

const soundRaquetePlayer = new Audio('../sons/explosion2.mp3');
const soundRaqueteComputer = new Audio('../sons/explosion3.mp3');
const gol = new Audio('../sons/goals.mp3');
// Carregando as imagens
const imagemDeFundo = new Image();
imagemDeFundo.src = '../imgs/Sprites/fundo1.png';  // Caminho para a imagem de fundo

const imagemRaqueteJogador = new Image();
imagemRaqueteJogador.src = '../imgs/Sprites/barra02.png';  // Caminho para a imagem da raquete do jogador

const imagemRaqueteComputador = new Image();
imagemRaqueteComputador.src = '../imgs/Sprites/barra01.png';  // Caminho para a imagem da raquete do computador

const bolaPong = new Image();
bolaPong.src = '../imgs/Sprites/bola.png';
bolaPong.onload = function () {
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
const larguraRaquete = 40;
const alturaRaqueteJogador = 300; // Altura da raquete do jogador
const alturaRaqueteComputador = 300; // Altura da raquete do computador
const tamanhoBola = 30;
let anguloRotacao = 0;  // Ângulo de rotação da bola
let velocidadeRotacao = 0.1;  // Velocidade de rotação 
let jogoPausado = true;
//variaveis do placar
let pontosJogador = 0; // Pontos do Jogador
let pontosComputador = 0; // Pontos do Computador


// Posição inicial das barras e da bola
let posicaoJogadorY = (canvas.height - alturaRaqueteJogador) / 2;
let posicaoComputadorY = (canvas.height - alturaRaqueteComputador) / 2;
// aqui nos configuramos a direção inicial da bola quando o game for iniciado a primeira vez
let posicaoBolaX = canvas.width / 2;
let posicaoBolaY = canvas.height / 2;

// Velocidade inicial da bola e direções
let velocidadeInicialX = 4; // Velocidade inicial no eixo X
let velocidadeInicialY = 4; // Velocidade inicial no eixo Y
let velocidadeBolaX = velocidadeInicialX;
let velocidadeBolaY = velocidadeInicialY;
let incrementoVelocidade = 0.5;  // Incremento de velocidade a cada colisão

// Defina um limite máximo para a velocidade da bola
const velocidadeMaxima = 7; // Ajuste conforme necessário

// Função para desenhar as bordas superior e inferior
function desenharBordas() {
    ctx.strokeStyle = 'yellow'; // Cor das bordas
    ctx.lineWidth = 5; // Largura da borda

    // Desenhar borda superior
    ctx.beginPath();
    ctx.moveTo(0, 0);// define o ponto 0 do eixo X (horizontal) e 0 do eixo Y(vertical) e posiciona o inicio de onde parte a linha do desenho
    // obs.: imagina que vc  tem um lapis, o (0,0) é onde vc colocou seu laps pra comessar a desenhar
    ctx.lineTo(canvas.width, 0); // aqui partindo da posição de onde vc colocou seu laps pra comessar a desenhar, vc estica uma linha reta, no sentido horizontal
    // do tamanho da largura do canvas, por isso usamos a propriedade canvas.width,note:
    // que a orderm é importante, (canvas.width,0) primeiro vem o tamanho da linha que sera desenhada, 
    // e depois a distancia que  esla esta da borda do canvas, no nosso caso 0 ficou a borda que criamos 
    // ficou colada com a borda do canvas    
    ctx.stroke(); // depois de definis locais e valores das propriedades o stroker faz o desenho

    // desenha a borda lateral esquerda
    ctx.beginPath();
    ctx.moveTo(0, 0);// aqui se repete como no codigo da borde desenhada acima 
    ctx.lineTo(0, canvas.height);//obs: pra desenhar a borda lateral é diferente da borda superior:
    // primeiro definimos a distancis entre a borda do canvas e a linha que vamos desenhar
    // depois definimos o tamanho da linha no eixo y nesse caso a altura do canvas
    ctx.stroke();

    // Desenhar borda inferior
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();


    // desenha a borda lateral direita
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);/** aqui nos definimos o ponto de partida do desenho, o canvas.whidth
                                                posiciona o ponto de partida no final do comprimento do exio X
                                                se do lado exquerdo a posição inicial == 0, a posição final é == a canvas.whidth                                                
                                                e o canvas.height define a posição inicial no eixo y , assim como pra desenhar 
                                                a borda superios , usamos as cordenadas 0x,0y, agora usamos canvas.width x e canvas.height y
                                                assim definimos o ponto de partida do desenho, no lado direito do canvas, con o sentido do desenho
                                                 partindo da part inferios do retangulo do canvas para cima
    */
    ctx.lineTo(canvas.width, 0);/** aqui é onde iremos iniciar o nosso traçado da nossa borda, determinamos então que partira do 
                                ponto x = canvas.width e se extendera até a posição 0,do eixo y que é == canvas.height
                                */
    ctx.stroke();
}

// Função para desenhar a raquete do jogador
function desenharRaqueteJogador() {
    ctx.drawImage(imagemRaqueteJogador, 30, posicaoJogadorY, larguraRaquete, alturaRaqueteJogador);
}

// Função para desenhar a raquete do computador
function desenharRaqueteComputador() {
    ctx.drawImage(imagemRaqueteComputador, canvas.width - 80, posicaoComputadorY, larguraRaquete, alturaRaqueteComputador);
}

// Função para desenhar a bola
function desenharBola() {

    //     ctx.drawImage(bolaPong, posicaoBolaX - (tamanhoBola / 2), posicaoBolaY - (tamanhoBola / 2), tamanhoBola, tamanhoBola);

    //     // Se quiser adicionar um contorno, crie um círculo sobre a bola
    //     ctx.beginPath();
    //     ctx.arc(posicaoBolaX, posicaoBolaY, tamanhoBola / 2, 0, Math.PI * 8); // Desenhe um círculo
    //     ctx.strokeStyle = 'orange'; // Define a cor do contorno
    //     ctx.lineWidth = 2; // Aumenta a largura do contorno
    //     ctx.stroke(); // Desenha o contorno

    ctx.save();  // Salva o estado atual do contexto

    // Translada o contexto para o centro da bola
    ctx.translate(posicaoBolaX, posicaoBolaY);

    // Aplica a rotação da bola
    ctx.rotate(anguloRotacao);

    // Desenha a bola rotacionada no centro do contexto
    ctx.drawImage(bolaPong, -(tamanhoBola / 2), -(tamanhoBola / 2), tamanhoBola, tamanhoBola);

    ctx.restore();  // Restaura o estado original do contexto

}


// Função para mover a bola
function moverBola() {
    if (jogoPausado) return;
    posicaoBolaX += velocidadeBolaX;
    posicaoBolaY += velocidadeBolaY;

    // Atualiza a rotação da bola
    anguloRotacao += velocidadeRotacao;

    // Colisão com as paredes superior e inferior
    if (posicaoBolaY + tamanhoBola / 2 > canvas.height || posicaoBolaY - tamanhoBola / 2 < 0) {
        velocidadeBolaY = -velocidadeBolaY; // Inverte a direção vertical
        velocidadeRotacao *= -1;  // Inverte a rotação quando a bola toca nas paredes

    }

    //  Define a Direção da bola ao tocar na raquete, e Verifica colisão com a barra do jogador 
    if (
        posicaoBolaX - tamanhoBola / 2 < larguraRaquete &&
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

        } else if (parteRaquete < 0.35) {
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

        soundRaquetePlayer.currentTime = 0;
        soundRaquetePlayer.play();
    }

    // Verifica colisão com a barra do computador
    if (
        posicaoBolaX + tamanhoBola / 2 > canvas.width - 40 &&
        posicaoBolaY > posicaoComputadorY &&
        posicaoBolaY < posicaoComputadorY + alturaRaqueteComputador) {
        velocidadeBolaX = -velocidadeBolaX; // Inverte a direção horizontal
        soundRaqueteComputer.currentTime = 0;
        soundRaqueteComputer.play();

    }

    // Se o jogador ou o computador fizerem ponto
    if (posicaoBolaX + tamanhoBola / 2 > canvas.width) {
        gol.currentTime = 0;
        gol.play();

        reiniciarBola(); // Jogador faz ponto
        // Aqui você pode adicionar lógica para aumentar a pontuação do jogador
        pausarMomentaneo(); // Pausa o jogo por 3 segundos
        jogadorFazPonto();


    } else if (posicaoBolaX - tamanhoBola / 2 < 0) {
        gol.currentTime = 0;
        gol.play();
        reiniciarBola(); // Computador faz ponto

        // Aqui você pode adicionar lógica para aumentar a pontuação do jogador
        pausarMomentaneo(); // Pausa o jogo por 3 segundos
        computadorFazPonto();


    }
    // Função para atualizar o placar
    function atualizarPlacar() {
        document.getElementById('pontos-jogador').textContent = pontosJogador;
        document.getElementById('pontos-computador').textContent = pontosComputador;
    }

    // Função para narrar o placar
function narrarPlacar() {
    let mensagem = `O placar é: Player tem ${pontosJogador} pontos e Computador tem  ${pontosComputador} pontos.`;
    
    // Utiliza a API Speech Synthesis para narrar o placar
    let utterance = new SpeechSynthesisUtterance(mensagem);
    window.speechSynthesis.speak(utterance);
}

// Função chamada quando o Jogador faz um ponto
function jogadorFazPonto() {
    pontosJogador++; // Incrementa os pontos do jogador
    atualizarPlacar(); // Atualiza visualmente o placar
    narrarPlacar(); // Narra o placar atualizado
}

// Função chamada quando o Computador faz um ponto
function computadorFazPonto() {
    pontosComputador++; // Incrementa os pontos do computador
    atualizarPlacar(); // Atualiza visualmente o placar
    narrarPlacar(); // Narra o placar atualizado
}




}





// Função para reiniciar a bola no centro da tela e resetar a velocidade
function reiniciarBola() {

    posicaoBolaX = canvas.width / 2;
    posicaoBolaY = canvas.height / 2;
    velocidadeBolaX = velocidadeInicialX;  // Reseta a velocidade X ao valor original
    velocidadeBolaY = 0;  // Reseta a velocidade Y ao valor original
}

function pausarMomentaneo() {
    jogoPausado = true; // Pausa o jogo
    setTimeout(() => {
        jogoPausado = false; // Retorna ao estado normal após 3 segundos
    }, 3000); // 3000 milissegundos (3 segundos)
}

function pausarGame() {
    if (!jogoPausado) {
        console.log(jogoPausado);
        jogoPausado = true; // Pausa o jogo

    }
   
}

function playerGame() {
    if (jogoPausado) {
        console.log(jogoPausado);
        jogoPausado = false; // Pausa o jogo

    }
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

btn_pause.addEventListener('click', () => { // add efeito de click no botão pausar 
    btn_pause.classList.add('active');
    setTimeout(() => {
        btn_pause.classList.remove('active');
    }, 150)
});

btn_player.addEventListener('click', () => { // add efeito de click no botão player
    btn_player.classList.add('active');
    setTimeout(() => {
        btn_player.classList.remove('active');
    }, 150)

});

// Função que atualiza o jogo constantemente
function loopDoJogo() {
    desenhar();
    requestAnimationFrame(loopDoJogo); // Faz o loop de animação
}



// Inicia o jogo
loopDoJogo();







