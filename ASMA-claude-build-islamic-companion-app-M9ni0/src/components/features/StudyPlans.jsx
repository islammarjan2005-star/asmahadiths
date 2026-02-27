import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { Card, ScreenHeader } from '../ui';
import { useApp } from '../../context/AppContext';

// Will be loaded from data file
const FALLBACK_PLANS = [];

export function StudyPlans({ onBack }) {
  const { state, dispatch } = useApp();
  const [plans, setPlans] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Load plans data
  useMemo(() => {
    import('../../data/studyPlans').then(mod => {
      if (mod.studyPlans) setPlans(mod.studyPlans);
    }).catch(() => setPlans(FALLBACK_PLANS));
  }, []);

  const allPlans = plans || FALLBACK_PLANS;
  const userPlans = state.studyPlans || {};

  const getProgress = (planId, duration) => {
    const p = userPlans[planId];
    if (!p) return { started: false, completed: 0, total: duration, percent: 0 };
    const completed = (p.completedDays || []).length;
    return {
      started: true,
      completed,
      total: duration,
      percent: Math.round((completed / duration) * 100),
      startDate: p.startDate,
    };
  };

  // Day detail view
  if (selectedPlan && selectedDay !== null) {
    const plan = allPlans.find(p => p.id === selectedPlan);
    if (!plan) return null;
    const day = plan.days?.[selectedDay];
    if (!day) return null;

    const progress = getProgress(plan.id, plan.duration);
    const isCompleted = (userPlans[plan.id]?.completedDays || []).includes(selectedDay + 1);

    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
        <ScreenHeader
          title={day.title}
          subtitle={`Day ${selectedDay + 1} of ${plan.duration}`}
          onBack={() => setSelectedDay(null)}
        />

        <div className="px-5 max-w-lg mx-auto space-y-4">
          {/* Content */}
          <Card padding={false} className="p-5">
            <p className="text-text-secondary dark:text-cream-300 leading-relaxed">
              {day.content}
            </p>
            {day.hadithRef && (
              <p className="text-xs text-text-tertiary mt-3">
                Source: {day.hadithRef}
              </p>
            )}
          </Card>

          {/* Reflection */}
          {day.reflection && (
            <Card padding={false} className="p-5" variant="default">
              <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 uppercase tracking-wider mb-2 font-medium">
                Reflection
              </p>
              <p className="text-text-secondary dark:text-cream-300 text-sm italic leading-relaxed">
                {day.reflection}
              </p>
            </Card>
          )}

          {/* Action */}
          {day.action && (
            <Card padding={false} className="p-5">
              <p className="text-xs text-sanctuary-600 dark:text-sanctuary-400 uppercase tracking-wider mb-2 font-medium">
                Today's Action
              </p>
              <p className="text-text-secondary dark:text-cream-300 text-sm">{day.action}</p>
            </Card>
          )}

          {/* Complete button */}
          <button
            onClick={() => {
              if (!isCompleted) {
                if (!progress.started) {
                  dispatch({ type: 'START_STUDY_PLAN', payload: { planId: plan.id } });
                }
                dispatch({ type: 'COMPLETE_STUDY_DAY', payload: { planId: plan.id, day: selectedDay + 1 } });
                dispatch({ type: 'ADD_XP', payload: { amount: 15 } });
              }
            }}
            className={`w-full py-3.5 rounded-xl font-medium text-sm transition-colors ${
              isCompleted
                ? 'bg-sanctuary-100 dark:bg-sanctuary-900/30 text-sanctuary-600 dark:text-sanctuary-400'
                : 'bg-sanctuary-600 text-white active:bg-sanctuary-700'
            }`}
          >
            {isCompleted ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Completed
              </span>
            ) : (
              'Mark as Complete (+15 XP)'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Plan detail view
  if (selectedPlan) {
    const plan = allPlans.find(p => p.id === selectedPlan);
    if (!plan) return null;

    const progress = getProgress(plan.id, plan.duration);
    const completedDays = new Set(userPlans[plan.id]?.completedDays || []);

    return (
      <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
        <ScreenHeader
          title={plan.title}
          subtitle={plan.arabic}
          onBack={() => setSelectedPlan(null)}
        />

        {/* Progress bar */}
        <div className="px-5 max-w-lg mx-auto mb-4">
          <div className="flex justify-between text-xs text-text-tertiary mb-1">
            <span>{progress.completed} of {progress.total} days</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 bg-cream-200 dark:bg-night-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sanctuary-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        <div className="px-5 max-w-lg mx-auto space-y-2">
          {/* Completion celebration */}
          {progress.percent === 100 && (
            <Card padding={false} className="p-5 text-center bg-sanctuary-50 dark:bg-sanctuary-900/20 mb-4">
              <Trophy className="w-10 h-10 text-sanctuary-500 mx-auto mb-2" />
              <p className="font-semibold text-sanctuary-700 dark:text-sanctuary-400">MashaAllah!</p>
              <p className="text-sm text-text-tertiary">You completed this study plan</p>
            </Card>
          )}

          {/* Day list */}
          {(plan.days || []).map((day, i) => {
            const dayNum = i + 1;
            const done = completedDays.has(dayNum);
            const isNext = !done && (i === 0 || completedDays.has(i));

            return (
              <Card
                key={i}
                className={`${isNext ? 'ring-1 ring-sanctuary-400/30' : ''}`}
                onClick={() => setSelectedDay(i)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    done
                      ? 'bg-sanctuary-500 text-white'
                      : isNext
                      ? 'bg-sanctuary-100 dark:bg-sanctuary-900/20 text-sanctuary-600'
                      : 'bg-cream-200 dark:bg-night-100 text-text-tertiary'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <span className="text-xs font-medium">{dayNum}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      done ? 'text-text-tertiary line-through' : 'text-text-primary dark:text-cream-200'
                    }`}>
                      {day.title}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cream-400 flex-shrink-0" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Plan list view
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-300 pb-24">
      <ScreenHeader title="Study Plans" subtitle="Guided learning journeys" onBack={onBack} />

      <div className="px-4 max-w-lg mx-auto mt-4 space-y-3">
        {allPlans.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-cream-400 mx-auto mb-3" />
            <p className="text-text-tertiary">Study plans loading...</p>
          </div>
        ) : (
          allPlans.map((plan) => {
            const progress = getProgress(plan.id, plan.duration);
            return (
              <Card
                key={plan.id}
                padding={false}
                className="p-5"
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-sanctuary-50 dark:bg-sanctuary-900/20">
                    <BookOpen className="w-6 h-6 text-sanctuary-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary dark:text-cream-200">{plan.title}</h3>
                    <p className="text-xs text-text-tertiary mt-0.5">{plan.description}</p>
                    <p className="text-xs text-text-tertiary mt-1">{plan.duration} days</p>
                    {progress.started && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-cream-200 dark:bg-night-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sanctuary-500 rounded-full transition-all"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-tertiary mt-1">
                          {progress.completed}/{progress.total} days
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-cream-400 flex-shrink-0 mt-1" />
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
