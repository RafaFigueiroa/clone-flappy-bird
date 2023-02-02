const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");

//we will need the gamecontainer to make it blurry
//when we display the end menu
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png'

//game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//pipe bariables
let pipeX = 400;
let pipeY = canvas.height - 200;

//score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highscore = 0;

let scored = false;

//faz o passaro pular
document.body.onkeyup = function(e){
    if(e.code == 'Space'){
        birdVelocity = FLAP_SPEED;
    }
}

document.getElementById('restart-button').addEventListener('click', function(){
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore(){
    // aumenta o contador a cada cano que o player ultrapassar
    if(birdX > pipeX + PIPE_WIDTH && (birdY < pipeY + PIPE_GAP || birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && !scored){
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if(birdX < pipeX + PIPE_WIDTH){
        scored = false;
    }
}

function collisionCheck(){
    //cria caixas invisiveis para o player e para os canos

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // checa se houve uma colisão com o cano de cima
    if(birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y){
        return true;
    }

    // checa se houve colisão com o cano de baixo
    if(birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width && birdBox.y + birdBox.height > bottomPipeBox.y){
        return true;
    }

    // checa se o passaro encostou em um dos cantos do canvas
    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }
    return false;
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    document.getElementById('best-score').innerHTML = highscore;

    // atualiza o recorde do jogador
    if(score > highscore){
        highscore = score;
    }

    document.getElementById('best-score').innerHTML = highscore;
}

// reseta os valore para o padrão inicial
function resetGame(){ 
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame(){
    showEndMenu();
}

function loop(){
    //reset the ctx after every loop iterartion
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

    //dray flappy bird
    ctx.drawImage(flappyImg, birdX, birdY);

    //draw pipe
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //confere se o player encostou no cano
    // o collisionCheck vai retornar true se houver colisão
    if(collisionCheck()){
        endGame();
        return;
    }

    //move os obstaculos
    pipeX -= 1.5;

    // se o cano sair da tela ele gera outro randomicamente
    if(pipeX < -50){
        pipeX= 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    //aplica gravidade no flappy
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop)
}

loop();


