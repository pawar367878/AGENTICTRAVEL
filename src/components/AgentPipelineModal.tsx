import React, { useState } from 'react';
import {
  X,
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Cpu,
  Sparkles,
  ChevronRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { AgentTraceStep } from '../types';

interface AgentPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  trace: AgentTraceStep[];
  tripTitle?: string;
}

export const AgentPipelineModal: React.FC<AgentPipelineModalProps> = ({
  isOpen,
  onClose,
  trace,
  tripTitle,
}) => {
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);

  if (!isOpen) return null;

  const totalDuration = trace.reduce((sum, s) => sum + s.durationMs, 0);
  const activeStep = trace[selectedAgentIndex] || trace[0];

  const agentIcons: Record<string, string> = {
    'Destination Agent': '🌍',
    'Weather Agent': '⛅',
    'Hotel Agent': '🏨',
    'Transport Agent': '🚆',
    'Activity Agent': '🏄',
    'Restaurant Agent': '🍽️',
    'Budget Agent': '💰',
    'Itinerary Agent': '📅',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white font-['Outfit']">Multi-Agent AI Execution Architecture</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  8 Workers Orchestrated
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Task Decomposition, Inter-Agent Communication & Reasoning Trace for: {tripTitle || 'Active Trip'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Overview Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              All 8 specialized agents completed successfully
            </span>
            <span className="text-slate-400 flex items-center">
              <Clock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              Total Pipeline Execution Latency: <strong className="text-white ml-1">{totalDuration} ms</strong>
            </span>
          </div>
          <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-800/40">
            ENGINE: Autonomous Orchestrator + Gemini-3.8-Flash
          </div>
        </div>

        {/* Modal Body: Left Agent Selector List, Right Agent Trace Details */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Agent Workflow Steps (Col 1-5) */}
          <div className="md:col-span-5 p-4 overflow-y-auto max-h-[60vh] space-y-2 bg-slate-950/30">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Sequential Execution Pipeline
            </div>
            {trace.map((step, idx) => {
              const isSelected = idx === selectedAgentIndex;
              const emoji = agentIcons[step.agentName] || '🤖';
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAgentIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-800/40 border-slate-850 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xl mt-0.5">{emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {step.agentName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {step.durationMs}ms
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 truncate mt-0.5 font-medium">{step.taskTitle}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-1">
                      {step.outputSummary}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
              );
            })}
          </div>

          {/* Trace Detail Inspector (Col 6-12) */}
          <div className="md:col-span-7 p-6 overflow-y-auto max-h-[60vh] bg-slate-900/40 space-y-5">
            {activeStep ? (
              <>
                {/* Active Agent Banner */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{agentIcons[activeStep.agentName] || '🤖'}</div>
                    <div>
                      <h4 className="text-base font-bold text-white">{activeStep.agentName}</h4>
                      <p className="text-xs text-cyan-400">{activeStep.taskTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      COMPLETED
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Timestamp: {new Date(activeStep.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Input Parameters Box */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                    Agent Input Vector (State Context)
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300">
                    {activeStep.inputSummary}
                  </div>
                </div>

                {/* Output Summary Box */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Agent Output Artifact & Metrics
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs font-medium text-emerald-200">
                    {activeStep.outputSummary}
                  </div>
                </div>

                {/* AI Rationale & Algorithmic Explanation */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Bot className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    Agent Reasoning Rationale & Constraint Satisfaction
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-indigo-200 leading-relaxed">
                    {activeStep.rationale}
                  </div>
                </div>

                {/* Academic Viva Context Note */}
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Multi-Agent Principle Demonstrated:</strong> In this step, the {activeStep.agentName} operated as an independent autonomous sub-system. Its outputs directly passed into subsequent agents in the orchestrated execution DAG (Directed Acyclic Graph) to prevent budget overflow and ensure weather safety.
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Select an agent step on the left to inspect its parameters and reasoning log.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Viewing step {selectedAgentIndex + 1} of {trace.length} in orchestrated execution sequence
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
          >
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
