"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Play, Pause, RotateCcw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { Challenge } from "@/lib/types"

interface VisualSimulationProps {
  challenge: Challenge
}

export default function VisualSimulation({ challenge }: VisualSimulationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState(1)

  // Simulation steps based on challenge type
  const simulationSteps = getSimulationSteps(challenge)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying && currentStep < simulationSteps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 2000 / speed)
    } else if (currentStep >= simulationSteps.length - 1) {
      setIsPlaying(false)
    }

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, simulationSteps.length, speed])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const handleSliderChange = (value: number[]) => {
    setCurrentStep(value[0])
    setIsPlaying(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/50 rounded-lg p-6 min-h-[300px] relative">
        {simulationSteps[currentStep]?.visualization}

        <div className="absolute bottom-4 right-4">
          <div className="text-xs text-purple-400 bg-black/70 px-2 py-1 rounded">
            Paso {currentStep + 1} de {simulationSteps.length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-800/50">
          <h3 className="font-medium mb-2">Explicación:</h3>
          <p className="text-purple-200 text-sm">{simulationSteps[currentStep]?.explanation}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="border-purple-600 text-purple-300 hover:bg-purple-800/50"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="border-purple-600 text-purple-300 hover:bg-purple-800/50"
            onClick={reset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Slider
              value={[currentStep]}
              max={simulationSteps.length - 1}
              step={1}
              onValueChange={handleSliderChange}
              className="py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-400">Velocidad:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-purple-900/50 border border-purple-800/50 rounded text-sm p-1 text-purple-200"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate simulation steps based on challenge type
function getSimulationSteps(challenge: Challenge) {
  // This would be replaced with actual simulation data from the backend
  // For now, we'll generate some example steps based on the challenge type

  if (challenge.category === "Algoritmos") {
    return [
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Algoritmo de Ordenamiento</h3>
              <p className="text-sm text-purple-300">Visualización de Bubble Sort</p>
            </div>
            <div className="flex gap-2 items-end">
              {[5, 3, 8, 1, 2, 7, 4, 6].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-purple-600 rounded-t-md w-8"
                  style={{ height: `${value * 20}px` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-center text-white">{value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ),
        explanation:
          "El algoritmo Bubble Sort comienza comparando elementos adyacentes. Aquí vemos el arreglo inicial sin ordenar.",
      },
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Algoritmo de Ordenamiento</h3>
              <p className="text-sm text-purple-300">Visualización de Bubble Sort</p>
            </div>
            <div className="flex gap-2 items-end">
              {[3, 5, 1, 2, 7, 4, 6, 8].map((value, index) => (
                <motion.div
                  key={index}
                  className={`rounded-t-md w-8 ${index === 0 || index === 1 ? "bg-green-500" : "bg-purple-600"}`}
                  style={{ height: `${value * 20}px` }}
                >
                  <div className="text-center text-white">{value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ),
        explanation:
          "Comparamos los dos primeros elementos (5 y 3) y los intercambiamos porque 5 > 3. Los elementos en verde son los que se están comparando actualmente.",
      },
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Algoritmo de Ordenamiento</h3>
              <p className="text-sm text-purple-300">Visualización de Bubble Sort</p>
            </div>
            <div className="flex gap-2 items-end">
              {[3, 1, 2, 5, 4, 6, 7, 8].map((value, index) => (
                <motion.div
                  key={index}
                  className={`rounded-t-md w-8 ${index === 7 ? "bg-pink-500" : "bg-purple-600"}`}
                  style={{ height: `${value * 20}px` }}
                >
                  <div className="text-center text-white">{value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ),
        explanation:
          "Después de la primera pasada, el elemento más grande (8) ha 'burbujeado' hasta el final del arreglo. Este elemento ya está en su posición final (marcado en rosa).",
      },
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Algoritmo de Ordenamiento</h3>
              <p className="text-sm text-purple-300">Visualización de Bubble Sort</p>
            </div>
            <div className="flex gap-2 items-end">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-green-500 rounded-t-md w-8"
                  style={{ height: `${value * 20}px` }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center text-white">{value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ),
        explanation:
          "Después de varias pasadas, el arreglo está completamente ordenado. Bubble Sort tiene una complejidad de tiempo de O(n²), lo que lo hace ineficiente para grandes conjuntos de datos.",
      },
    ]
  } else if (challenge.category === "Estructuras de Datos") {
    return [
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Estructura de Datos: Pila (Stack)</h3>
              <p className="text-sm text-purple-300">Operación PUSH</p>
            </div>
            <div className="flex flex-col-reverse items-center border-2 border-purple-500 rounded-md p-4 w-40">
              <div className="text-center text-gray-400 italic">Pila vacía</div>
            </div>
          </div>
        ),
        explanation:
          "Una pila (stack) es una estructura de datos LIFO (Last In, First Out) donde los elementos se añaden y eliminan desde el mismo extremo, llamado 'tope'.",
      },
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Estructura de Datos: Pila (Stack)</h3>
              <p className="text-sm text-purple-300">Operación PUSH</p>
            </div>
            <div className="flex flex-col-reverse items-center border-2 border-purple-500 rounded-md p-4 w-40">
              <motion.div
                className="bg-purple-600 text-white w-full text-center py-2 rounded-md mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Elemento A
              </motion.div>
              <motion.div
                className="text-purple-400 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                PUSH(A)
              </motion.div>
            </div>
          </div>
        ),
        explanation: "La operación PUSH añade un elemento al tope de la pila. Aquí estamos añadiendo el 'Elemento A'.",
      },
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Estructura de Datos: Pila (Stack)</h3>
              <p className="text-sm text-purple-300">Operación PUSH</p>
            </div>
            <div className="flex flex-col-reverse items-center border-2 border-purple-500 rounded-md p-4 w-40">
              <motion.div
                className="bg-green-500 text-white w-full text-center py-2 rounded-md mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Elemento B
              </motion.div>
              <div className="bg-purple-600 text-white w-full text-center py-2 rounded-md mb-2">Elemento A</div>
              <motion.div
                className="text-purple-400 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                PUSH(B)
              </motion.div>
            </div>
          </div>
        ),
        explanation:
          "Ahora añadimos otro elemento ('Elemento B') al tope de la pila. Observa cómo B está encima de A, siguiendo el principio LIFO.",
      },
      {
        visualization: (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Estructura de Datos: Pila (Stack)</h3>
              <p className="text-sm text-purple-300">Operación POP</p>
            </div>
            <div className="flex flex-col-reverse items-center border-2 border-purple-500 rounded-md p-4 w-40">
              <motion.div
                className="bg-green-500 text-white w-full text-center py-2 rounded-md mb-2"
                initial={{ y: 0 }}
                animate={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                Elemento B
              </motion.div>
              <div className="bg-purple-600 text-white w-full text-center py-2 rounded-md mb-2">Elemento A</div>
              <motion.div
                className="text-purple-400 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                POP() → B
              </motion.div>
            </div>
          </div>
        ),
        explanation:
          "La operación POP elimina y devuelve el elemento del tope de la pila. En este caso, eliminamos 'Elemento B', que fue el último en entrar.",
      },
    ]
  } else {
    // Default simulation for other challenge types
    return [
      {
        visualization: (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium">Simulación Visual</h3>
              <p className="text-sm text-purple-300 mb-4">Paso 1 de 4</p>
              <div className="bg-purple-800/50 p-6 rounded-lg">
                <code className="text-sm">
                  {`function ejemplo() {
  // Inicialización
  let contador = 0;
  console.log("Inicio del algoritmo");
}`}
                </code>
              </div>
            </div>
          </div>
        ),
        explanation:
          "En este primer paso, inicializamos las variables necesarias para nuestro algoritmo. La variable 'contador' se establece en 0.",
      },
      {
        visualization: (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium">Simulación Visual</h3>
              <p className="text-sm text-purple-300 mb-4">Paso 2 de 4</p>
              <div className="bg-purple-800/50 p-6 rounded-lg">
                <code className="text-sm">
                  {`function ejemplo() {
  // Inicialización
  let contador = 0;
  console.log("Inicio del algoritmo");
  
  // Bucle principal
  for (let i = 0; i < 5; i++) {
    contador += i;
  }
}`}
                </code>
              </div>
            </div>
          </div>
        ),
        explanation:
          "En el segundo paso, implementamos un bucle que itera 5 veces (de 0 a 4). En cada iteración, sumamos el valor de 'i' a nuestro contador.",
      },
      {
        visualization: (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium">Simulación Visual</h3>
              <p className="text-sm text-purple-300 mb-4">Paso 3 de 4</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Valores durante la ejecución:</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-700">
                        <th className="text-left p-1">Iteración</th>
                        <th className="text-left p-1">i</th>
                        <th className="text-left p-1">contador</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-purple-700/50">
                        <td className="p-1">Inicial</td>
                        <td className="p-1">-</td>
                        <td className="p-1">0</td>
                      </tr>
                      <tr className="border-b border-purple-700/50">
                        <td className="p-1">1</td>
                        <td className="p-1">0</td>
                        <td className="p-1">0</td>
                      </tr>
                      <tr className="border-b border-purple-700/50">
                        <td className="p-1">2</td>
                        <td className="p-1">1</td>
                        <td className="p-1">1</td>
                      </tr>
                      <tr className="border-b border-purple-700/50">
                        <td className="p-1">3</td>
                        <td className="p-1">2</td>
                        <td className="p-1">3</td>
                      </tr>
                      <tr className="border-b border-purple-700/50">
                        <td className="p-1">4</td>
                        <td className="p-1">3</td>
                        <td className="p-1">6</td>
                      </tr>
                      <tr>
                        <td className="p-1">5</td>
                        <td className="p-1">4</td>
                        <td className="p-1">10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-purple-800/50 p-4 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">10</div>
                    <div className="text-sm text-purple-300">Valor final del contador</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        explanation:
          "Aquí vemos cómo evoluciona el valor del contador en cada iteración del bucle. Comenzamos con contador = 0, y en cada paso sumamos el valor de i. Al final, contador = 0 + 0 + 1 + 2 + 3 + 4 = 10.",
      },
      {
        visualization: (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium">Simulación Visual</h3>
              <p className="text-sm text-purple-300 mb-4">Paso 4 de 4</p>
              <div className="bg-purple-800/50 p-6 rounded-lg">
                <code className="text-sm">
                  {`function ejemplo() {
  // Inicialización
  let contador = 0;
  console.log("Inicio del algoritmo");
  
  // Bucle principal
  for (let i = 0; i < 5; i++) {
    contador += i;
  }
  
  // Resultado final
  console.log("Resultado: " + contador);
  return contador;
}`}
                </code>
              </div>
              <div className="mt-4 p-3 bg-green-800/30 border border-green-600/50 rounded-lg">
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-green-500 h-5 w-5 mr-2" />
                  <span>Ejecución completada con éxito</span>
                </div>
              </div>
            </div>
          </div>
        ),
        explanation:
          "Finalmente, mostramos el resultado y lo devolvemos. Este algoritmo calcula la suma de los números del 0 al 4, que es 10. Esta técnica es útil para entender cómo funcionan los bucles y las acumulaciones en programación.",
      },
    ]
  }
}
