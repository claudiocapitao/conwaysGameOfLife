var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

canvas.width = 800;
canvas.height = 500;

canvas.style.background = "#f7f3f0";

class Square {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.rect(this.x, this.y, this.w, this.h);
        context.fillStyle = this.color;
        context.strokeStyle = "#FFFFFF";
        context.fill();
        context.stroke();
    }

    update() {
        context.clearRect(this.x, this.y, this.w, this.h)
    }
}

var allSquares = [];
var gameOfLifeBoard = [];

var numberOfCellsPerRow = canvas.width / 10;
var numberOfCellsPerColumn = canvas.height / 10;

for (var i = 0; i < numberOfCellsPerColumn; i++) {
    allSquares[i] = [];
    gameOfLifeBoard[i] = [];
    for (var j = 0; j < numberOfCellsPerRow; j++) {
        var mySquare = new Square(j * 10, i * 10, 10, 10, "#f7f3f0");
        allSquares[i][j] = mySquare;
        gameOfLifeBoard[i][j] = 0;
        allSquares[i][j].draw(context);
    }
}

canvas.addEventListener("click", (event) => {
    var rect = canvas.getBoundingClientRect();
    const xMouse = event.clientX - rect.left;
    const yMouse = event.clientY - rect.top;
    console.log("x:" + xMouse + "y:" + yMouse);
    j = parseInt(xMouse / 10);
    i = parseInt(yMouse / 10);
    console.log("i: " + i + " j: " + j);

    if (gameOfLifeBoard[i][j] == 0) {
        allSquares[i][j].update(context);
        allSquares[i][j].color = "#777777";
        gameOfLifeBoard[i][j] = 1;
        allSquares[i][j].draw(context);
    } else if (gameOfLifeBoard[i][j] == 1) {
        allSquares[i][j].update(context);
        allSquares[i][j].color = "#f7f3f0";
        gameOfLifeBoard[i][j] = 0;
        allSquares[i][j].draw(context);
    }
    console.log(i + " : " + j + " = " + gameOfLifeBoard[i][j])
})

function CountNeighbours(i, j, boardArray) {
    iLen = boardArray.length;
    jLen = boardArray[i].length;

    counter = 0;

    //topLeftPosition
    if (boardArray[(iLen - 1 + i) % iLen][(jLen - 1 + j) % jLen] == 1) { counter++ };
    //topMiddlePosition
    if (boardArray[(iLen - 1 + i) % iLen][j] == 1) { counter++ };
    //topRightPosition
    if (boardArray[(iLen - 1 + i) % iLen][(jLen + 1 + j) % jLen] == 1) { counter++ };

    //LeftMiddlePosition
    if (boardArray[i][(jLen - 1 + j) % jLen] == 1) { counter++ };
    //RightMiddlePosition
    if (boardArray[i][(jLen + 1 + j) % jLen] == 1) { counter++ };

    //bottomLeftPosition
    if (boardArray[(iLen + 1 + i) % iLen][(jLen - 1 + j) % jLen] == 1) { counter++ };
    //bottomMiddlePosition
    if (boardArray[(iLen + 1 + i) % iLen][j] == 1) { counter++ };
    //bottomRightPosition
    if (boardArray[(iLen + 1 + i) % iLen][(jLen + 1 + j) % jLen] == 1) { counter++ };

    return counter
}

function applyRulesAndConvertCell(i, j, numberOfNeighbours, boardArray) {
    if (boardArray[i][j] == 1) {
        if (numberOfNeighbours < 2) {
            return 0;
        } else if (numberOfNeighbours == 2 || numberOfNeighbours == 3) {
            return 1;
        } else if (numberOfNeighbours > 3) {
            return 0;
        }
    } else if (boardArray[i][j] == 0) {
        if (numberOfNeighbours == 3) {
            return 1;
        } else {
            return 0;
        }
    }
}

function gameOfLife(boardArray) {
    let newGameOfLifeBoard = []
    for (let i = 0; i < boardArray.length; i++) {
        newGameOfLifeBoard[i] = [];
        for (let j = 0; j < boardArray[0].length; j++) {
            let changedValue = applyRulesAndConvertCell(i, j, CountNeighbours(i, j, boardArray), boardArray);
            newGameOfLifeBoard[i][j] = changedValue;
        }
    }
    gameOfLifeBoard = newGameOfLifeBoard;
}

function changeOldArrayWithBorder(boardArray, oldArray) {
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[0].length; j++) {
            if (boardArray[i][j] == 0) {
                oldArray[i][j].color = "#f7f3f0";
                oldArray[i][j].update(context);
                oldArray[i][j].draw(context);
            } else if (boardArray[i][j] == 1) {
                oldArray[i][j].color = "#777777";
                oldArray[i][j].update(context);
                oldArray[i][j].draw(context);
            }
        }
    }
}

function changeOldArrayWithoutBorder(boardArray, oldArray) {
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[0].length; j++) {
            if (boardArray[i][j] == 0) {
                oldArray[i][j].color = "#f7f3f0";
                oldArray[i][j].update(context);
                //                oldArray[i][j].draw(context);
            } else if (boardArray[i][j] == 1) {
                oldArray[i][j].color = "#777777";
                oldArray[i][j].update(context);
                oldArray[i][j].draw(context);
            }
        }
    }
}

var boardState = true; // 1 for running and 0 for stop

function startGameOfLife() {
    numberOfCycles = true

    function nextGen() {
        gameOfLife(gameOfLifeBoard);
        changeOldArrayWithoutBorder(gameOfLifeBoard, allSquares);
        if (numberOfCycles) {
            startGameOfLife()
        } else {
            changeOldArrayWithBorder(gameOfLifeBoard, allSquares);
        }
    }
    setTimeout(nextGen, 100);
}

function stopGameOfLife() {
    numberOfCycles = false;
}

function refreshCanvas() {
    stopGameOfLife();
    for (let i = 0; i < gameOfLifeBoard.length; i++) {
        for (let j = 0; j < gameOfLifeBoard[0].length; j++) {
            gameOfLifeBoard[i][j] = 0;
        }
    }
    changeOldArrayWithBorder(gameOfLifeBoard, allSquares);
}