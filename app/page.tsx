"use client"

import { SetStateAction, useState } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const [spin, setSpin] = useState(false) // Create a state variable to control the spin animation
  const [data, setData] = useState("") // Create a state variable to store the response data
  const [prompt, setPrompt] = useState("") // Create a state variable to store the prompt text
  const [lang, setLang] = useState("") // Create a state variable to store the language
  const [copied, setCopied] = useState(false) // Create a state variable to store the copied text

  function handleChange(event: { target: { value: SetStateAction<string> } }) {
    setPrompt(event.target.value) // update the state variable when the input value changes
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(data)

    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleSubmit = () => {
    axios(`https://hungry-snail-21.deno.dev/request?prompt=${prompt}`, {
      method: "GET",
      headers: {},
      withCredentials: true,
    })
      .then((response) => {
        console.log(response.data)
        let output = response.data

        let pattern = /```(\w+)/
        let match = pattern.exec(output)
        if (match) {
          setLang(match[1])
        } else {
          return ""
        }

        let patternRemove = /^```\w+\n|```$|^\s+|\s+$/g

        setData(output.replace(patternRemove, "").trim())
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setSpin(false) // Stop the spin animation
      })

    setSpin(true) // Set spin to true when the button is clicked
    // Add your logic for submitting the prompt here
  }

  return (
    <div>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-center gap-2">
          <h4 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome
          </h4>

          <p className="mb-10 max-w-lg text-center leading-7 [&:not(:first-child)]:mt-4">
            This is a simple code generator that uses the PaLM API. Simply input
            your prompt in the box below to get started.
          </p>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label>Prompt</Label>
            <Input id="prompt" placeholder="Prompt" onChange={handleChange} />
          </div>

          <div className="my-4 grid w-full max-w-sm">
            <Button
              disabled={spin}
              onClick={handleSubmit} // Add this onClick handler to call the handleSubmit function
            >
              <Loader2
                className={spin ? "mr-2 h-4 w-4 animate-spin" : ""}
                hidden={!spin}
              />
              {spin ? "Submitting..." : "Submit"}
            </Button>
          </div>

          <div className="mt-5 grid w-full max-w-2xl gap-1.5">
            <Label htmlFor="message-2">Output</Label>

            <SyntaxHighlighter
              showLineNumbers={true}
              className="rounded-md"
              language={lang}
              style={oneDark}
            >
              {data}
            </SyntaxHighlighter>

            <p className="text-sm text-muted-foreground">
              Run the code at your own risk.
            </p>
            <Button onClick={handleCopy} variant="secondary" className="mt-4">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
