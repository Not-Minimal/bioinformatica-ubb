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
} from "lucide-react";
import Image from "next/image";

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
        className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r`}
      >
        {/* ... resto del código del sidebar ... */}
        <div className="flex flex-col h-full">
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
                <h1 className="text-lg font-semibold pl-4">
                  Bioinformática UBB
                </h1>
                <p className="text-sm text-gray-500 pl-4">
                  Alineamiento de Secuencias
                </p>{" "}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4">
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
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <Button className="w-full bg-primary" onClick={handleSiguiente}>
              <ChevronRight className="mr-2 h-4 w-4" /> Siguiente
            </Button>
          </div>

          {/* Switch Global/Local */}
          <div className="p-4 border-t">
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
        className={`flex-1 p-8 ${
          sidebarOpen ? "ml-64" : ""
        } transition-all duration-300`}
      >
        <Card className="w-full h-full flex flex-col items-center justify-center bg-white p-8">
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
