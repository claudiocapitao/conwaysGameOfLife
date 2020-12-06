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
})

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

function arrayWithCoordinatesOfMarkedPositions() {
    let positionsArray = [];
    for (let i = 0; i < gameOfLifeBoard.length; i++) {
        for (let j = 0; j < gameOfLifeBoard[0].length; j++) {
            if (gameOfLifeBoard[i][j] == 1) {
                positionsArray.push([i, j]);
            }
        }
    }
    return positionsArray;
}

function refreshCanvas() {
    for (let i = 0; i < gameOfLifeBoard.length; i++) {
        for (let j = 0; j < gameOfLifeBoard[0].length; j++) {
            gameOfLifeBoard[i][j] = 0;
        }
    }
    changeOldArrayWithBorder(gameOfLifeBoard, allSquares);
}

function preBuilt(myArray) {
    let numberArray = [];
    let centerOfTheImage = [];

    for (i = 0; i < 2; i++) {
        for (j = 0; j < myArray.length; j++) {
            numberArray.push(myArray[j][i]);
        }
        let minNumber = Math.min(...numberArray);
        let maxNumber = Math.max(...numberArray);
        let center = parseInt(minNumber + ((maxNumber - minNumber) / 2));
        centerOfTheImage.push(center);
        numberArray = [];
    }
    return centerOfTheImage;
}

function buildFromCenter(myArray, centerOfTheImage) {
    for (i = 0; i < 2; i++) {
        for (j = 0; j < myArray.length; j++) {
            myArray[j][i] -= centerOfTheImage[i];
        }
    }

    let stringArray = "";
    for (i = 0; i < myArray.length; i++) {
        if (i == 0) {
            stringArray += "[";
        }
        for (j = 0; j < 2; j++) {
            if (j == 1 && i == myArray.length - 1) {
                stringArray += "," + myArray[i][j] + "]";
            } else if (j == 1) {
                stringArray += "," + myArray[i][j] + "], ";
            } else {
                stringArray += "[" + myArray[i][j];
            }
        }
        if (i == myArray.length - 1) {
            stringArray += "]";
        }
    }

    document.getElementById("arrayWithPositions").innerHTML = "Array with positions: " + stringArray;
    return myArray
}




function preDefinedGameOfLife(myArray) {

    let iMiddle = parseInt(gameOfLifeBoard.length / 2);
    let jMiddle = parseInt(gameOfLifeBoard[0].length / 2);

    refreshCanvas()

    for (let i = 0; i < myArray.length; i++) {
        gameOfLifeBoard[iMiddle + myArray[i][0]][jMiddle + myArray[i][1]] = 1;
    }

    changeOldArrayWithBorder(gameOfLifeBoard, allSquares);
}

function checkGameOfLifeBoard() {
    preDefinedGameOfLife(buildFromCenter(arrayWithCoordinatesOfMarkedPositions(), preBuilt(arrayWithCoordinatesOfMarkedPositions())))
}

function preDefinedGameOfLife(myArray) {

    let iMiddle = parseInt(gameOfLifeBoard.length / 2);
    let jMiddle = parseInt(gameOfLifeBoard[0].length / 2);

    refreshCanvas()

    for (let i = 0; i < myArray.length; i++) {
        gameOfLifeBoard[iMiddle + myArray[i][0]][jMiddle + myArray[i][1]] = 1;
    }

    changeOldArrayWithBorder(gameOfLifeBoard, allSquares);
}

let arrayGliderDuplicator = [
    [-24, -3],
    [-24, -2],
    [-23, -3],
    [-22, -14],
    [-22, -13],
    [-22, -5],
    [-22, -3],
    [-21, -14],
    [-21, -11],
    [-21, -5],
    [-21, -4],
    [-20, -28],
    [-20, -26],
    [-20, -10],
    [-19, -30],
    [-19, -26],
    [-19, -23],
    [-19, -22],
    [-19, -21],
    [-19, -10],
    [-18, -30],
    [-18, -10],
    [-17, -37],
    [-17, -36],
    [-17, -31],
    [-17, -26],
    [-17, -18],
    [-17, -17],
    [-17, -14],
    [-17, -11],
    [-16, -37],
    [-16, -36],
    [-16, -30],
    [-16, -22],
    [-16, -20],
    [-16, -17],
    [-16, -14],
    [-16, -13],
    [-15, -30],
    [-15, -26],
    [-15, -20],
    [-15, -19],
    [-15, -18],
    [-14, -28],
    [-14, -26],
    [-11, -11],
    [-11, -6],
    [-11, -5],
    [-11, 19],
    [-11, 20],
    [-10, -10],
    [-10, -5],
    [-10, 19],
    [-10, 20],
    [-9, -12],
    [-9, -11],
    [-9, -10],
    [-9, -5],
    [-9, -3],
    [-9, 5],
    [-9, 16],
    [-9, 17],
    [-9, 24],
    [-9, 28],
    [-9, 29],
    [-8, -4],
    [-8, -3],
    [-8, 5],
    [-8, 7],
    [-8, 15],
    [-8, 16],
    [-8, 17],
    [-8, 23],
    [-8, 27],
    [-8, 29],
    [-7, 8],
    [-7, 9],
    [-7, 16],
    [-7, 17],
    [-7, 24],
    [-7, 25],
    [-7, 26],
    [-7, 27],
    [-7, 28],
    [-6, 8],
    [-6, 9],
    [-6, 19],
    [-6, 20],
    [-6, 25],
    [-6, 26],
    [-6, 27],
    [-5, 8],
    [-5, 9],
    [-5, 19],
    [-5, 20],
    [-4, 5],
    [-4, 7],
    [-3, 5],
    [0, 6],
    [0, 7],
    [1, 6],
    [1, 7],
    [5, 7],
    [5, 8],
    [5, 9],
    [6, 9],
    [7, 8],
    [10, -9],
    [10, -7],
    [10, 29],
    [10, 30],
    [11, -11],
    [11, -7],
    [11, -1],
    [11, 0],
    [11, 1],
    [11, 29],
    [11, 31],
    [12, -18],
    [12, -17],
    [12, -11],
    [12, -3],
    [12, -1],
    [12, 2],
    [12, 5],
    [12, 6],
    [12, 31],
    [13, -18],
    [13, -17],
    [13, -12],
    [13, -7],
    [13, 1],
    [13, 2],
    [13, 5],
    [13, 8],
    [13, 31],
    [13, 32],
    [14, -11],
    [14, 9],
    [15, -11],
    [15, -7],
    [15, -4],
    [15, -3],
    [15, -2],
    [15, 9],
    [16, -9],
    [16, -7],
    [16, 9],
    [16, 35],
    [16, 36],
    [17, 5],
    [17, 8],
    [17, 14],
    [17, 15],
    [17, 35],
    [17, 37],
    [18, 5],
    [18, 6],
    [18, 14],
    [18, 16],
    [18, 37],
    [19, 16],
    [19, 37],
    [19, 38],
    [20, 16],
    [20, 17],
    [21, 25],
    [21, 26],
    [22, 25],
    [22, 27],
    [23, 27],
    [24, 27],
    [24, 28]
];