//declaração das variáveis
var trex, trex_running, edges, trex_scare, jumpmp3;
var terra, terrapng;
var terraInvisivel;
var nuvem, nuvempng;
var cacto, cactopng1, cactopng2, cactopng3, cactopng4, cactopng5, cactopng6;
var ponto, pontomp3;
var nublado;
var espinhos;
var play = 1, end = 0;
var gameState = play;
var gameOver, restarte, gameOverpng, restartepng, gameOvermp3;
//função de pré-carregamento de imagens e sons
function preload()
{
  jumpmp3 = loadSound("jump.mp3");
  pontomp3 = loadSound("checkPoint.mp3");
  gameOvermp3 = loadSound("die.mp3");
  gameOverpng = loadImage("gameOver.png");
  restartepng = loadImage("restart.png");
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  terrapng = loadImage("ground2.png");
  nuvempng = loadImage("cloud.png");
  cactopng1 = loadImage("obstacle1.png");
  cactopng2 = loadImage("obstacle2.png");
  cactopng3 = loadImage("obstacle3.png");
  cactopng4 = loadImage("obstacle4.png");
  cactopng5 = loadImage("obstacle5.png");
  cactopng6 = loadImage("obstacle6.png");
  trex_scare = loadAnimation("trex_collided.png");
}

//função de configuração
function setup()
{
  ponto = 0
  //criar tela
  createCanvas(windowWidth,windowHeight);
  //ciar sprite do solo
  terra = createSprite(width/2,height/2,width,40);
  terra.scale = 1.25
  terra.addImage("^", terrapng);
  //criar o sprite do trex
  trex = createSprite(50,height/2-20,20,50);
  trex.addAnimation("correndo", trex_running);
  trex.addAnimation("espetado", trex_scare);
  trex.scale = 0.8;
  //setand raio colisor
  trex.setCollider ("rectangle", -10, 0, 72, 90); //72
  trex.debug = false;
  //criar o sprite do chao invisivel
  terraInvisivel = createSprite(width/2,height/2+10,width,5);
  terraInvisivel.visible = false;
  //criar grupos de sprite
  nublado = new Group ();
  espinhos = new Group ();
  //criar game over e reatrt
  gameOver = createSprite (width/2, height/2.5);
  restarte = createSprite (width/2, height/2);
  gameOver.addImage ("fim", gameOverpng);
  restarte.addImage ("deNovo", restartepng);
  //criar as bordas
  edges = createEdgeSprites();
}

//desenho e animação
function draw()
{ 
  background(245);

  
  if (gameState === play) 
  {
    gameOver.visible = false;
    restarte.visible = false;

    ponto = ponto+ Math.round(getFrameRate()/60);
    
    if (ponto%100 === 0 && ponto > 0 )
    {
     //    pontomp3.play();
     // console.log (ponto);
    }


    //fazer numeros aleatoros
    //var rand = Math.round (random (1,60));
    //console.log (rand);

    //fazer o trex pular
    if((keyDown("space") || touches.length>0) && trex.y >= height/2-28.5    )
    {
      trex.velocityY = -10;
      jumpmp3.play();
      touches = [];
    }
 
    //dar gravidade para o trex
    trex.velocityY = trex.velocityY + 0.5 ; //0.5
    
    //posição do trex no eixo y
    console.log(trex.y);
 
    //posição da terra
   //console.log(terra.x);
   //movimento da terra
   terra.velocityX = -8 - ponto/100;
 
   //se terra sair da tela ira reiniciar
   if (terra.x < 0) 
   {
     terra.x = terra.width/2;
   }

   //chamada da função cloud
   cloud();
  
   //chamada da função cactus
   cactus();
   
   //mudar estado de jogo para fim
   if (espinhos.isTouching(trex)) 
   {
     trex.velocityY = -10;
     //jumpmp3.play();
     gameOvermp3.play ();
     gameState = end;
   }
   
   
  } 
  else if (gameState === end)
  {
    gameOver.visible = true;
    restarte.visible = true;
    nublado.setLifetimeEach (-1);
    espinhos.setLifetimeEach (-1);
    trex.changeAnimation ("espetado", trex_scare);
    terra.velocityX = 0;
    trex.velocityY = 0;
    nublado.setVelocityXEach (0);
    espinhos.setVelocityXEach (0);
    if (mousePressedOver(restarte) || touches.length > 0)
    {
      reset();
      touches = [];
    }
  }
  //colidir com as bordas
  trex.collide(terraInvisivel);
 
  //desenha o sprite do Trex
  drawSprites();
  //contagem de pontos
  fill ("black");
  textSize (20);
  text ("pontos "+ ponto,width-160,20);
}

function cloud()
{
  if (frameCount%60===0) 
  {
    nuvem = createSprite (width, 20, 10, 10);
    nuvem.velocityX = -10;
    nuvem.addImage (nuvempng);
    nuvem.y = Math.round (random (20,70));
    trex.depth = nuvem.depth+1;
    //gameOver = nuvem.depth+1;
    console.log (nuvem.depth);
    console.log (trex.depth);
    console.log (gameOver.depth);
    nuvem.lifetime = 160;
    nublado.add (nuvem);
  }
}

function cactus()
{
  if (frameCount%60===0) 
  {
    var randonCacto = Math.round (random(1,6));
   cacto = createSprite (width,height/2-15, 10, 10);
   cacto.velocityX = -8 - ponto/100;
   cacto.scale = 0.5
   switch (randonCacto)
   {
     case 1: cacto.addImage (cactopng1);
     break;
     case 2: cacto.addImage (cactopng2);
     break;
     case 3: cacto.addImage (cactopng3);
     break;
     case 4: cacto.addImage (cactopng4);
     break;
     case 5: cacto.addImage (cactopng5);
     break;
     case 6: cacto.addImage (cactopng6);
     break;
     default: break;
   }
   cacto.lifetime = 190;
   espinhos.add (cacto);
  }
}

function reset()
{
  gameState = play;
  espinhos.destroyEach();
  nublado.destroyEach();
  trex.changeAnimation ("correndo", trex_running);
  ponto = 0;
}