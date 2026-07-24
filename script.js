// grid

let mat = Array.from({ length: 10 }, () => Array(10).fill(""));
const grid = document.getElementById("grid");

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        grid.appendChild(cell);
    }
}

// start game

const btnGame = document.getElementById("btnGame");
let inGame = false;
let gameLoop = null;

function toggleGame() {
    if (!inGame) {
        btnGame.textContent = "pause";
        inGame = true;

        if (gameLoop !== null) return;
        gameLoop = setInterval(() => {
            moveSnake();
            draw();
        }, 300); // ms
    } else {
        btnGame.textContent = "resume";
        inGame = false;

        clearInterval(gameLoop);
        gameLoop = null;
    }
}

// move snake

let direction = "right";

let snake = [
    { i: 0, j: 2 },
    { i: 0, j: 1 },
    { i: 0, j: 0 }
];

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

function moveSnake() {
    const head = snake[0];
    let newHead = { ...head };

    switch (direction) {
        case "up":
            newHead.i--;
            break;
        case "down":
            newHead.i++;
            break;
        case "left":
            newHead.j--;
            break;
        case "right":
            newHead.j++;
            break;
    }

    // check boundaries

    if (
        newHead.i < 0 ||
        newHead.i >= 10 ||
        newHead.j < 0 ||
        newHead.j >= 10
    ) {
        gameOver();
        return;
    }

    // check that snake doesn't run into itself

    if (snake.some(part => part.i === newHead.i && part.j === newHead.j)) {
        gameOver();
        return;
    }

    // move or grow by one

    const ateFood = newHead.i === food.i && newHead.j === food.j;
    snake.unshift(newHead);

    if (!ateFood) {
        snake.pop();
    } else {
        generateFood();
    }
}

// draw snake and food

let snakeColor = "rgb(182, 19, 19)";
const colorButtons = document.querySelectorAll(".colorBtn");

colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        snakeColor = button.style.backgroundColor;
        draw();
    });
});

function draw() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.style.backgroundColor = "";
    });

    snake.forEach(part => {
        const index = part.i * 10 + part.j;
        cells[index].style.backgroundColor = snakeColor;
    });

    const foodIndex = food.i * 10 + food.j;
    cells[foodIndex].style.backgroundColor = "rgb(154, 53, 208)";
}

let food = null;

function generateFood() {
    do {
        food = {
            i: Math.floor(Math.random() * 10),
            j: Math.floor(Math.random() * 10)
        };
    } while (
        snake.some(part => part.i === food.i && part.j === food.j)
    );
}

// game over

function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    inGame = false;
    alert("game over");
    resetGame();
    btnGame.textContent = "start";
}

// start

generateFood();
draw();

function resetGame() {
    direction = "right";

    snake = [
        { i: 0, j: 2 },
        { i: 0, j: 1 },
        { i: 0, j: 0 }
    ];

    generateFood();
    draw();
}