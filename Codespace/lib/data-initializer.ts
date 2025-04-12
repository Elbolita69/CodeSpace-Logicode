import type { User, Challenge } from "./types"

export function initializeData() {
  // Initialize users if they don't exist
  if (!localStorage.getItem("users")) {
    const demoUser: User = {
      id: "1",
      name: "Usuario Demo",
      email: "demo@example.com",
      password: "demo123",
      xp: 350,
      streak: 3,
      completedChallenges: ["1", "2"],
      inProgressChallenges: ["3"],
      achievements: ["Principiante", "Lógica Básica"],
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("users", JSON.stringify([demoUser]))
  }

  // Initialize challenges if they don't exist
  if (!localStorage.getItem("challenges")) {
    const challenges: Challenge[] = [
      {
        id: "1",
        title: "Suma de Números Pares",
        description: "Crea una función que calcule la suma de todos los números pares en un rango dado.",
        difficulty: 1,
        category: "Algoritmos",
        language: "javascript",
        xpReward: 50,
        estimatedTime: 15,
        objectives: [
          "Implementar un bucle para iterar sobre un rango de números",
          "Identificar números pares usando el operador módulo (%)",
          "Calcular la suma acumulativa de los números pares",
        ],
        hints:
          "Recuerda que un número es par si al dividirlo por 2 el resto es 0. Puedes usar el operador módulo (%) para verificar esto.",
        starterCode: `function sumaPares(inicio, fin) {
  // Tu código aquí
  
}

// Ejemplo de uso:
// sumaPares(1, 10) debería devolver 30 (2 + 4 + 6 + 8 + 10)`,
        expectedSolution: ["for (let i = inicio; i <= fin; i++)", "if (i % 2 === 0)", "suma += i"],
        expectedOutput: "La suma de los números pares entre 1 y 10 es: 30",
        progress: 100,
      },
      {
        id: "2",
        title: "Palíndromo",
        description:
          "Implementa una función que determine si una cadena de texto es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).",
        difficulty: 2,
        category: "Algoritmos",
        language: "javascript",
        xpReward: 75,
        estimatedTime: 20,
        objectives: [
          "Normalizar la cadena (eliminar espacios y convertir a minúsculas)",
          "Comparar la cadena original con su versión invertida",
          "Manejar casos especiales como cadenas vacías",
        ],
        hints:
          "Puedes convertir la cadena a un array, invertirlo y luego volver a unirlo en una cadena. También considera eliminar espacios y normalizar mayúsculas/minúsculas.",
        starterCode: `function esPalindromo(texto) {
  // Tu código aquí
  
}

// Ejemplos:
// esPalindromo("ana") debería devolver true
// esPalindromo("Anita lava la tina") debería devolver true
// esPalindromo("hola") debería devolver false`,
        expectedSolution: [
          "texto = texto.toLowerCase().replace(/[^a-z0-9]/g, '')",
          "return texto === texto.split('').reverse().join('')",
        ],
        expectedOutput: "La cadena 'Anita lava la tina' es un palíndromo: true",
        progress: 100,
      },
      {
        id: "3",
        title: "Implementación de una Pila (Stack)",
        description:
          "Implementa una estructura de datos de tipo Pila (Stack) con operaciones básicas como push, pop, peek y isEmpty.",
        difficulty: 3,
        category: "Estructuras de Datos",
        language: "javascript",
        xpReward: 100,
        estimatedTime: 30,
        objectives: [
          "Implementar la estructura de datos Pila usando un array",
          "Crear métodos para añadir (push) y eliminar (pop) elementos",
          "Implementar método para ver el elemento superior (peek) sin eliminarlo",
          "Crear método para verificar si la pila está vacía (isEmpty)",
        ],
        hints:
          "Una pila sigue el principio LIFO (Last In, First Out). Puedes usar un array y sus métodos push() y pop() como base para tu implementación.",
        starterCode: `class Pila {
  constructor() {
    // Inicializa tu estructura de datos aquí
  }
  
  // Añade un elemento al tope de la pila
  push(elemento) {
    // Tu código aquí
  }
  
  // Elimina y devuelve el elemento del tope de la pila
  pop() {
    // Tu código aquí
  }
  
  // Devuelve el elemento del tope sin eliminarlo
  peek() {
    // Tu código aquí
  }
  
  // Verifica si la pila está vacía
  isEmpty() {
    // Tu código aquí
  }
}

// Ejemplo de uso:
// const miPila = new Pila();
// miPila.push(1);
// miPila.push(2);
// console.log(miPila.peek()); // Debería mostrar 2
// console.log(miPila.pop()); // Debería mostrar 2
// console.log(miPila.isEmpty()); // Debería mostrar false`,
        expectedSolution: [
          "this.items = []",
          "this.items.push(elemento)",
          "return this.items.pop()",
          "return this.items[this.items.length - 1]",
          "return this.items.length === 0",
        ],
        expectedOutput: "Operaciones de la pila ejecutadas correctamente",
        progress: 30,
      },
      {
        id: "4",
        title: "Ordenamiento por Burbuja",
        description:
          "Implementa el algoritmo de ordenamiento de burbuja para ordenar un array de números de menor a mayor.",
        difficulty: 2,
        category: "Algoritmos",
        language: "javascript",
        xpReward: 80,
        estimatedTime: 25,
        objectives: [
          "Implementar el algoritmo de ordenamiento burbuja con bucles anidados",
          "Comparar elementos adyacentes y realizar intercambios cuando sea necesario",
          "Optimizar el algoritmo para evitar comparaciones innecesarias",
        ],
        hints:
          "El algoritmo de burbuja compara pares de elementos adyacentes y los intercambia si están en el orden incorrecto. Este proceso se repite hasta que no se necesiten más intercambios.",
        starterCode: `function ordenamientoBurbuja(array) {
  // Tu código aquí
  
}

// Ejemplo:
// ordenamientoBurbuja([5, 3, 8, 4, 2]) debería devolver [2, 3, 4, 5, 8]`,
        expectedSolution: [
          "for (let i = 0; i < array.length; i++)",
          "for (let j = 0; j < array.length - i - 1; j++)",
          "if (array[j] > array[j + 1])",
          "[array[j], array[j + 1]] = [array[j + 1], array[j]]",
        ],
        expectedOutput: "Array ordenado: [2, 3, 4, 5, 8]",
      },
      {
        id: "5",
        title: "Fibonacci Recursivo",
        description: "Implementa una función recursiva que calcule el n-ésimo número de la secuencia de Fibonacci.",
        difficulty: 3,
        category: "Algoritmos",
        language: "javascript",
        xpReward: 100,
        estimatedTime: 30,
        objectives: [
          "Implementar una solución recursiva para calcular Fibonacci",
          "Manejar casos base (F(0) = 0, F(1) = 1)",
          "Entender y aplicar el concepto de recursividad",
        ],
        hints:
          "Recuerda que la secuencia de Fibonacci se define como F(n) = F(n-1) + F(n-2), con casos base F(0) = 0 y F(1) = 1. Ten cuidado con la profundidad de recursión para números grandes.",
        starterCode: `function fibonacci(n) {
  // Tu código aquí
  
}

// Ejemplos:
// fibonacci(0) debería devolver 0
// fibonacci(1) debería devolver 1
// fibonacci(6) debería devolver 8 (0, 1, 1, 2, 3, 5, 8)`,
        expectedSolution: [
          "if (n <= 0) return 0",
          "if (n === 1) return 1",
          "return fibonacci(n - 1) + fibonacci(n - 2)",
        ],
        expectedOutput: "El 6º número de Fibonacci es: 8",
      },
      {
        id: "6",
        title: "Búsqueda Binaria",
        description: "Implementa el algoritmo de búsqueda binaria para encontrar un elemento en un array ordenado.",
        difficulty: 4,
        category: "Algoritmos",
        language: "javascript",
        xpReward: 120,
        estimatedTime: 40,
        objectives: [
          "Implementar el algoritmo de búsqueda binaria",
          "Manejar correctamente los índices y puntos medios",
          "Devolver la posición del elemento o -1 si no se encuentra",
        ],
        hints:
          "La búsqueda binaria funciona dividiendo repetidamente a la mitad el espacio de búsqueda. Recuerda que el array debe estar ordenado para que funcione correctamente.",
        starterCode: `function busquedaBinaria(array, elemento) {
  // Tu código aquí
  
}

// Ejemplo:
// busquedaBinaria([1, 3, 5, 7, 9, 11, 13], 7) debería devolver 3 (índice donde se encuentra el 7)
// busquedaBinaria([1, 3, 5, 7, 9, 11, 13], 6) debería devolver -1 (no se encuentra)`,
        expectedSolution: [
          "let inicio = 0",
          "let fin = array.length - 1",
          "while (inicio <= fin)",
          "let medio = Math.floor((inicio + fin) / 2)",
          "if (array[medio] === elemento) return medio",
          "if (array[medio] < elemento) inicio = medio + 1",
          "else fin = medio - 1",
          "return -1",
        ],
        expectedOutput: "El elemento 7 se encuentra en el índice: 3",
      },
    ]

    localStorage.setItem("challenges", JSON.stringify(challenges))
  }
}
