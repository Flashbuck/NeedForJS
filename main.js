const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    music = document.createElement('embed'),
    menu = document.querySelector('.menu');

let musicNum = Math.floor(Math.random() * 4)+1;
let max = 1;
localStorage.setItem('betterScore',max);

    music.setAttribute('src', `./music/audio${musicNum}.mp3`);
    music.setAttribute('type', 'audio/mp3');
    music.classList.add('music');

car.classList.add('car');

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 4,
    traffic: 2
};

const getQuantityElements = (heightElement) => {
    return Math.ceil(gameArea.offsetHeight / heightElement);
};

function startGame(level) {
    switch (level.className) {
        case 'easy':
            setting.speed = 4;
            setting.traffic = 3;
            break;
        case 'medium':
            setting.speed = 6;
            setting.traffic = 2;     
            break;
        case 'hard':
            setting.speed = 8;
            setting.traffic = 1;  
            break;        
        default:
            break;
    }
    menu.classList.add('hide');
    gameArea.classList.remove('hide');

    gameArea.innerHTML = '';

    score.classList.remove('hide');
    score.innerHTML = '';
    for (let i = 0; i < getQuantityElements(100)+1; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    for(let i = 0; i< getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random() * 3) +1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i+1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./images/enemy${enemyImg}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.start = true;
    gameArea.appendChild(car);

    car.style.left = gameArea.offsetWidth/2 -car.offsetWidth/2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.score = 0;
    gameArea.appendChild(music);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);

}

function playGame() {
    
    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = 'SCORE:<br> ' + setting.score;
        moveRoad();
        moveEnemy();
        

        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth * 1.25)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
        
        localStorage.setItem('score',score.innerHTML);
    } else{
        music.remove();
        if(localStorage.getItem('score') > localStorage.getItem('betterScore')){
            localStorage.setItem('betterScore', localStorage.getItem('score'));
            alert('УРА!!! Поздравляю вы побили рекорд. Новый рекорд: '+localStorage.getItem('betterScore') );
        } else{
            alert('Набрано очков: '+localStorage.getItem('score'));
        }
    }

}

function startRun(event) {
    event.preventDefault();

    if (event.key in keys){
        keys[event.key] = true;
    }
}

function stopRun(event) {
    event.preventDefault();

    if (event.key in keys){
        keys[event.key] = false;
    } 
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        if (line.y >= gameArea.offsetHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
                setting.start = false;
                console.warn('ДТП');
                menu.classList.remove('hide');
                score.style.top = menu.offsetHeight;
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if(item.y >= gameArea.offsetHeight){
            item.y = -100  *  setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
    // console.log(enemy);

}
