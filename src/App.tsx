/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Pin, 
  Download, 
  Volume2, 
  VolumeX,
  PenTool,
  Quote,
  Trash2,
  Github,
  Instagram,
  User
} from 'lucide-react';
import { generateAdvice, AdviceResult } from './geminiService';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

const MOODS = [
  { id: 'serious', label: 'Serious', color: 'bg-pencil text-paper' },
  { id: 'absurd', label: 'Absurd', color: 'bg-marker text-white' },
  { id: 'poetic', label: 'Poetic', color: 'bg-pen text-white' },
  { id: 'brutal', label: 'Brutal', color: 'bg-pencil text-marker' },
];

const RANDOM_QUESTIONS = [
  "Should I quit my job and become a professional cloud-watcher?",
  "How do I find true love in a world of digital toasters?",
  "Is it better to be a wise owl or a very fast squirrel?",
  "What is the meaning of the lint in my pocket?",
  "Should I tell my cat about my secret bank account?",
  "How can I become as calm as a cucumber in a blender?",
  "Why does the moon follow me home?",
  "Is it possible to bake a cake using only positive thoughts?"
];

interface PinnedAdvice extends AdviceResult {
  id: string;
  question: string;
  mood: string;
  rotation: number;
}

export default function App() {
  const [question, setQuestion] = useState('');
  const [mood, setMood] = useState('absurd');
  const [loading, setLoading] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState<AdviceResult | null>(null);
  const [pinnedAdvice, setPinnedAdvice] = useState<PinnedAdvice[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [activeCredit, setActiveCredit] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientOscillatorRef = useRef<OscillatorNode | null>(null);
  const adviceCardRef = useRef<HTMLDivElement>(null);

  // Initialize Audio
  const initAudio = () => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    // Ambient sound (simple drone)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    ambientOscillatorRef.current = osc;
    setIsAudioEnabled(true);
  };

  const playChime = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const toggleAudio = () => {
    if (!audioContextRef.current) {
      initAudio();
    } else {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
        setIsAudioEnabled(true);
      } else {
        audioContextRef.current.suspend();
        setIsAudioEnabled(false);
      }
    }
  };

  const handleSurpriseMe = () => {
    const randomIdx = Math.floor(Math.random() * RANDOM_QUESTIONS.length);
    setQuestion(RANDOM_QUESTIONS[randomIdx]);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setCurrentAdvice(null);
    
    try {
      const result = await generateAdvice(question, mood);
      setCurrentAdvice(result);
      playChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d4d', '#2d5da1', '#fff9c4']
      });
    } catch (error) {
      console.error("Oracle failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePin = () => {
    if (!currentAdvice) return;
    const newPinned: PinnedAdvice = {
      ...currentAdvice,
      id: Date.now().toString(),
      question,
      mood,
      rotation: Math.random() * 4 - 2 // -2 to 2 degrees
    };
    setPinnedAdvice(prev => [newPinned, ...prev]);
    setCurrentAdvice(null);
    setQuestion('');
  };

  const handleDownload = async () => {
    if (!adviceCardRef.current) return;
    try {
      const dataUrl = await toPng(adviceCardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `oracle-advice-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const removePinned = (id: string) => {
    setPinnedAdvice(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <header className="text-center relative py-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-6 wobbly-border bg-paper relative"
        >
          <h1 className="text-4xl md:text-6xl font-kalam text-pencil">THE ORACLE</h1>
          <div className="absolute -top-4 -right-4 text-marker rotate-12">
            <Sparkles size={32} />
          </div>
          <p className="text-sm mt-2 opacity-60 italic">Hand-scrawled wisdom for the modern soul</p>
        </motion.div>
        
        <button 
          onClick={toggleAudio}
          className="absolute top-0 right-0 p-2 rounded-full border-2 border-pencil hover:bg-pencil hover:text-paper transition-colors"
        >
          {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      {/* Input Section */}
      <section className="flex flex-col gap-6">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the Oracle anything..."
            className="w-full h-32 p-6 bg-paper border-2 border-dashed border-pencil rounded-xl focus:outline-none focus:ring-2 focus:ring-pen/20 text-xl font-patrick resize-none"
          />
          <div className="absolute bottom-4 right-4 text-pencil/20 pointer-events-none">
            <PenTool size={32} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`px-6 py-2 font-kalam text-lg rounded-full transition-all transform hover:-translate-y-1 ${
                mood === m.id 
                  ? `${m.color} scale-105 shadow-lg` 
                  : 'bg-white border-2 border-pencil text-pencil opacity-60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center relative">
          <button
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 px-6 py-3 border-2 border-pencil rounded-lg font-kalam hover:bg-pencil hover:text-paper transition-all animate-wobbly-press"
          >
            <RotateCcw size={20} />
            Surprise Me
          </button>
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-pencil text-paper rounded-lg font-kalam text-xl hover:bg-pencil/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-wobbly-press shadow-xl"
          >
            {loading ? (
              <div className="flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-paper rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-paper rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-paper rounded-full" />
              </div>
            ) : (
              <>
                <Send size={20} />
                Ask the Oracle
              </>
            )}
          </button>
          
          {/* Hand-drawn arrow */}
          <div className="absolute -right-16 top-0 hidden lg:block rotate-12 text-pencil/40">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10C15 15 25 40 45 45M45 45L35 40M45 45L40 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-kalam text-xs block -mt-2">Click it!</span>
          </div>
        </div>
      </section>

      {/* Current Advice Card */}
      <AnimatePresence>
        {currentAdvice && (
          <motion.div
            initial={{ y: -100, opacity: 0, rotate: -5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div 
              ref={adviceCardRef}
              className="torn-paper w-full max-w-lg p-8 md:p-12 border-x-2 border-pencil/5"
            >
              <div className="tape-strip" />
              
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-widest opacity-40 font-kalam">Oracle Wisdom</span>
                  <h2 className="text-3xl font-kalam text-pencil mt-1">{currentAdvice.title}</h2>
                </div>

                <div className="space-y-4 text-lg leading-relaxed">
                  {currentAdvice.advice.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-postit/30 border-l-4 border-marker italic relative">
                  <Quote className="absolute -top-2 -left-2 text-marker/20" size={32} />
                  "{currentAdvice.quote}"
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t border-pencil/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-kalam opacity-40">Absurdity</span>
                    <div className="flex gap-0.5">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${i < currentAdvice.absurdity_rating ? 'bg-marker' : 'bg-pencil/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-kalam opacity-40">#{mood}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePin}
                className="flex items-center gap-2 px-6 py-2 bg-pen text-white rounded-lg font-kalam hover:opacity-90 transition-all"
              >
                <Pin size={18} />
                Pin to Wall
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 border-2 border-pencil rounded-lg font-kalam hover:bg-pencil hover:text-paper transition-all"
              >
                <Download size={18} />
                Save Image
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinboard */}
      <section className="mt-12">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-kalam text-pencil">The Wall of Wisdom</h3>
          <div className="h-px flex-1 bg-pencil/10" />
          {pinnedAdvice.length > 0 && (
            <button 
              onClick={() => setPinnedAdvice([])}
              className="text-xs font-kalam text-marker hover:underline"
            >
              Clear Wall
            </button>
          )}
        </div>

        {pinnedAdvice.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-pencil/10 rounded-2xl opacity-40">
            <p className="font-kalam italic">The wall is empty... for now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinnedAdvice.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: p.rotation }}
                whileHover={{ scale: 1.02, rotate: p.rotation + (Math.random() > 0.5 ? 1 : -1) }}
                className="bg-paper p-6 shadow-md border border-pencil/5 relative group"
                style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
              >
                <div className="thumbtack" />
                
                <button 
                  onClick={() => removePinned(p.id)}
                  className="absolute top-2 right-2 p-1 text-marker opacity-0 group-hover:opacity-100 transition-opacity hover:bg-marker/10 rounded"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex flex-col gap-4">
                  <div className="text-xs opacity-40 italic">Q: {p.question}</div>
                  <h4 className="text-xl font-kalam text-pencil leading-tight">{p.title}</h4>
                  <p className="text-sm line-clamp-3 opacity-80">{p.advice.split('\n\n')[0]}</p>
                  <div className="text-xs font-kalam text-pen">"{p.quote}"</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Decoration */}
      <footer className="mt-auto pt-12 text-center pb-8">
        <div className="font-kalam text-sm flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-60">
            <span>Built by</span>
            <div className="relative inline-block">
              <button 
                onClick={() => setActiveCredit(activeCredit === 'aditya' ? null : 'aditya')}
                className="text-pen hover:underline cursor-pointer font-bold"
              >
                Aditya
              </button>
              <AnimatePresence>
                {activeCredit === 'aditya' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-postit shadow-xl wobbly-border z-50 min-w-[140px]"
                  >
                    <div className="flex flex-col gap-2">
                      <a href="https://github.com/adimestry" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pen transition-colors">
                        <Github size={14} /> GitHub
                      </a>
                      <a href="https://www.instagram.com/aditya_mestry_x007/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-marker transition-colors">
                        <Instagram size={14} /> Instagram
                      </a>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-postit rotate-45 border-r-2 border-b-2 border-pencil" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span>and</span>
            <div className="relative inline-block">
              <button 
                onClick={() => setActiveCredit(activeCredit === 'dhruv' ? null : 'dhruv')}
                className="text-pen hover:underline cursor-pointer font-bold"
              >
                Dhruv
              </button>
              <AnimatePresence>
                {activeCredit === 'dhruv' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-postit shadow-xl wobbly-border z-50 min-w-[140px]"
                  >
                    <div className="flex flex-col gap-2">
                      <a href="https://github.com/dhruvkasar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pen transition-colors">
                        <Github size={14} /> GitHub
                      </a>
                      <a href="https://www.instagram.com/dhruvvkasar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-marker transition-colors">
                        <Instagram size={14} /> Instagram
                      </a>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-postit rotate-45 border-r-2 border-b-2 border-pencil" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="opacity-30 text-xs">© 2026 The Eccentric Philosopher</div>
        </div>
      </footer>
    </div>
  );
}
