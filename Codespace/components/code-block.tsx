"use client"

import { useEffect, useRef } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-php"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-yaml"

interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language = "javascript" }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code])

  // Try to detect language from code
  const detectLanguage = (code: string): string => {
    if (
      code.includes("import React") ||
      code.includes("export default") ||
      code.includes("function(") ||
      code.includes("=>")
    ) {
      return "javascript"
    }
    if (code.includes("def ") || (code.includes("import ") && code.includes(":"))) {
      return "python"
    }
    if (code.includes("public class") || code.includes("System.out.println")) {
      return "java"
    }
    if (code.includes("<?php")) {
      return "php"
    }
    if (code.includes("#include <") || code.includes("int main(")) {
      return "cpp"
    }
    if (code.includes("SELECT") && code.includes("FROM")) {
      return "sql"
    }
    return language
  }

  const detectedLanguage = detectLanguage(code)

  return (
    <div className="rounded-md overflow-hidden bg-gray-900 text-gray-100 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-xs font-medium text-gray-400">{detectedLanguage.toUpperCase()}</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code ref={codeRef} className={`language-${detectedLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
