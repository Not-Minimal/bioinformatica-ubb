"use client";

import { useState, useEffect } from "react";
import { useAlignment } from "@/lib/algorithms/useAligment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlignmentGrid } from "./alignmentGrid";
import {
  Menu,
  Dna,
  Search,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Globe,
  ChevronRight as ChevronRightIcon,
  EqualNot,
  ShieldCheck,
  AlignHorizontalJustifyCenter,
  ArrowBigRight,
  ArrowBigLeft,
  MoveLeft,
  ChevronLeftSquare,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "./badge";

export default function BioinformaticaUBB() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGlobal, setIsGlobal] = useState(true);
  const [seq1, setSeq1] = useState("AAC");
  const [seq2, setSeq2] = useState("AAG");
  const [matchScore, setMatchScore] = useState(1);
  const [mismatchScore, setMismatchScore] = useState(-1);
  const [gapScore, setGapScore] = useState(-2);

  const {
    edges,
    nodes,
    paso,
    algoritmo,
    validarSecuenciaADN,
    handleInicializar,
    handleSiguiente,
    handleAnterior,
    handleAlgoritmoChange,
  } = useAlignment();

  useEffect(() => {
    handleAlgoritmoChange(isGlobal);
  }, [isGlobal, handleAlgoritmoChange]);

  const handleCalculate = () => {
    handleInicializar(seq1, seq2, gapScore, matchScore, mismatchScore);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* Sidebar toggle button */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 bg-black hover:bg-black/90"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-96 sm:w-full transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white border-r overflow-y-auto`} // Añadido overflow-y-auto
      >
        {/* ... resto del código del sidebar ... */}
        <div className="flex flex-col min-h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Image
                src="/ubblogo.png"
                alt="UBB Logo"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div className="gap-4 items-center justify-center ">
                <h1 className="text-lg sm:text-sm font-semibold pl-4">
                  Bioinformática UBB
                </h1>
                <p className="text-sm sm:text-xs text-gray-500 pl-4">
                  Alineamiento de Secuencias
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeftSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Secuencias */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-[#F8F9FC] rounded">
                <Dna className="h-4 w-4 text-gray-500" />
                <Input
                  value={seq1}
                  onChange={(e) => {
                    validarSecuenciaADN(e);
                    setSeq1(e.target.value);
                  }}
                  placeholder="Secuencia 1"
                  maxLength={20}
                  className="bg-transparent border-none focus:ring-0"
                />
              </div>
              <div className="flex items-center space-x-2 p-2 bg-[#F8F9FC] rounded">
                <Dna className="h-4 w-4 text-gray-500" />
                <Input
                  value={seq2}
                  onChange={(e) => {
                    validarSecuenciaADN(e);
                    setSeq2(e.target.value);
                  }}
                  placeholder="Secuencia 2"
                  maxLength={20}
                  className="bg-transparent border-none focus:ring-0"
                />
              </div>
              <div className="flex items-center space-x-2 p-2 bg-[#F8F9FC] rounded">
                <ShieldCheck className="h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="1 (match)"
                  maxLength={20}
                  className="bg-transparent border-none focus:ring-0"
                />
              </div>
              <div className="flex items-center space-x-2 p-2 bg-[#F8F9FC] rounded">
                <EqualNot className="h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="-1 (mismatch)"
                  maxLength={20}
                  className="bg-transparent border-none focus:ring-0"
                />
              </div>
              <div className="flex items-center space-x-2 p-2 bg-[#F8F9FC] rounded">
                <AlignHorizontalJustifyCenter className="h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  placeholder="-2 (gap)"
                  maxLength={20}
                  className="bg-transparent border-none focus:ring-0"
                />
              </div>
            </div>

            {/* Parámetros */}
            <div className="space-y-2">
              {/* ... inputs para matchScore, mismatchScore, gapScore ... */}
            </div>

            {/* Botones */}
            <Button className="w-full bg-primary" onClick={handleCalculate}>
              <Calculator className="mr-2 h-4 w-4" /> Inicializar
            </Button>
            <Button className="w-full bg-primary" onClick={handleAnterior}>
              <ArrowBigRight className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <Button className="w-full bg-primary" onClick={handleSiguiente}>
              <ArrowBigLeft className="mr-2 h-4 w-4" /> Siguiente
            </Button>
            <div className="mt-8 p-4 bg-slate-50 rounded-lg space-y-2">
              <h3 className="font-bold text-xl sm:text-sm">Notas:</h3>
              <ul className="text-lg sm:text-sm text-slate-600 space-y-1.5">
                <li className="sm:text-sm">- Se puede Agregar secuencias solo con caracteres A, C, T, G.</li>
                <li className="sm:text-sm">- Luego de agregarlos, se puede indicar los match, missmatch y gap.</li>
                <li className="sm:text-sm">- Se puede Inicializar la matriz luego de elegir las secuencias, pero no se puede inicializar el recorrido aun.</li>
                <li className="sm:text-sm">- Traspasar todo el código para que pueda correr en el servidor toma mas tiempo que 2 semanas.</li>
                <li className="sm:text-sm">- Tiene su dificultad tener un proyecto en NextJS, React, TailwindCSS y Shadcn/UI desplegado en la nube.(Perdon)</li>
              </ul>
            </div>
          </div>

          {/* Switch Global/Local */}
          <div className="p-4 border-t sticky bottom-0 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Global</span>
              </div>
              <Switch checked={isGlobal} onCheckedChange={setIsGlobal} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 p-8 ${sidebarOpen ? "ml-64" : ""
          } transition-all duration-300`}
      >
        <Card className="w-full h-full flex flex-col items-center justify-center bg-white p-8">
          <div className="flex justify-center items-center p-8">
            <Badge variant="secondary" className="text-lg sm:text-sm p-4 bg-red-100 text-red-800 hover:bg-red-100">
              Fase Beta 1.0 - Sin funcionalidad de Siguiente o Anterior
            </Badge>
          </div>
          <h2 className="text-lg font-semibold mb-6">
            {algoritmo === "nw"
              ? "Alineamiento Global: Needleman-Wunsch"
              : "Alineamiento Local: Smith-Waterman"}
          </h2>
          <AlignmentGrid edges={edges} nodes={nodes} paso={paso} />
        </Card>
      </main>
    </div>
  );
}