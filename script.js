// Obtendo os elementos do jogo
const personagem = document.getElementById('personagem');
const cidade = document.getElementById('cidade');
const relogio = document.getElementById('relogio');

// Atualiza o relógio na tela
function atualizarRelogio() {
    const agora = new Date();
    relogio.textContent = agora.toLocaleTimeString('pt-BR', { hour12: false });
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Posições iniciais do personagem
let posX = cidade.clientWidth / 2 - 50;
let posY = cidade.clientHeight / 2 - 50;
let direcao = 'direita';

// Flags de movimento
const movimento = { cima: false, baixo: false, esquerda: false, direita: false };

// Função para mover o personagem
function moverPersonagem() {
    const passo = 5;
    if (movimento.cima) posY -= passo;
    if (movimento.baixo) posY += passo;
    if (movimento.esquerda) posX -= passo;
    if (movimento.direita) posX += passo;

    // Garantir que o personagem não saia da cidade
    posX = Math.max(0, Math.min(cidade.clientWidth - 100, posX));
    posY = Math.max(0, Math.min(cidade.clientHeight - 100, posY));

    personagem.style.left = posX + 'px';
    personagem.style.top = posY + 'px';
}

// Função para atirar
function atirar() {
    const tiro = document.createElement('div');
    tiro.classList.add('quadradinho');
    tiro.style.position = 'absolute';
    tiro.style.left = (posX + 45) + 'px';
    tiro.style.top = (posY + 45) + 'px';
    cidade.appendChild(tiro);

    let tiroX = posX + 45;
    let tiroY = posY + 45;
    const velocidade = 10;
    const direcaoTiro = direcao;

    function moverTiro() {
        switch (direcaoTiro) {
            case 'cima': tiroY -= velocidade; break;
            case 'baixo': tiroY += velocidade; break;
            case 'esquerda': tiroX -= velocidade; break;
            case 'direita': tiroX += velocidade; break;
        }

        tiro.style.left = tiroX + 'px';
        tiro.style.top = tiroY + 'px';

        if (
            tiroX < 0 || tiroX > cidade.clientWidth ||
            tiroY < 0 || tiroY > cidade.clientHeight
        ) {
            tiro.remove();
        } else {
            requestAnimationFrame(moverTiro);
        }
    }
    requestAnimationFrame(moverTiro);
}

// Detecta colisão entre tiro e carro
function detectarColisao(tiro, carro) {
    let tiroRect = tiro.getBoundingClientRect();
    let carroRect = carro.getBoundingClientRect();
    return (
        tiroRect.left < carroRect.right &&
        tiroRect.right > carroRect.left &&
        tiroRect.top < carroRect.bottom &&
        tiroRect.bottom > carroRect.top
    );
}

// Função para verificar colisões
function verificarColisoes() {
    document.querySelectorAll('.quadradinho').forEach(tiro => {
        document.querySelectorAll('.carro, .carro2, .carro3').forEach(carro => {
            if (detectarColisao(tiro, carro)) {
                carro.classList.add('explosao');
                setTimeout(() => {
                    carro.remove(); // Remove o carro da tela após explosão
                }, 500);
                tiro.remove();
            }
        });
    });
}

// Eventos de teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') movimento.cima = true, direcao = 'cima';
    if (event.key === 's') movimento.baixo = true, direcao = 'baixo';
    if (event.key === 'a') movimento.esquerda = true, direcao = 'esquerda';
    if (event.key === 'd') movimento.direita = true, direcao = 'direita';
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') movimento.cima = false;
    if (event.key === 's') movimento.baixo = false;
    if (event.key === 'a') movimento.esquerda = false;
    if (event.key === 'd') movimento.direita = false;
});

// Atirar com clique do mouse
document.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Botão esquerdo do mouse
        atirar();
    }
});

// Loop principal do jogo
function gameLoop() {
    moverPersonagem();
    verificarColisoes();
    requestAnimationFrame(gameLoop);
}

gameLoop();
