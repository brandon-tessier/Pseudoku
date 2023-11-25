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

// Create a 4x4 Sudoku graph

const sudokuGraph = new Graph();

// Add row vertices (R1, R2, R3, R4)
for (let i = 1; i <= 4; i++) {
  sudokuGraph.addVertex("R"+i, { x: 20 + (i-1)*40, y: 0 });
}

// Add column vertices (C1, C2, C3, C4)
for (let i = 1; i <= 4; i++) {
  sudokuGraph.addVertex("C"+i, { x: 0 + (i-1)*20, y: 40 + (i-1)*30 });
}

// Add symbol vertices (S1, S2, S3, S4)
for (let i = 1; i <= 4; i++) {
  sudokuGraph.addVertex("S"+i, { x: 170 - (i-1)*20, y: 40 + (i-1)*30 });
}

// Add box vertices (B1, B2, B3, B4)
for (let i = 1; i <= 4; i++) {
  sudokuGraph.addVertex("B"+i,  { x: 215 - (i-1)*20, y: 90 + (i-1)*30 });
}

// Connect the vertices based on Sudoku rules (rows, columns, symbols, and boxes)
// You need to add appropriate edges here according to Sudoku rules.
sudokuGraph.addEdge("S1","B1");

// Print vertices and edges
console.log("Vertices:", sudokuGraph.getVertices());
console.log("Edges:", sudokuGraph.getEdges());
