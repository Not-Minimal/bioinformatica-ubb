"use client";

import { useState, useCallback } from "react";
import type { Algorithm, Edge, Node, AlignmentResult } from "./types";

export function useAlignment() {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [paso, setPaso] = useState(0);
  const [limite, setLimite] = useState(0);
  const [caminos, setCaminos] = useState<any[]>([]);
  const [posicionActualCamino, setPosicionActualCamino] = useState(0);
  const [final, setFinal] = useState(0);
  const [algoritmo, setAlgoritmo] = useState<Algorithm>("nw");

  const validarSecuenciaADN = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const valorFiltrado = input.value
        .toUpperCase()
        .split("")
        .filter((char) => ["A", "T", "C", "G"].includes(char))
        .join("");
      input.value = valorFiltrado;
    },
    [],
  );

  const handleInicializar = useCallback(
    (
      seq1: string,
      seq2: string,
      gap: number,
      matchScore: number,
      mismatchScore: number,
    ) => {
      setEdges([]);
      setNodes([]);
      setPaso(0);
      setLimite(0);
      setCaminos([]);
      setPosicionActualCamino(0);
      setFinal(0);

      const n = seq1.length + 1;
      const m = seq2.length + 1;

      let nodesData = Array.from(
        { length: Math.max(seq1.length, seq2.length) + 1 },
        (_, i) => ({
          node: i === 0 ? 0 : i,
          seq1: i === 0 ? "" : seq1[i - 1] || "",
          seq2: i === 0 ? "" : seq2[i - 1] || "",
        }),
      );

      setNodes(nodesData);

      let newEdges: Edge[] = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          newEdges.push({ i, j });
        }
      }

      // Aquí iría la lógica de inicialización específica para NW o SW
      if (algoritmo === "nw") {
        // Implementar inicializacionNW
      } else {
        // Implementar inicializacionSW
      }

      setEdges(newEdges);
      setPaso((prev) => prev + 1);
    },
    [algoritmo],
  );

  const handleSiguiente = useCallback(() => {
    if (paso < limite) {
      // Implementar lógica de siguiente
      setPaso((prev) => prev + 1);
    }
  }, [paso, limite]);

  const handleAnterior = useCallback(() => {
    if (paso > 1) {
      // Implementar lógica de anterior
      setPaso((prev) => prev - 1);
    }
  }, [paso]);

  const handleAlgoritmoChange = useCallback((isGlobal: boolean) => {
    setAlgoritmo(isGlobal ? "nw" : "sw");
  }, []);

  return {
    edges,
    nodes,
    paso,
    limite,
    algoritmo,
    validarSecuenciaADN,
    handleInicializar,
    handleSiguiente,
    handleAnterior,
    handleAlgoritmoChange,
  };
}
