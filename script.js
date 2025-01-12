const gameField = document.getElementById('field');
const numsRow = 24;
const numsCol = 26;
document.documentElement.style.setProperty('--num-cols',numsCol);
document.documentElement.style.setProperty('--num-rows',numsRow);

for(let i = 0; i < numsCol * numsRow; ++i) {
  const square = document.createElement('div');
  square.classList.add('square');
  gameField.appendChild(square);
}
const squares = document.querySelectorAll('.square');
const buttons = document.querySelectorAll('button');

let snake = [1,1];
let direction = 1;
let changeDirection = true;
let difficulty = 100;
let score = 0;
let highScore = Number(localStorage.getItem('high-score') || 0);
document.querySelector('.high-score').innerHTML = `High Score : <br>${highScore}`;

document.querySelector('.survival').addEventListener('click', () => {
  score = 0;
  document.querySelector('.score').innerHTML = `Score :<br> ${score}`;;
  chooseDifficulty(1);
  start();
})

document.querySelector('.reset').addEventListener('click',() => {
  localStorage.removeItem('high-score');
})

let directionLock = false;
function start() {
  disableBtn();
  returnOriginPosition();
  displayFruit();
  interval = setInterval(moveSnake,(100 / difficulty) * 100);
  document.addEventListener('keydown', (event) => {
    if(directionLock) return;
    switch (event.key) {
      case 'w':
        if(direction!==numsCol) {
          direction = -numsCol;
          directionLock = true;
          // moveSnake();
        }
        break;
      case 's':
        if(direction!==-numsCol) {
          direction = numsCol;
          directionLock = true;
          // moveSnake();
        }
        break;
      case 'a':
        if(direction!==1) {
          direction = -1;
          directionLock = true;
          // moveSnake();
        }
        break;
      case 'd':
        if(direction!==-1) {
          direction = 1;
          directionLock = true;
          // moveSnake();
        }
        break;
    
      default:
        break;
    }
  });
}

// start();

function moveSnake() {
  let newHead = snake[0] + direction;
  if(!check(newHead)) {
    directionLock = false;
    clearInterval(interval);
    enableBtn();
    console.log(snake);
    document.querySelector('.survival').innerHTML = 'Play Again';
    gameOver();
    // alert('Game Over');
    return;
  }

  checkFruit(newHead);

  const tail = snake.pop();
  snake.unshift(newHead);
  
  updatGrid(newHead,tail);
  directionLock = false;
}

function updatGrid(head,tail) {
  // const headRow = Math.floor(head / numsRow);
  // const headCol = Math.floor(head % numsRow);

  // const tailRow = Math.floor(tail / numsRow);
  // const tailCol = Math.floor(tail % numsRow);

  // console.log(headRow,headCol,tailRow,tailCol);
  // console.log(`${headCol * 20}px,${headRow * 20}px`);

  // squares[head].style.transform = `translate(${headCol * 20}px,${headRow * 20}px)`;
  // squares[tail].style.transform = `translate(${tailCol * 20}px,${tailRow * 20}px)`;

  squares[tail].classList.remove('snake');
  squares[head].classList.add('snake');
  updateHead();
}

function updateHead() {
  const directHead = directionHead()
  // squares.forEach((square) => {
  //   square.classList.remove('right','left','up','down');
  // });
  squares[snake[0]].classList.add('head');
  squares[snake[0]].classList.add(directHead);

  if(snake.length > 1)
  squares[snake[1]].classList.remove('head');
  squares[snake[1]].classList.remove('right','left','up','down');
}

function check(newHead) {
  const hitTop = newHead < 0;
  const hitBottom = newHead >= numsCol * numsRow;
  const hitRight = (newHead % numsCol === 0) && direction === 1;
  const hitLeft = (newHead % numsCol === numsCol - 1) && direction=== -1;
  const hitSelf = snake.includes(newHead);

  if(hitSelf || hitBottom || hitTop || hitRight || hitLeft) {
    console.log(hitSelf,hitBottom,hitTop,hitRight,hitLeft);
    return 0;}
  return 1;
}

function displayFruit() {
  randomPosition = Math.floor(Math.random() * (numsCol * numsRow));

  while(snake.includes(randomPosition)) randomPosition = Math.floor(Math.random() * (numsCol * numsRow));
  squares[randomPosition].classList.add('fruit');
}

function checkFruit(newHead) {
  if (newHead === randomPosition) {
    console.log('eat');
    squares[randomPosition].classList.remove('fruit');
    displayFruit();
    eatFruit();
  }
}

function eatFruit() {
  snake.push(snake[snake.length-1]);
  score++;
  if(highScore < score) {
    highScore = score;
    localStorage.setItem('high-score',highScore.toString());
    // document.querySelector('.high-score').innerHTML = `High Score : <br>${highScore}`;
  }
  document.querySelector('.score').innerHTML = `Score :<br> ${score}`;
}

function directionHead() {
  switch (direction) {
    case 1:
      return 'right';
    case -1:
      return 'left';
    case numsCol:
      return 'down';
    case -numsCol:
      return 'up';
      
    default:
      break;
  }
}

function returnOriginPosition() {
  squares.forEach((square) => {
    square.classList.remove('snake','head','fruit');
  })
  snake = [1,1];
  direction = 1;
  score = 0;
  const gg = document.querySelector('.game-over');
  if(gg) {
    gg.remove();
    // alert('gg');
  }
}

function disableBtn() {
  buttons.forEach( btn => {
    btn.disabled = true;
  })
}
function enableBtn() {
  buttons.forEach( btn => {
    btn.disabled = false;
  })
}

function gameOver() {
  // snake.forEach(index => squares[index].classList.add('fade'));

  const GG = document.createElement('div');
  GG.classList.add('game-over');
  GG.textContent = 'GAME OVER !!';
  document.querySelector('.field').appendChild(GG);
}

const list = document.querySelector('.choice-difficulty');
function chooseDifficulty(option=0) {
  if(option) {
    list.innerHTML = '';
    return;
  }
  else 
  list.innerHTML = `
            <span>choose the speed of the snake :</span>
            <div class="choices">
              <button class="diff" id="20">20%</button>
              <button class="diff" id="50">50%</button>
              <button class="diff" id="100">100%</button>
              <button class="diff" id="150">150%</button>
              <button class="diff" id="200">200%</button>
              <button class="diff" id="250">250%</button>
              <button class="confirm">Confirm</button>
            </div>
  `;
  document.getElementById(`${difficulty}`).classList.add('choosen');
}

document.querySelector('.difficulty').addEventListener('click',() => {
  chooseDifficulty();
  document.querySelector('.score').innerHTML = '';
  document.querySelector('.confirm').addEventListener('click',() => {
    chooseDifficulty(1);
  });

  const choices = document.querySelectorAll('.diff');
  choices.forEach(choice => {
    console.log(choice.id);
    choice.addEventListener('click', () => {
      difficulty = choice.id;
      console.log(difficulty);
      document.querySelector('.choosen').classList.remove('choosen');
      document.getElementById(`${choice.id}`).classList.add('choosen');
    });
  })
});