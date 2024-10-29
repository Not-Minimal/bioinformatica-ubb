"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Edge, Node } from "@/lib/algorithms/types";

interface AlignmentGridProps {
  edges: Edge[];
  nodes: Node[];
  paso: number;
}

export function AlignmentGrid({ edges, nodes, paso }: AlignmentGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length || !edges.length) return;

    // Limpiar el SVG existente
    d3.select(svgRef.current).selectAll("*").remove();

    // Configuración inicial
    const size = 300;
    const margin = {
      top: 50,
      bottom: 30,
      left: 70,
      right: 20,
    };

    const numNodes = nodes.length;
    const sizeCell = size / numNodes;
    const rectPadding = 0.1 * sizeCell;
    const rectCell = sizeCell - rectPadding * 2;

    // Crear el SVG
    const svg = d3
      .select(svgRef.current)
      .attr(
        "viewBox",
        `0 0 ${size + margin.left + margin.right} ${size + margin.top + margin.bottom}`,
      )
      .style("max-width", "100%")
      .style("height", "auto");

    // Definiciones para patrones y marcadores
    const defs = svg.append("defs");

    // Patrón para la cuadrícula
    const pattern = defs
      .append("pattern")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", sizeCell)
      .attr("height", sizeCell)
      .attr("id", "matrix-grid")
      .attr("viewBox", "0 0 100 100");

    pattern
      .append("rect")
      .attr("width", "100")
      .attr("height", "100")
      .attr("fill", "none")
      .attr("stroke", "hsl(205, 89%, 15%)");

    // Marcador para las flechas
    const marker = defs
      .append("marker")
      .attr("id", "marker")
      .attr("viewBox", "-0.5 -2 3 4")
      .attr("markerWidth", "5")
      .attr("markerHeight", "5")
      .attr("orient", "auto");

    marker
      .append("path")
      .attr("d", "M 0 -1.5 2 0 0 1.5z")
      .attr("fill", "hsl(0, 0%, 0%)")
      .attr("stroke", "hsl(0, 0%, 0%)")
      .attr("stroke-width", "1")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");

    // Grupos principales
    const group = svg
      .append("g")
      .attr("transform", `translate(${margin.left} ${margin.top})`);

    const groupNodes = group
      .append("g")
      .attr("font-size", "12")
      .attr("fill", "currentColor")
      .attr("font-weight", "700");

    const groupEdges = group.append("g");
    const groupFrame = group.append("g").style("pointer-events", "none");
    const groupHighlight = group
      .append("g")
      .style("pointer-events", "none")
      .attr("opacity", "0");

    // Escala para los nodos
    const scaleNodes = d3
      .scaleBand()
      .domain(nodes.map((d) => d.node.toString()))
      .range([0, size]);

    // Actualizar posiciones de nodos
    nodes.forEach((d) => {
      const o = scaleNodes(d.node.toString());
      if (o !== undefined) {
        d.x = o;
        d.y = o;
        d.size = scaleNodes.bandwidth();
      }
    });

    // Actualizar posiciones de edges
    edges.forEach((d) => {
      const sourceNode = nodes.find(({ node }) => node === d.i);
      const targetNode = nodes.find(({ node }) => node === d.j);
      if (sourceNode && targetNode) {
        d.nodeSize = sourceNode.size;
        d.x = targetNode.y;
        d.y = sourceNode.x;
      }
    });

    // Calcular tamaño de fuente proporcional
    const fontSize = (size / numNodes) * 0.5;

    // Renderizar secuencia 1 (vertical)
    groupNodes
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "end")
      .attr("transform", (d) => `translate(-10 ${d.y! + d.size! / 2})`)
      .style("font-size", `${fontSize}px`)
      .text((d) => d.seq1);

    // Renderizar secuencia 2 (horizontal)
    groupNodes
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", (d) => `translate(${d.x! + d.size! / 2} -10)`)
      .style("font-size", `${fontSize}px`)
      .text((d) => d.seq2);

    // Renderizar celdas
    const groupsEdges = groupEdges
      .selectAll("g")
      .data(edges)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x} ${d.y})`);

    // Renderizar valores en las celdas
    groupsEdges
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr(
        "transform",
        (d) => `translate(${d.nodeSize! / 2} ${d.nodeSize! / 2})`,
      )
      .style("font-size", `${fontSize}px`)
      .text((d) => (d.puntaje !== undefined ? d.puntaje : ""));

    // Renderizar flechas para caminos
    groupsEdges
      .filter((d) => d.diagonal === 1)
      .append("path")
      .attr(
        "d",
        (d) =>
          `M ${d.nodeSize! / 2} ${d.nodeSize! / 2} l ${(rectCell / 2) * -1} ${(rectCell / 2) * -1}`,
      )
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 1)
      .attr("marker-end", "url(#marker)");

    groupsEdges
      .filter((d) => d.superior === 1)
      .append("path")
      .attr(
        "d",
        (d) =>
          `M ${d.nodeSize! / 2} ${d.nodeSize! / 2} l ${0} ${(rectCell / 2) * -1}`,
      )
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 1)
      .attr("marker-end", "url(#marker)");

    groupsEdges
      .filter((d) => d.lateral === 1)
      .append("path")
      .attr(
        "d",
        (d) =>
          `M ${d.nodeSize! / 2} ${d.nodeSize! / 2} l ${(rectCell / 2) * -1} ${0}`,
      )
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", 1)
      .attr("marker-end", "url(#marker)");

    // Marco de la matriz
    groupFrame
      .append("rect")
      .attr("width", size)
      .attr("height", size)
      .attr("fill", "url(#matrix-grid)")
      .attr("stroke", "hsl(205, 89%, 15%)")
      .attr("stroke-width", "2")
      .attr("rx", "10");

    // Interactividad
    const format = d3.format(",");

    groupsEdges
      .on("mouseenter", function (event, d) {
        const { x, y, nodeSize: size, puntaje } = d;
        const value = isNaN(puntaje!) ? "" : format(puntaje!);

        groupHighlight.select("rect").attr("transform", `translate(${x} ${y})`);

        if (d.i === 0 || d.j === 0) {
          groupHighlight
            .select("text")
            .html(
              `Puntaje inicialización <tspan font-weight="700">${value}</tspan>`,
            );
        } else {
          groupHighlight.select("text").html(``);
        }

        groupHighlight.attr("opacity", "1");
      })
      .on("mouseleave", () => {
        groupHighlight.attr("opacity", "0");
      });
  }, [edges, nodes, paso]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg
        ref={svgRef}
        className="w-full h-auto"
        style={{ maxHeight: "70vh" }}
      />
    </div>
  );
}
