export interface Edge {
  i: number;
  j: number;
  puntaje?: number;
  camino?: number;
  diagonal?: number;
  superior?: number;
  lateral?: number;
  nodeSize?: number;
  x?: number;
  y?: number;
}

export interface Node {
  id?: number;
  node: number;
  seq1: string;
  seq2: string;
  x?: number;
  y?: number;
  size?: number;
}

export interface AlignmentResult {
  seq1: string;
  seq2: string;
  puntaje: number;
}

export type Algorithm = "nw" | "sw";

export interface Camino {
  coordenadas: number[][];
  pasos: string[];
  camino: Edge[];
}
