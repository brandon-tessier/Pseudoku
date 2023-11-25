class Graph {
    constructor() {
        this.vertices = new Map(); // Map to store vertices and their positions
        this.edges = new Map();    // Map to store edges
    }

    addVertex(vertex, position) {
        if (this.vertices.has(vertex)) {
            console.error("Vertex ${vertex} already exists.");
            return;
        }

        this.vertices.set(vertex, position);
        this.edges.set(vertex, new Set());
    }

    addEdge(vertex1, vertex2) {
        if (!this.vertices.has(vertex1) || !this.vertices.has(vertex2)) {
            console.error("One or more vertices do not exist.");
            return;
        }

        // Add edges in both directions since graphs are typically undirected
        this.edges.get(vertex1).add(vertex2);
        this.edges.get(vertex2).add(vertex1);
    }

    removeEdge(vertex1, vertex2) {
        if (this.edges.has(vertex1) && this.edges.has(vertex2)) {
            this.edges.get(vertex1).delete(vertex2);
            this.edges.get(vertex2).delete(vertex1);
        }
    }

    getVertices() {
        return Array.from(this.vertices.keys());
    }

    getEdges() {
        const edgeList = [];
        for (const [vertex, neighbors] of this.edges) {
            for (const neighbor of neighbors) {
                if (vertex < neighbor) { // To avoid duplicate edges
                    edgeList.push([vertex, neighbor]);
                }
            }
        }
        return edgeList;
    }
}

class SudokuGraph extends Graph {
    static vertices = new Map(); // Static property to store vertices

    constructor() {
        super();
        this.initializeVertices();
    }

    initializeVertices() {
        // Add row vertices (R1, R2, R3, R4)
        for (let i = 1; i <= 4; i++) {
            this.addVertex("R" + i, { x: 20 + (i - 1) * 40, y: 0 });
        }

        // Add column vertices (C1, C2, C3, C4)
        for (let i = 1; i <= 4; i++) {
            this.addVertex("C" + i, { x: 0 + (i - 1) * 20, y: 40 + (i - 1) * 30 });
        }

        // Add symbol vertices (S1, S2, S3, S4)
        for (let i = 1; i <= 4; i++) {
            this.addVertex("S" + i, { x: 170 - (i - 1) * 20, y: 40 + (i - 1) * 30 });
        }

        // Add box vertices (B1, B2, B3, B4)
        for (let i = 1; i <= 4; i++) {
            this.addVertex("B" + i, { x: 215 - (i - 1) * 20, y: 90 + (i - 1) * 30 });
        }
    }

    addTile(row, col, sym, box) {
        this.addEdge(row, col);
        this.addEdge(row, sym);
        this.addEdge(col, sym);
        this.addEdge(box, sym);
    }

    removeEdge(vertex1, vertex2) {
        if (this.edges.has(vertex1) && this.edges.has(vertex2)) {
            this.edges.get(vertex1).delete(vertex2);
            this.edges.get(vertex2).delete(vertex1);
        }
    }

    removeTile(row, col, sym, box) {
        this.removeEdge(row, col);
        this.removeEdge(row, sym);
        this.removeEdge(col, sym);
        this.removeEdge(box, sym);
    }
}

// Create a 4x4 Sudoku graph
//    const sudokuGraph = new SudokuGraph();
//   console.log("Vertices:", sudokuGraph.getVertices());
//   console.log("Edges:", sudokuGraph.getEdges());
//    sudokuGraph.addTile("R4", "C4", "S2", "B4");
//   console.log("Vertices:", sudokuGraph.getVertices());
//   console.log("Edges:", sudokuGraph.getEdges());
//   sudokuGraph.removeTile("R4", "C4", "S2", "B4");
//   console.log("Vertices:", sudokuGraph.getVertices());
//   console.log("Edges:", sudokuGraph.getEdges());
// Print vertices and edges

class SudokuBoard {
    constructor() {
        this.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }

    // Method to initialize the board with a provided starting configuration
    initializeBoard(initialConfig) {
        if (initialConfig.length !== 4 || initialConfig.some(row => row.length !== 4)) {
            console.error("Invalid initial configuration.");
            return;
        }

        this.board = initialConfig.map(row => row.slice());
    }

    // Method to check if a move is valid in the Sudoku board
    isValidMove(row, col, num) {
        // Check if the number is already in the row or column
        for (let i = 0; i < 4; i++) {
            if (this.board[row][i] === num || this.board[i][col] === num) {
                return false;
            }
        }

        // Check if the number is already in the 2x2 box
        const boxStartRow = Math.floor(row / 2) * 2;
        const boxStartCol = Math.floor(col / 2) * 2;

        for (let i = boxStartRow; i < boxStartRow + 2; i++) {
            for (let j = boxStartCol; j < boxStartCol + 2; j++) {
                if (this.board[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    // Method to solve the Sudoku board using backtracking
    solve() {
        const emptyCell = this.findEmptyCell();

        if (!emptyCell) {
            // No empty cells, the board is solved
            return true;
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= 4; num++) {
            if (this.isValidMove(row, col, num)) {
                // Try placing the number in the empty cell
                this.board[row][col] = num;

                // Recursively try to solve the rest of the board
                if (this.solve()) {
                    return true;
                }

                // If the current configuration doesn't lead to a solution, backtrack
                this.board[row][col] = 0;
            }
        }

        // No valid number found for this cell, backtrack
        return false;
    }

    // Method to find the first empty cell in the board
    findEmptyCell() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] === 0) {
                    return [i, j];
                }
            }
        }

        return null; // If no empty cell is found
    }

    // Method to print the Sudoku board
    printBoard() {
        for (let i = 0; i < 4; i++) {
            console.log(this.board[i].join(" "));
        }
    }

    addSymbol(row, col, sym) {
        if (row < 0 || row >= 4 || col < 0 || col >= 4 || sym < 1 || sym > 4) {
            console.error("Invalid move. Please provide valid row, column, and number.");
            return false;
        }

        if (this.isValidMove(row, col, sym)) {
            this.board[row][col] = sym;
            console.log(`Symbol ${sym} added to row ${row + 1}, column ${col + 1}.`);
            return true;
        } else {
            console.error(`Invalid move. Cannot add ${sym} to row ${row + 1}, column ${col + 1}.`);
            return false;
        }
    }

    getBox(row, col) {
        return (2 * Math.floor(row / 2)) + (Math.floor(col / 2));
    }
}

function linktograph(row,col,sym,sb,sg){
    if(sb.addSymbol(row,col,sym)){
        const box = sb.getBox(row,col);
        sg.addTile("R"+(row+1),"C"+(col+1),"S"+(sym),"B"+(box+1));
        //("R4", "C4", "S2", "B4");
    }
}

// Example Usage:

const sudoku = new SudokuBoard();

// Example initial configuration
const initialConfig = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

sudoku.initializeBoard(initialConfig);
const happySG = new SudokuGraph();

console.log("Initial Board:");
sudoku.printBoard();
linktograph(3,0,2,sudoku,happySG);
console.log("Vertices:", happySG.getVertices());
console.log("Edges:", happySG.getEdges());
console.log("\nBoard after player's move:");
sudoku.printBoard();


// Create a 4x4 Sudoku graph
//   if (sudoku.solve()) {
//     console.log("\nSolved Board:");
//     sudoku.printBoard();
//   } else {
//     console.log("\nNo solution exists.");
//   }
