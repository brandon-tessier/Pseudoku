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
   const sudokuGraph = new SudokuGraph();
//   console.log("Vertices:", sudokuGraph.getVertices());
//   console.log("Edges:", sudokuGraph.getEdges());
   sudokuGraph.addTile("R4", "C4", "S2", "B4");
//   console.log("Vertices:", sudokuGraph.getVertices());
//   console.log("Edges:", sudokuGraph.getEdges());
//   sudokuGraph.removeTile("R4", "C4", "S2", "B4");
//   console.log("Vertices:", sudokuGraph.getVertices());
//   console.log("Edges:", sudokuGraph.getEdges());
// Print vertices and edges
