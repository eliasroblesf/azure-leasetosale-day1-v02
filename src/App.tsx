import React, { useState } from 'react';
import { 
  User, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  Info, 
  MessageSquare, 
  Lightbulb, 
  Download,
  Building2,
  Users,
  Target,
  Loader2,
  Sparkles,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SCENARIOS, Scenario, Choice } from './data';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// --- TYPES ---
interface Trainee {
  name: string;
  id: string;
  community: string;
  tier: string;
}

interface Metrics {
  rapport: number;
  skill: number;
  momentum: number;
  progress: number;
}

interface Evaluation {
  feedback: string;
  rating: 'MASTER' | 'AVERAGE' | 'POOR';
  coachTip: string;
  metrics: {
    rapport: number;
    skill: number;
    momentum: number;
  };
}

// --- COMPONENTS ---

export default function App() {
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>({
    rapport: 50,
    skill: 50,
    momentum: 50,
    progress: 0
  });
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedCases, setCompletedCases] = useState<string[]>([]);
  const [showScorecard, setShowScorecard] = useState(false);

  const scenario = SCENARIOS[currentStep];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setTrainee({
      name: formData.get('name') as string,
      id: formData.get('id') as string,
      community: formData.get('community') as string,
      tier: formData.get('tier') as string,
    });
  };

  const handleChoice = async (choice: Choice) => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setEvaluation(null); // Clear previous evaluation for animation
    
    // Delay slightly for UX feel - "The Academy is thinking"
    await new Promise(resolve => setTimeout(resolve, 1200));

    const evalData: Evaluation = {
      feedback: choice.feedback,
      rating: choice.rating,
      coachTip: choice.coachTip,
      metrics: {
        rapport: choice.impact >= 8 ? 15 : choice.impact >= 5 ? 5 : -5,
        skill: choice.impact >= 8 ? 20 : choice.impact >= 5 ? 10 : 2,
        momentum: choice.impact >= 8 ? 10 : choice.impact >= 5 ? 5 : -10,
      }
    };

    setEvaluation(evalData);
    
    // Update Metrics
    setMetrics(prev => ({
      rapport: Math.min(100, Math.max(0, prev.rapport + evalData.metrics.rapport)),
      skill: Math.min(100, Math.max(0, prev.skill + evalData.metrics.skill)),
      momentum: Math.min(100, Math.max(0, prev.momentum + evalData.metrics.momentum)),
      progress: ((completedCases.length + 1) / SCENARIOS.length) * 100
    }));

    setIsEvaluating(false);
  };

  const nextScenario = () => {
    if (!completedCases.includes(scenario.id)) {
      setCompletedCases([...completedCases, scenario.id]);
    }
    
    if (currentStep < SCENARIOS.length - 1) {
      setCurrentStep(currentStep + 1);
      setEvaluation(null);
    } else {
      setShowScorecard(true);
    }
  };

  if (!trainee) {
    return <Onboarding onStart={handleStart} />;
  }

  if (showScorecard) {
    return <Scorecard trainee={trainee} metrics={metrics} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-6 lg:p-8 selection:bg-[#c5a059]/20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* EXECUTIVE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#c5a059] to-[#87672b] rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md border border-[#c5a059]/20">
              AZ
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                AZURE <span className="text-[#c5a059]">SAUDI</span> | أزور السعودية
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Mohammad Al Habib Real Estate Co. • Sales Academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              <div className="text-xs">
                <span className="text-slate-500">Specialist:</span> <span className="font-bold">{trainee.name}</span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-[#c5a059] font-mono font-bold">{trainee.id}</span>
              </div>
            </div>
          </div>
        </header>

        {/* HUD STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Customer Rapport" value={metrics.rapport} color="#1e6091" icon={<Users className="w-4 h-4" />} />
          <StatBox label="Sales Mastery" value={metrics.skill} color="#c5a059" icon={<Target className="w-4 h-4" />} />
          <StatBox label="Deal Momentum" value={metrics.momentum} color="#8b5cf6" icon={<TrendingUp className="w-4 h-4" />} />
          <StatBox label="Academy Progress" value={metrics.progress} color="#10b981" icon={<Award className="w-4 h-4" />} />
        </div>

        {/* SCENARIO STEPPER */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SCENARIOS.map((s, idx) => (
            <div 
              key={s.id}
              className={`flex-1 min-w-[140px] p-3 rounded-xl border flex items-center gap-3 transition-all ${
                idx === currentStep ? 'bg-white border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/10' : 
                completedCases.includes(s.id) ? 'bg-white border-emerald-500/20 text-slate-500' : 
                'bg-slate-100/50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                idx === currentStep ? 'bg-[#c5a059] text-white' : 
                completedCases.includes(s.id) ? 'bg-emerald-500 text-white' : 
                'bg-slate-200 border border-slate-300 text-slate-500'
              }`}>
                {idx + 1}
              </div>
              <span className="text-[11px] font-bold truncate">{s.title}</span>
            </div>
          ))}
        </div>

        {/* MAIN STAGE */}
        <main className="grid lg:grid-cols-[380px_1fr] gap-6">
          
          {/* DOSSIER PANEL */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-24 bg-gradient-to-r from-slate-50 to-slate-100 relative border-b border-slate-100">
                 <div className="absolute inset-0 bg-[#c5a059]/5 flex items-center justify-center opacity-10">
                    <Building2 className="w-24 h-24 text-[#c5a059]" />
                 </div>
              </div>
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative">
                   <div className="w-full h-full bg-slate-50 flex items-center justify-center border-2 border-[#c5a059]/20 rounded-full">
                    <User className="w-12 h-12 text-[#c5a059]" />
                   </div>
                   {isEvaluating && (
                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                     </div>
                   )}
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{scenario.customerName}</h3>
                <p className="text-xs text-[#1e6091] font-bold uppercase tracking-wider">{scenario.customerTitle}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">{scenario.company}</p>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
                    <p className="text-[10px] text-[#c5a059] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                       <Info className="w-3 h-3" /> Profile Context
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{scenario.context}"</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-left">
                    <p className="text-[10px] text-[#1e6091] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                       <Lightbulb className="w-3 h-3" /> Mentor Whisper
                    </p>
                    <p className="text-xs text-[#1e6091] leading-relaxed font-semibold italic">{scenario.mentorTip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEGOTIATION ARENA */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
                  <MessageSquare className="w-48 h-48 text-slate-900" />
               </div>
               
               <div className="relative z-10 w-full">
                 <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em]">Customer Interaction</span>
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">Objection Phase</span>
                 </div>
                 
                 <motion.div 
                   key={scenario.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="pl-6 border-l-4 border-[#c5a059] mb-10"
                 >
                    <p className="text-2xl font-serif italic text-slate-900 leading-snug font-medium">
                      "{scenario.objection}"
                    </p>
                 </motion.div>

                 <div className="relative">
                   <AnimatePresence mode="wait">
                     {isEvaluating ? (
                        <motion.div 
                          key="evaluating"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                          <Loader2 className="w-12 h-12 text-[#c5a059] animate-spin" />
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Analyzing Academy Response...</p>
                        </motion.div>
                     ) : !evaluation ? (
                       <motion.div 
                         key="choices"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -20 }}
                         className="grid gap-3"
                       >
                          <div className="flex items-center gap-3 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                             < ChevronRight className="w-4 h-4 text-[#c5a059]" /> Select Professional Response
                          </div>
                          {scenario.choices.map((choice) => (
                            <motion.button
                              key={choice.id}
                              whileTap={{ scale: 0.98 }}
                              disabled={isEvaluating}
                              onClick={() => handleChoice(choice)}
                              className="w-full p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#c5a059] hover:shadow-md transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-white group-hover:border-[#c5a059] transition-all shadow-sm">
                                  {choice.id.slice(-1).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed group-hover:text-slate-900">{choice.text}</p>
                                  <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest opacity-60 invisible group-hover:visible">Confirm Professional Choice</p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                       </motion.div>
                     ) : (
                       <motion.div 
                         key="evaluation"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 shadow-inner"
                       >
                          <div className="flex justify-between items-center pb-5 border-b border-slate-200">
                             <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${
                               evaluation.rating === 'MASTER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                               evaluation.rating === 'AVERAGE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                               'bg-rose-50 text-rose-700 border-rose-200'
                             }`}>
                               {evaluation.rating === 'MASTER' && <Sparkles className="w-3 h-3" />}
                               Coach Verdict: {evaluation.rating}
                             </div>
                             <div className="flex gap-5 text-[11px] font-black uppercase tracking-widest">
                                <span className="text-emerald-600 flex items-center gap-1.5">+{evaluation.metrics.rapport} Rapport</span>
                                <span className="text-blue-600 flex items-center gap-1.5">+{evaluation.metrics.skill} Skill</span>
                             </div>
                          </div>

                          <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                            {evaluation.feedback}
                          </p>

                          <div className="p-5 bg-[#c5a059]/5 border-l-4 border-[#c5a059] rounded-r-xl">
                             <h4 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                               <Target className="w-3 h-3" /> Strategic Insight
                             </h4>
                             <p className="text-xs text-slate-700 leading-relaxed font-semibold">{evaluation.coachTip}</p>
                          </div>

                          <button 
                            onClick={nextScenario}
                            className="w-full py-5 bg-gradient-to-r from-[#c5a059] to-[#87672b] text-white font-black text-xs uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-[#c5a059]/20 hover:scale-[1.02] transition-all active:scale-100"
                          >
                            {currentStep < SCENARIOS.length - 1 ? 'Advance to Next Challenge' : 'Finalize Academy Graduation'}
                          </button>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function StatBox({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
        <div className="text-slate-400 group-hover:text-slate-600 transition-colors">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black tabular-nums text-slate-900">{Math.round(value)}</span>
        <span className="text-[10px] text-slate-400 font-bold">%</span>
        <AnimatePresence>
          {value > 50 && (
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] text-emerald-500 font-bold"
            >
              +
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function Onboarding({ onStart }: { onStart: (e: React.FormEvent) => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-14 shadow-2xl"
      >
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#c5a059]/5 border border-[#c5a059]/20 rounded-full text-[10px] font-black text-[#c5a059] uppercase tracking-[0.2em]">
            Azure Saudi · Mohammad Al Habib Real Estate
          </div>
          <div className="space-y-3">
            <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">Lease to Close Excellence</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed font-medium">
              Welcome to the Executive Sales & Leasing Academy. Master the art of root cause discovery, margin defense, and high-yield negotiation.
            </p>
          </div>

          <form onSubmit={onStart} className="text-left mt-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialist Name</label>
                <input required name="name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#c5a059] focus:bg-white focus:ring-4 focus:ring-[#c5a059]/10 transition-all" placeholder="Enter Full Name" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee ID</label>
                <input required name="id" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#c5a059] focus:bg-white focus:ring-4 focus:ring-[#c5a059]/10 transition-all" placeholder="AZ-####" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Community</label>
                <div className="relative">
                  <select name="community" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#c5a059] focus:bg-white focus:ring-4 focus:ring-[#c5a059]/10 transition-all appearance-none cursor-pointer">
                    <option>Azure Al Munsyah</option>
                    <option>Azure Al Qirawan</option>
                    <option>Palma Compound</option>
                    <option>Al Narjis Residences</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seniority Tier</label>
                <div className="relative">
                  <select name="tier" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#c5a059] focus:bg-white focus:ring-4 focus:ring-[#c5a059]/10 transition-all appearance-none cursor-pointer">
                    <option>Senior Leasing Specialist</option>
                    <option>Key Accounts Manager</option>
                    <option>Associate Consultant</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-gradient-to-r from-[#c5a059] to-[#87672b] text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl shadow-[#c5a059]/30 hover:-translate-y-1 hover:shadow-2xl transition-all active:translate-y-0">
              Launch Academy Simulation
            </button>
          </form>
          
          <div className="pt-6 flex items-center justify-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Award className="w-4 h-4 text-[#c5a059]" /> Certification Track Active
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Scorecard({ trainee, metrics }: { trainee: Trainee; metrics: Metrics }) {
  const overallScore = Math.round((metrics.rapport + metrics.skill + metrics.momentum) / 3);
  const scorecardRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  const handleDownloadPDF = async () => {
    if (!scorecardRef.current) return;
    setIsDownloading(true);
    setDownloadError(false);

    try {
      // Use toPng from html-to-image for better reliability
      const dataUrl = await toPng(scorecardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Sharpness
        backgroundColor: '#FFFFFF',
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Azure-Saudi-Accreditation-${trainee.id}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setDownloadError(true);
      // Brief delay before showing fallback print
      setTimeout(() => {
        window.print();
      }, 1000);
    } finally {
      setIsDownloading(true); // Keep the button in generating state for a moment
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Wrapper to ensure clean capture boundaries */}
      <div ref={scorecardRef} className="bg-white p-2 md:p-8 rounded-[3.5rem]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white text-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border border-slate-200"
        >
          <div className="absolute top-0 left-0 w-full h-3 bg-[#c5a059]" />
          
          {/* Certificate Content */}
          <div className="p-10 md:p-20 text-center space-y-10">
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-[#c5a059] uppercase tracking-[0.5em]">Azure Saudi · Sales & Leasing Academy</h4>
              <h2 className="text-5xl font-serif font-black tracking-tight text-slate-900">Accreditation of Excellence</h2>
              <p className="text-slate-500 text-[11px] uppercase tracking-widest font-black opacity-60">Certified Performance Analysis · Day 1 Cohort</p>
            </div>

            <div className="py-10 border-y border-slate-100 flex flex-col items-center">
               <p className="text-[10px] text-[#c5a059] font-black uppercase tracking-[0.3em] mb-3">Awarded To</p>
               <h3 className="text-4xl font-black text-slate-900 tracking-tight">{trainee.name}</h3>
               <div className="flex items-center gap-4 mt-3">
                 <span className="text-slate-500 font-bold text-sm">{trainee.tier}</span>
                 <span className="text-slate-300">·</span>
                 <span className="text-slate-500 font-bold text-sm">{trainee.community}</span>
               </div>
               <p className="text-slate-400 font-mono text-[11px] mt-4 font-bold">SERIAL NO: {trainee.id}-SIM-2024</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <ScoreBox label="Rapport" value={metrics.rapport} />
               <ScoreBox label="Discovery" value={metrics.skill} />
               <ScoreBox label="Momentum" value={metrics.momentum} />
               <ScoreBox label="Academy GPA" value={overallScore} highlight />
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-16 pt-10">
               <div className="space-y-2">
                  <div className="w-48 h-0.5 bg-slate-100 mx-auto" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">VP, Sales & Leasing</p>
               </div>
               <div className="space-y-2">
                  <div className="w-48 h-0.5 bg-slate-100 mx-auto" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Academy Director</p>
               </div>
            </div>

            <div className="pt-10 no-print flex flex-col items-center gap-4">
               <button 
                 onClick={handleDownloadPDF}
                 disabled={isDownloading}
                 className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isDownloading ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                   <FileDown className="w-4 h-4" />
                 )}
                 {isDownloading ? 'Finalizing File...' : 'Download Performance Report'}
               </button>
               {downloadError && (
                 <p className="text-[10px] text-rose-500 font-bold uppercase animate-pulse">Generation issue detected. Opening print dialog instead...</p>
               )}
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Officially Certified by Mohammad Al Habib Real Estate Co.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .bg-slate-50 { background: white !important; }
          .rounded-[3rem] { border-radius: 0 !important; }
          .shadow-2xl { shadow: none !important; }
          .border { border-color: #eee !important; }
        }
      `}} />
    </div>
  );
}

function ScoreBox({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-3xl border transition-all ${highlight ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline justify-center gap-1">
         <span className={`text-3xl font-black ${highlight ? 'text-[#c5a059]' : 'text-slate-900'}`}>{Math.round(value)}</span>
         <span className="text-[11px] text-slate-400 font-black">%</span>
      </div>
    </div>
  );
}
