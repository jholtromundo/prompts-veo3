import React, { useState, useEffect } from 'react';
import { GeneratedPrompt } from '../types';
import { Copy, Check, Sparkles, Edit3 } from 'lucide-react';

interface PromptCardProps {
  prompt: GeneratedPrompt;
  index: number;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, index }) => {
  const [copied, setCopied] = useState(false);
  const [fullText, setFullText] = useState(prompt.fullPrompt);

  useEffect(() => {
    setFullText(prompt.fullPrompt);
  }, [prompt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 transition-all duration-300 border border-slate-100 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            {prompt.title}
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase">
          {prompt.strategy}
        </span>
      </div>

      <div className="p-8">
        <div className="space-y-3">
          <div className="flex items-end justify-between mb-2">
             <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
               <Edit3 size={12} /> Prompt Editável
             </label>
             <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded border border-orange-100">
               Veo3 Optimized
             </span>
          </div>
          
          <div className="relative group">
            <textarea
              value={fullText}
              onChange={(e) => setFullText(e.target.value)}
              spellCheck={false}
              className="w-full bg-slate-50 text-slate-800 p-6 rounded-xl text-sm leading-relaxed min-h-[400px] font-mono resize-y focus:ring-2 focus:ring-orange-500/50 outline-none border-2 border-slate-100 focus:border-orange-400 transition-all shadow-inner"
            />
            
            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`absolute top-4 right-4 flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs transition-all shadow-lg transform active:scale-95 ${
                copied 
                  ? 'bg-green-500 text-white translate-y-0' 
                  : 'bg-slate-900 text-white hover:bg-orange-600 opacity-90 hover:opacity-100'
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} /> COPIADO!
                </>
              ) : (
                <>
                  <Copy size={16} /> COPIAR
                </>
              )}
            </button>
          </div>

          <div className="flex justify-between items-center mt-4 px-2">
            <p className="text-[10px] text-slate-400 italic">
              *Verifique se os campos CHARACTER, LOOK e DIALOGUE estão corretos antes de gerar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};