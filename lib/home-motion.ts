export type WorkflowMotionKey = "input" | "build" | "output";

export type WorkflowMotionStep = {
  key: WorkflowMotionKey;
  delayMs: number;
  durationMs: number;
};

export const homeMotion = {
  entrance: {
    duration: 0.48,
    stagger: 0.09,
  },
  panel: {
    duration: 0.58,
    delay: 0.24,
  },
  cardHover: {
    lift: -3,
    duration: 0.2,
  },
  workflow: {
    stepDuration: 0.18,
    stepDelay: 0.08,
  },
} as const;

export function getWorkflowMotionSequence(): WorkflowMotionStep[] {
  return (["input", "build", "output"] as WorkflowMotionKey[]).map(
    (key, index) => ({
      key,
      delayMs: index * homeMotion.workflow.stepDelay * 1000,
      durationMs: homeMotion.workflow.stepDuration * 1000,
    }),
  );
}
