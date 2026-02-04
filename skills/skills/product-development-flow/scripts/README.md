# Product Development Flow Scripts Overview

This directory contains six orchestrated modules that together implement the 12+1 stage product development workflow.

## Modules

- delivery-artifacts-manager: Manage stage deliverables, versioning, metadata, validation.
- feedback-collector: Collect and classify feedback across stages.
- flow-coordinator: Initialize stages, manage transitions, enforce quality gates.
- progress-tracker: Track progress, milestones, risk detection, reporting.
- quality-metrics-collector: Record/evaluate metrics, thresholds, alerts, reports.
- review-orchestrator: Self-review, cross-review, decision recording, auto-transition.

## Quick Start

- Each module exposes a main class; instantiate and call methods within your Node.js runtime.
- Modules are self-contained and do not require external @codebuddy deps.

Example:

```ts
import { ProgressTracker } from "./progress-tracker";

const tracker = new ProgressTracker();
tracker.recordProgress("frontend-development", 50);
console.log(tracker.generateReport());
```

## Notes

- TypeScript strict mode compatible; compile with project tsconfig.
- Logging is built-in via simple Logger.
- All modules support async operations where applicable.
