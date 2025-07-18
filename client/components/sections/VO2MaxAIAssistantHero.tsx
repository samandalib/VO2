import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp, Target, FlaskConical } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const SAMPLE_QUESTIONS = [
  "What is VO₂max and why does it matter?",
  "How can I improve my VO₂max?",
  "What is a good VO₂max for my age?",
  "How do I test my VO₂max at home?",
  "What training protocols boost VO₂max fastest?",
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Track your VO₂max progress and training metrics",
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverColor: "hover:bg-primary/20",
    onClick: () => window.location.assign("/dashboard"),
  },
  {
    icon: TrendingUp,
    title: "VO₂Max Projection",
    description: "Calculate your future cardiovascular fitness trajectory",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-900/40",
    onClick: () => window.location.assign("/#projection"),
  },
  {
    icon: Target,
    title: "Training Protocols",
    description: "Get personalized, science-backed training plans",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    hoverColor: "hover:bg-purple-200",
    onClick: () => window.location.assign("/#training-protocols"),
  },
  {
    icon: FlaskConical,
    title: "Testing Protocols",
    description: "Learn about VO₂max measurement techniques",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    hoverColor: "hover:bg-orange-200",
    onClick: () => window.location.assign("/#testing-protocols"),
  },
];

function useTypingAnimation(samples: string[], speed = 60, pause = 1200) {
  const [display, setDisplay] = useState("");
  const [sampleIdx, setSampleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;
    if (charIdx < samples[sampleIdx].length) {
      const timeout = setTimeout(() => {
        setDisplay(samples[sampleIdx].slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      const timeout = setTimeout(() => {
        setIsTyping(true);
        setCharIdx(0);
        setSampleIdx((i) => (i + 1) % samples.length);
      }, pause);
      return () => clearTimeout(timeout);
    }
  }, [charIdx, isTyping, sampleIdx, samples, speed, pause]);

  return display;
}

export function VO2MaxAIAssistantHero() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [assistantReply, setAssistantReply] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingSample = useTypingAnimation(SAMPLE_QUESTIONS);

  // Fetch answer from OpenAI /v1/responses backend
  async function fetchAssistantAnswer(userInput: string) {
    setIsLoading(true);
    setUserMessage(userInput);
    setAssistantReply("");
    try {
      const res = await fetch("/api/assistant-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: userInput }
          ]
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setAssistantReply(fullText);
      }
    } catch (err) {
      setAssistantReply("Sorry, there was an error getting a response from the assistant.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [assistantReply, userMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setInput("");
    setHasAsked(true);
    fetchAssistantAnswer(input.trim());
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 min-h-[80vh] flex flex-col items-center justify-center px-4 py-16"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-2xl w-full flex flex-col items-center gap-6">
        {/* Hero title and subtitle only before first question is asked */}
        {!hasAsked && (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Build your VO₂max knowledge
            </h1>
            <p className="text-lg md:text-xl text-center text-muted-foreground mb-6">
              Ask anything about VO₂max, training, protocols, or fitness science.
            </p>
          </>
        )}
        {/* Answer area, only after first question is asked */}
        {hasAsked && (
          <div className="w-full max-w-2xl min-h-[200px] md:min-h-[300px] max-h-[420px] md:max-h-[600px] overflow-y-auto mb-2 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-background" ref={scrollRef}>
            {/* User message */}
            {userMessage && (
              <div className="rounded-lg p-3 mb-2 text-muted-foreground bg-card border border-border">
                <span className="text-base">{userMessage}</span>
              </div>
            )}
            {/* Assistant reply */}
            {isLoading && (
              <div className="rounded-lg p-3 mb-2 bg-muted animate-pulse">
                <span className="text-base text-foreground">Thinking...</span>
              </div>
            )}
            {assistantReply && !isLoading && (
              <div className="rounded-lg p-3 mb-2 bg-muted">
                <div className="prose prose-neutral dark:prose-invert max-w-none text-base text-foreground">
                  <ReactMarkdown>{assistantReply}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Input box with typing animation */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl flex items-center gap-2 bg-card rounded-2xl shadow-lg border border-border px-4 py-4"
        >
          <Textarea
            className="flex-1 border-none bg-transparent text-lg focus:ring-0 focus:outline-none placeholder:text-muted-foreground text-foreground h-14 resize-none min-h-[56px] max-h-[120px]"
            placeholder={typingSample || "Ask anything about VO₂max..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
            aria-label="Ask anything about VO₂max"
            autoFocus
          />
          <Button
            type="submit"
            className="rounded-full bg-primary hover:bg-primary/90 text-white w-12 h-12 flex items-center justify-center shadow text-xl"
            disabled={isLoading || !input.trim()}
            aria-label="Send question"
          >
            <span className="sr-only">Send</span>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path d="M3 12l18-7-7 18-2.5-7.5L3 12z" fill="currentColor" />
            </svg>
          </Button>
        </form>
        {/* Render current hero cards below */}
        <div className="w-full mt-10 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20 aspect-square min-h-[120px] flex flex-col justify-center items-center"
                  onClick={feature.onClick}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 transition-colors duration-300 ${feature.bgColor} ${feature.hoverColor}`}>
                    <IconComponent className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-xs font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-snug text-center">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 