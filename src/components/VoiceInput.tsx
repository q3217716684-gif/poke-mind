"use client";

import { useState, useRef } from "react";

interface VoiceInputProps {
  onResult: (text: string) => void;
  onAppend: (text: string) => void;
  className?: string;
}

export default function VoiceInput({ onResult, onAppend, className = "" }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      alert("你的浏览器不支持语音输入，请使用 Chrome 浏览器");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        onAppend(finalText);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        alert("请允许麦克风权限后重试");
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={listening ? stopListening : startListening}
      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        listening
          ? "bg-red-500 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.3)]"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      } ${className}`}
      title={listening ? "点击停止录音" : "语音输入（需要 Chrome）"}
    >
      <span className="text-lg">{listening ? "⏹" : "🎤"}</span>
    </button>
  );
}
