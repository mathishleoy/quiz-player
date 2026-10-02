import React, { useState } from 'react';
import { X, Copy, Check, FileText, Sparkles, AlertCircle, BookOpen, Download } from 'lucide-react';
import { PROMPT_1_NOTES, PROMPT_2_TOPIC } from '../data/guideContent';
import { BLANK_TEMPLATE_JSON, QUIZ_TEMPLATE_JSON } from '../data/template';

interface AuthoringGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
}

export const AuthoringGuideModal: React.FC<AuthoringGuideModalProps> = ({
  isOpen,
  onClose,
  onDownloadTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'formats' | 'validator'>('prompts');
  const [copiedP1, setCopiedP1] = useState(false);
  const [copiedP2, setCopiedP2] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Quick JSON scratchpad validator
  const [scratchJson, setScratchJson] = useState('');
  const [scratchError, setScratchError] = useState<string | null>(null);
  const [scratchSuccess, setScratchSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'p1' | 'p2' | string) => {
    navigator.clipboard.writeText(text);
    if (type === 'p1') {
      setCopiedP1(true);
      setTimeout(() => setCopiedP1(false), 2000);
    } else if (type === 'p2') {
      setCopiedP2(true);
      setTimeout(() => setCopiedP2(false), 2000);
    } else {
      setCopiedFormat(type);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  const testValidate = () => {
    setScratchError(null);
    setScratchSuccess(null);
    if (!scratchJson.trim()) {
      setScratchError('Please paste your JSON content to validate.');
      return;
    }
    try {
      const parsed = JSON.parse(scratchJson);
      if (!parsed || typeof parsed !== 'object') {
        setScratchError('Root must be an object { "title": "...", "questions": [...] }');
        return;
      }
      if (!Array.isArray(parsed.questions)) {
        setScratchError('Missing "questions" array.');
        return;
      }
      if (parsed.questions.length === 0) {
        setScratchError('"questions" array is empty. Add at least one question.');
        return;
      }
      setScratchSuccess(`Valid Quiz JSON! Found "${parsed.title || 'Untitled'}" with ${parsed.questions.length} question(s).`);
    } catch (err: any) {
      setScratchError(`Syntax Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-sm">
              ?
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quiz Authoring Guide</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step instructions and AI prompts to generate your quiz files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Close guide (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'prompts'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            AI Prompts (ChatGPT / Claude / Gemini)
          </button>
          <button
            onClick={() => setActiveTab('formats')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'formats'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            8 Question Formats & Spec
          </button>
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'validator'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Quick JSON Validator
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              {/* How it works banner */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  How to generate your quiz in 60 seconds:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>Choose <strong>Prompt 1</strong> (if you have course notes/PDF) or <strong>Prompt 2</strong> (topic-only).</li>
                  <li>Click <strong>Copy Prompt</strong> and paste into ChatGPT, Claude, or Gemini.</li>
                  <li>Replace <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[11px]">&#123;&#123;Q_AMOUNT&#125;&#125;</code> with the number of questions.</li>
                  <li>Copy the generated raw JSON, save it as a <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-[11px]">.json</code> file, and upload it!</li>
                </ol>
              </div>

              {/* Prompt 1 */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-black dark:bg-white text-white dark:text-slate-950 rounded">RECOMMENDED</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">PROMPT 1 — Generate From Your Notes or Document</h4>
                  </div>
                  <button
                    onClick={() => handleCopy(PROMPT_1_NOTES, 'p1')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-800 dark:text-slate-100 transition-colors shadow-2xs"
                  >
                    {copiedP1 ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedP1 ? 'Copied!' : 'Copy Prompt 1'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed whitespace-pre">
                  {PROMPT_1_NOTES}
                </div>
              </div>

              {/* Prompt 2 */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded">TOPIC ONLY</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">PROMPT 2 — Generate From a Topic Name</h4>
                  </div>
                  <button
                    onClick={() => handleCopy(PROMPT_2_TOPIC, 'p2')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded text-xs font-medium text-slate-800 dark:text-slate-100 transition-colors shadow-2xs"
                  >
                    {copiedP2 ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedP2 ? 'Copied!' : 'Copy Prompt 2'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-64 leading-relaxed whitespace-pre">
                  {PROMPT_2_TOPIC}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Supported Question Types (All 8 Interaction Types)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Each question format has distinct UI controls and scoring rules.</p>
                </div>
                <button
                  onClick={onDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blank Template</span>
                </button>
              </div>

              {/* Format grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MCQ */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">1. Multiple Choice (MCQ)</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Auto-shuffles choices per session; correct answer stays locked</span>
                    </div>
                    <button
                      onClick={() => handleCopy(`{"type":"mcq","text":"Which planet is red?","options":["Venus","Mars","Jupiter"],"correct":1,"feedback":"Mars is red."}`, 'mcq')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white shrink-0"
                    >
                      {copiedFormat === 'mcq' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "mcq",
  "text": "Question text",
  "options": ["A", "B", "C", "D"],
  "correct": 0, // 0-based index (options are auto-shuffled & locked!)
  "feedback": "Explanation"
}`}
                  </pre>
                </div>

                {/* Multiple Select */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">2. Multiple Select (Checkboxes)</span>
                    <button
                      onClick={() => handleCopy(`{"type":"multiple_select","text":"Select all primes","options":["2","3","4","5"],"correct":[0,1,3],"feedback":"2, 3, 5 are prime."}`, 'ms')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'ms' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "multiple_select",
  "text": "Select all that apply",
  "options": ["A", "B", "C", "D"],
  "correct": [0, 2], // array of indices
  "feedback": "Explanation"
}`}
                  </pre>
                </div>

                {/* Fill in Blank */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">3. Fill in the Blank</span>
                    <button
                      onClick={() => handleCopy(`{"type":"fill_blank","text":"Water is ____.","correct":["H2O"],"caseSensitive":false,"feedback":"Water is H2O."}`, 'fb')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'fb' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "fill_blank",
  "text": "Water formula is ____.",
  "correct": ["H2O"],
  "caseSensitive": false,
  "feedback": "Explanation"
}`}
                  </pre>
                </div>

                {/* Short Answer */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">4. Short Answer</span>
                    <button
                      onClick={() => handleCopy(`{"type":"short_answer","text":"What is CPU?","correct":["Central Processing Unit","CPU"],"caseSensitive":false,"maxLength":50}`, 'sa')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'sa' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "short_answer",
  "text": "What does CPU stand for?",
  "correct": ["Central Processing Unit"],
  "caseSensitive": false,
  "maxLength": 50
}`}
                  </pre>
                </div>

                {/* Matching */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">5. Matching (Pairs & Distractors)</span>
                    <button
                      onClick={() => handleCopy(`{"type":"matching","text":"Match capitals","pairs":[{"prompt":"Japan","answer":"Tokyo"},{"prompt":"France","answer":"Paris"}],"distractors":["London"]}`, 'mat')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'mat' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "matching",
  "text": "Match the following items.",
  "pairs": [
    { "prompt": "Country", "answer": "Capital" }
  ],
  "distractors": ["Wrong Capital"]
}`}
                  </pre>
                </div>

                {/* Ordering */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">6. Ordering (Chronology / Steps)</span>
                    <button
                      onClick={() => handleCopy(`{"type":"ordering","text":"Order steps","items":["First","Second","Third"]}`, 'ord')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'ord' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "ordering",
  "text": "Put steps in order:",
  "items": ["Step 1", "Step 2", "Step 3"]
  // items in correct order, app shuffles!
}`}
                  </pre>
                </div>

                {/* Classification */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">7. Classification (Buckets)</span>
                    <button
                      onClick={() => handleCopy(`{"type":"classification","text":"Classify","categories":["A","B"],"items":[{"text":"Item1","category":"A"}]}`, 'cls')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'cls' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "classification",
  "text": "Classify items into categories",
  "categories": ["Category 1", "Category 2"],
  "items": [
    { "text": "Item A", "category": "Category 1" }
  ]
}`}
                  </pre>
                </div>

                {/* Scenario */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">8. Scenario / Case Study</span>
                    <button
                      onClick={() => handleCopy(`{"type":"scenario","scenario":"Context details...","text":"What to do?","options":["A","B"],"correct":0}`, 'scn')}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white"
                    >
                      {copiedFormat === 'scn' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  </div>
                  <pre className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  "type": "scenario",
  "scenario": "Background case scenario...",
  "text": "What action should you take?",
  "options": ["A", "B", "C"],
  "correct": 0
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validator' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Validate your JSON file before uploading</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Paste your generated JSON below to check for syntax errors or missing required fields.</p>
              </div>

              <textarea
                value={scratchJson}
                onChange={(e) => setScratchJson(e.target.value)}
                placeholder='Paste your {"title": "...", "questions": [...]} here...'
                className="w-full h-56 p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={testValidate}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium text-xs rounded-lg transition-colors"
                >
                  Validate JSON
                </button>
                <button
                  onClick={() => setScratchJson(JSON.stringify(QUIZ_TEMPLATE_JSON, null, 2))}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-lg transition-colors"
                >
                  Load Sample JSON
                </button>
              </div>

              {scratchError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{scratchError}</span>
                </div>
              )}

              {scratchSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{scratchSuccess}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Supported by Quiz Player standard</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-medium rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
