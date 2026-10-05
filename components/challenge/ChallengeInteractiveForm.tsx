'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Target,
} from 'lucide-react';
import { submitDailyChallengeAction } from '@/app/actions/challenge';
import { ButtonLoader } from '@/components/ui/Loading';

interface ChallengeInteractiveFormProps {
  dayNumber: number;
  theme: string;
}

export default function ChallengeInteractiveForm({
  dayNumber,
  theme,
}: ChallengeInteractiveFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'final'>('morning');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsData, setCongratsData] = useState<{ points: number; day: number } | null>(null);

  // Morning Plan States
  const [priority1, setPriority1] = useState('');
  const [evenIf, setEvenIf] = useState('');
  const [uncomfortableAction, setUncomfortableAction] = useState('');
  const [moveBodyPlan, setMoveBodyPlan] = useState('');
  const [learnPlan, setLearnPlan] = useState('');
  const [impactPlan, setImpactPlan] = useState('');

  // Evening Review States
  const [movedBody, setMovedBody] = useState(false);
  const [learnedText, setLearnedText] = useState('');
  const [createdValue, setCreatedValue] = useState(false);
  const [tookAction, setTookAction] = useState(false);
  const [keptWord, setKeptWord] = useState(false);
  const [bestThing, setBestThing] = useState('');
  const [opportunityNoticed, setOpportunityNoticed] = useState('');
  const [procrastinatedText, setProcrastinatedText] = useState('');
  const [betterTomorrow, setBetterTomorrow] = useState('');
  const [gratitudeText, setGratitudeText] = useState('');
  const [firstActionTomorrow, setFirstActionTomorrow] = useState('');
  const [dailyScore, setDailyScore] = useState(8);

  // Day 30 Final Review States
  const [physicalChanges, setPhysicalChanges] = useState('');
  const [mentalChanges, setMentalChanges] = useState('');
  const [professionalChanges, setProfessionalChanges] = useState('');
  const [relationshipChanges, setRelationshipChanges] = useState('');
  const [confidenceChanges, setConfidenceChanges] = useState('');
  const [whatToStop, setWhatToStop] = useState('');
  const [whatToContinue, setWhatToContinue] = useState('');
  const [whatToStart, setWhatToStart] = useState('');
  const [next30DayCommitment, setNext30DayCommitment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!priority1.trim()) {
      setError('Please fill in your #1 priority in the Morning Plan section.');
      setActiveTab('morning');
      return;
    }

    if (!bestThing.trim() && !gratitudeText.trim()) {
      setError('Please complete at least one reflection field in the Evening Review section.');
      setActiveTab('evening');
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        morning: {
          priority_1: priority1.trim(),
          even_if: evenIf.trim(),
          uncomfortable_action: uncomfortableAction.trim(),
          move_body_plan: moveBodyPlan.trim(),
          learn_plan: learnPlan.trim(),
          impact_plan: impactPlan.trim(),
        },
        evening: {
          moved_body: movedBody,
          learned_text: learnedText.trim(),
          created_value: createdValue,
          took_action: tookAction,
          kept_word: keptWord,
          best_thing: bestThing.trim(),
          opportunity_noticed: opportunityNoticed.trim(),
          procrastinated_text: procrastinatedText.trim(),
          better_tomorrow: betterTomorrow.trim(),
          gratitude_text: gratitudeText.trim(),
          first_action_tomorrow: firstActionTomorrow.trim(),
          daily_score: Number(dailyScore),
        },
      };

      if (dayNumber === 30) {
        payload.finalReview = {
          physical_changes: physicalChanges.trim(),
          mental_changes: mentalChanges.trim(),
          professional_changes: professionalChanges.trim(),
          relationship_changes: relationshipChanges.trim(),
          confidence_changes: confidenceChanges.trim(),
          what_to_stop: whatToStop.trim(),
          what_to_continue: whatToContinue.trim(),
          what_to_start: whatToStart.trim(),
          next_30_day_commitment: next30DayCommitment.trim(),
        };
      }

      const res = await submitDailyChallengeAction(payload);

      if (!res.success) {
        setError(res.error || res.message || 'Failed to submit challenge.');
        setSubmitting(false);
        return;
      }

      setCongratsData({ points: res.pointsEarned || 0, day: dayNumber });
      setShowCongratsModal(true);
      setSubmitting(false);
    } catch (err: any) {
      setError(err?.message || 'An unexpected submission error occurred.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('morning')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'morning'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>1. Morning Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evening')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'evening'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>2. Evening Review</span>
          </button>

          {dayNumber === 30 && (
            <button
              type="button"
              onClick={() => setActiveTab('final')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'final'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>3. Day 30 Synthesis</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-zinc-500 font-mono">
          Max Server Score: <span className="text-orange-400 font-bold">100 PTS</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* MORNING PLAN TAB */}
        {activeTab === 'morning' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Sun className="w-4 h-4 text-orange-400" />
              <span>Morning Activation Commitments</span>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                1. My #1 Priority Today <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={priority1}
                onChange={(e) => setPriority1(e.target.value)}
                placeholder="e.g. Complete the strategic design proposal before noon"
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                2. One thing I will do even if I don&apos;t feel like it
              </label>
              <input
                type="text"
                value={evenIf}
                onChange={(e) => setEvenIf(e.target.value)}
                placeholder="e.g. Run 3 miles regardless of weather or fatigue"
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                3. One uncomfortable action I will take (+20 PTS)
              </label>
              <input
                type="text"
                value={uncomfortableAction}
                onChange={(e) => setUncomfortableAction(e.target.value)}
                placeholder="e.g. Initiate the overdue performance feedback conversation"
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  4. How I will move my body today (+20 PTS)
                </label>
                <input
                  type="text"
                  value={moveBodyPlan}
                  onChange={(e) => setMoveBodyPlan(e.target.value)}
                  placeholder="e.g. 45-min strength training session"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  5. What I will learn or reflect on today (+20 PTS)
                </label>
                <input
                  type="text"
                  value={learnPlan}
                  onChange={(e) => setLearnPlan(e.target.value)}
                  placeholder="e.g. Read Chapter 4 of High Performance Habits"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                6. How I will create a positive impact today (+20 PTS)
              </label>
              <input
                type="text"
                value={impactPlan}
                onChange={(e) => setImpactPlan(e.target.value)}
                placeholder="e.g. Help a teammate solve their blocker and give genuine praise"
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('evening')}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue To Evening Review</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>
          </div>
        )}

        {/* EVENING REVIEW TAB */}
        {activeTab === 'evening' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
              <Moon className="w-4 h-4 text-orange-400" />
              <span>Evening Accountability &amp; Daily Review</span>
            </div>

            {/* Checkboxes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-[#181820] border border-zinc-800 rounded-xl">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={movedBody}
                  onChange={(e) => setMovedBody(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <span>Moved Body</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={tookAction}
                  onChange={(e) => setTookAction(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <span>Took Action</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={createdValue}
                  onChange={(e) => setCreatedValue(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <span>Created Value</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={keptWord}
                  onChange={(e) => setKeptWord(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <span>Kept My Word</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-zinc-300 font-medium select-none">
                <input
                  type="checkbox"
                  checked={Boolean(learnedText.trim())}
                  onChange={(e) => {
                    if (!e.target.checked) setLearnedText('');
                  }}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                />
                <span>Learned Something</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                What did I learn or reflect on today?
              </label>
              <textarea
                rows={2}
                value={learnedText}
                onChange={(e) => setLearnedText(e.target.value)}
                placeholder="Key insight or core lesson learned today..."
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Best thing I did today
                </label>
                <input
                  type="text"
                  value={bestThing}
                  onChange={(e) => setBestThing(e.target.value)}
                  placeholder="My highest impact accomplishment today"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Opportunity I noticed
                </label>
                <input
                  type="text"
                  value={opportunityNoticed}
                  onChange={(e) => setOpportunityNoticed(e.target.value)}
                  placeholder="Door or advantage that became clear today"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  What I avoided or procrastinated
                </label>
                <input
                  type="text"
                  value={procrastinatedText}
                  onChange={(e) => setProcrastinatedText(e.target.value)}
                  placeholder="Where I allowed friction or hesitation to win"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  What I could do better tomorrow
                </label>
                <input
                  type="text"
                  value={betterTomorrow}
                  onChange={(e) => setBetterTomorrow(e.target.value)}
                  placeholder="Adjustment for sharper execution"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  What am I grateful for today?
                </label>
                <input
                  type="text"
                  value={gratitudeText}
                  onChange={(e) => setGratitudeText(e.target.value)}
                  placeholder="Deep appreciation or win"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Tomorrow&apos;s first action
                </label>
                <input
                  type="text"
                  value={firstActionTomorrow}
                  onChange={(e) => setFirstActionTomorrow(e.target.value)}
                  placeholder="First thing I execute after waking up"
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Daily Score Slider / Input */}
            <div className="p-4 bg-[#181820] border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Daily Execution Score (1 – 10)
                </label>
                <span className="font-mono font-extrabold text-orange-400 text-lg">
                  {dailyScore} / 10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={dailyScore}
                onChange={(e) => setDailyScore(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* DAY 30 SYNTHESIS TAB */}
        {dayNumber === 30 && activeTab === 'final' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Day 30 Final Activation Review &amp; Synthesis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Physical Changes &amp; Reflections
                </label>
                <textarea
                  rows={2}
                  value={physicalChanges}
                  onChange={(e) => setPhysicalChanges(e.target.value)}
                  placeholder="Health, strength, energy transformations..."
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Mental &amp; Mindset Transformations
                </label>
                <textarea
                  rows={2}
                  value={mentalChanges}
                  onChange={(e) => setMentalChanges(e.target.value)}
                  placeholder="Focus, discipline, inner dialogue shifts..."
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Professional / Financial Growth
                </label>
                <textarea
                  rows={2}
                  value={professionalChanges}
                  onChange={(e) => setProfessionalChanges(e.target.value)}
                  placeholder="Output, career strides, value creation..."
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confidence &amp; Self-Respect
                </label>
                <textarea
                  rows={2}
                  value={confidenceChanges}
                  onChange={(e) => setConfidenceChanges(e.target.value)}
                  placeholder="Self-trust and standards built..."
                  className="w-full bg-[#18181f] border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                My Next 30-Day Commitment
              </label>
              <input
                type="text"
                value={next30DayCommitment}
                onChange={(e) => setNext30DayCommitment(e.target.value)}
                placeholder="What lifestyle standard will I carry forward..."
                className="w-full bg-[#18181f] border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[11px] text-zinc-500">
            Official Submission &bull; Server Validated Scoring
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <ButtonLoader />
                <span>Validating &amp; Scoring...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Official Day {dayNumber} Review</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* CONGRATULATIONS MODAL */}
      {showCongratsModal && congratsData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#181820] border border-orange-500/50 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-orange-500/20">
            <div className="mx-auto w-20 h-20 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
                Congratulations!
              </h2>
              <p className="text-zinc-400 mt-2">
                You successfully completed Day {congratsData.day}.
              </p>
              <p className="text-lg font-bold text-orange-400 mt-4 font-mono">
                +{congratsData.points} PTS Earned
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowCongratsModal(false);
                router.refresh();
                window.location.reload();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
