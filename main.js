const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    menu = document.querySelector('.menu'),
    betterScore = document.querySelector('.bestScore');
    betterScore.innerHTML = 'Best Score :  ' + localStorage.getItem('betScore');
let musicNum = Math.floor(Math.random() * 4) + 1,
    topScore = localStorage.getItem('betScore'),
    allow = false;

const audio = new Audio(`./music/audio${musicNum}.mp3`);
const crash = new Audio('./music/crash.mp3');
const aplodisments = new Audio('./music/aplodisments.mp3');
audio.addEventListener('loadeddata', () => {
    allow = true;
    //    console.log('аудио загружено');
});
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
    traffic: 2,
    level: 0
};

const getQuantityElements = heightElement => Math.ceil(gameArea.offsetHeight / heightElement);


function startGame(level) {
    switch (level.className) {
        case 'easy':
            setting.speed = 4;
            setting.traffic = 4;
            break;
        case 'medium':
            setting.speed = 6;
            setting.traffic = 3;
            break;
        case 'hard':
            setting.speed = 9;
            setting.traffic = 2;
            break;
        default:
            break;
    }
    menu.classList.add('hide');
    gameArea.classList.remove('hide');
    gameArea.innerHTML = '';
    score.classList.remove('hide');

    for (let i = 0; i < getQuantityElements(100) + 1; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random() * 3) + 1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./images/enemy${enemyImg}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }
    if (allow) {
        audio.play();
    }
    setting.start = true;
    gameArea.appendChild(car);

    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.score = 0;

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;

    requestAnimationFrame(playGame);

}

function playGame() {
 aplodisments.pause();
 crash.pause();
    if (setting.score > 1000 && setting.level === 0) {
        setting.speed++;
        setting.level++;
    } else if (setting.score > 4500 && setting.level === 1) {
        setting.speed++;
        setting.level++;
    } else if (setting.score > 10000 && setting.level === 2) {
        setting.speed++;
        setting.level++;
    } else if (setting.score > 15000 && setting.level === 3) {
        setting.speed++;
        setting.level++;
    } else if (setting.score > 20000 && setting.level === 4) {
        setting.speed++;
        setting.level++;
    }
    setting.score += setting.speed;
    score.innerHTML = 'SCORE: ' + setting.score;
    moveRoad();
    moveEnemy();

    //console.log('ОПА ' + keys[event.key]);
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
    if (setting.start) {
        requestAnimationFrame(playGame);
    } else {

        if (topScore < setting.score) {
            
            aplodisments.play();
            localStorage.setItem('betScore', setting.score);
            alert('УРА!!! Поздравляю вы побили рекорд. Новый рекорд: ' + localStorage.getItem('betScore'));
            betterScore.innerHTML = 'Best Score :  ' + localStorage.getItem('betScore');
            
        } 
    }

}

function startRun(event) {
    event.preventDefault();
    if (event.key in keys) {
        keys[event.key] = true;
    }
}

function stopRun(event) {
    event.preventDefault();

    if (event.key in keys) {
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

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom &&
            carRect.right + 3 >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
                crash.play();
            setting.start = false;
            console.warn('ДТП');
            menu.classList.remove('hide');
            menu.style.top = score.offsetHeight;
            audio.pause();
            for (var event in keys) {
                keys[event] = false;
            }
            menu.style.height = '77%';

            gameArea.classList.add('hide');
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= gameArea.offsetHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
    // console.log(enemy);

}