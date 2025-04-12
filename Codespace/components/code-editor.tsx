"use client"

import { useEffect, useRef } from "react"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { java } from "@codemirror/lang-java"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { oneDark } from "@codemirror/theme-one-dark"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
}

export default function CodeEditor({ value, onChange, language = "javascript" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // Clean up previous editor instance
    if (editorViewRef.current) {
      editorViewRef.current.destroy()
    }

    // Determine language extension
    let langExtension
    switch (language.toLowerCase()) {
      case "python":
        langExtension = python()
        break
      case "java":
        langExtension = java()
        break
      case "javascript":
      default:
        langExtension = javascript({ jsx: true })
        break
    }

    // Create editor
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        langExtension,
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          "&": {
            height: "300px",
            fontSize: "14px",
          },
          ".cm-scroller": {
            overflow: "auto",
          },
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    editorViewRef.current = view

    return () => {
      view.destroy()
    }
  }, [language])

  // Update editor content when value prop changes
  useEffect(() => {
    const view = editorViewRef.current
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      })
    }
  }, [value])

  return <div ref={editorRef} className="border border-purple-800/50 rounded-md overflow-hidden" />
}
