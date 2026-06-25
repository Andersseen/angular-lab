import { Component, computed, signal } from '@angular/core';
import {
  VoltBadge,
  VoltButton,
  VoltCard,
  VoltCardContent,
  VoltCardFooter,
  VoltCardHeader,
  VoltCardTitle,
  VoltProgress,
  VoltSeparator,
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import { MOVEMENT_DIRECTIVES } from 'angular-movement';
import { VertexEditor } from '../components/editor/vertex-editor';

interface Step {
  id: string;
  title: string;
  content: string;
}

const DEMO_STEPS: Step[] = [
  {
    id: 'concept',
    title: 'Concept',
    content:
      'Signals are the core reactive primitive in modern Angular. A signal holds a value and notifies consumers when that value changes.',
  },
  {
    id: 'example',
    title: 'Example',
    content:
      'The editor below contains a tiny component. Read the code, then try changing the initial count.',
  },
  {
    id: 'practice',
    title: 'Practice',
    content:
      'Add a second signal called `doubleCount` that is computed from `count`. Update the template to display it.',
  },
];

const STARTER_CODE = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-greeter',
  template: \`
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">Increment</button>
  \`,
})
export class Greeter {
  readonly count = signal(0);

  increment(): void {
    this.count.update((value) => value + 1);
  }
}`;

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [
    VertexEditor,
    VoltBadge,
    VoltButton,
    VoltCard,
    VoltCardContent,
    VoltCardFooter,
    VoltCardHeader,
    VoltCardTitle,
    VoltProgress,
    VoltSeparator,
    VoltTabs,
    VoltTabsContent,
    VoltTabsList,
    VoltTabsTrigger,
    ...MOVEMENT_DIRECTIVES,
  ],
  template: `
    <div class="mx-auto w-full max-w-7xl px-6 py-8">
      <header [move]="'fade-down'" class="mb-8 flex flex-col gap-5">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-3xl font-bold text-slate-950 dark:text-white">
                Reactive Signals
              </h1>
              <volt-badge variant="secondary">Beginner</volt-badge>
            </div>
            <p class="max-w-2xl text-slate-600 dark:text-slate-300">
              Learn how to create and update signals in Angular.
            </p>
          </div>
          <div class="min-w-56">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="font-medium">Mission progress</span>
              <span class="text-slate-500 dark:text-slate-400">
                {{ progress() }}%
              </span>
            </div>
            <volt-progress [value]="progress()" />
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <nav
          [move]="'fade-right'"
          [moveStagger]="70"
          class="flex flex-col gap-2 lg:col-span-1"
          aria-label="Mission steps"
        >
          @for (step of steps(); track step.id; let i = $index) {
            <button
              type="button"
              class="rounded-lg border px-4 py-3 text-left transition-colors"
              [move]="'fade-up'"
              [class.border-blue-500]="activeStep() === step.id"
              [class.bg-blue-50]="activeStep() === step.id"
              [class.dark:bg-blue-950]="activeStep() === step.id"
              [class.border-slate-200]="activeStep() !== step.id"
              [class.dark:border-slate-800]="activeStep() !== step.id"
              (click)="activeStep.set(step.id)"
              moveWhileHover="slide-right"
            >
              <span class="block text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                Step {{ i + 1 }}
              </span>
              <span class="font-semibold">{{ step.title }}</span>
            </button>
          }
        </nav>

        <section [move]="'fade-up'" class="flex flex-col gap-6 lg:col-span-2">
          <volt-card>
            <volt-card-header>
              <volt-card-title>{{ currentStep().title }}</volt-card-title>
            </volt-card-header>
            <volt-card-content>
              <p class="text-base leading-7 text-slate-700 dark:text-slate-200">
                {{ currentStep().content }}
              </p>
            </volt-card-content>
            <volt-card-footer>
              <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span>{{ currentStepNumber() }} of {{ steps().length }}</span>
                <volt-separator orientation="vertical" class="h-4" />
                <span>{{ currentStep().id }}</span>
              </div>
            </volt-card-footer>
          </volt-card>

          <volt-tabs value="editor">
            <volt-tabs-list class="grid w-full grid-cols-2">
              <volt-tabs-trigger value="editor">Editor</volt-tabs-trigger>
              <volt-tabs-trigger value="preview">Preview</volt-tabs-trigger>
            </volt-tabs-list>

            <volt-tabs-content value="editor">
              <div
                class="h-96 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
              >
                <app-vertex-editor
                  language="typescript"
                  theme="dark"
                  [(value)]="code"
                />
              </div>
            </volt-tabs-content>

            <volt-tabs-content value="preview">
              <div
                class="flex h-96 items-center justify-center rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div class="w-full max-w-md rounded-lg border border-slate-200 p-5 shadow-sm dark:border-slate-800">
                  <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Preview stub
                  </p>
                  <p class="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                    Count: 0
                  </p>
                  <div class="mt-4">
                    <volt-button size="sm" disabled>Increment</volt-button>
                  </div>
                  <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Preview will render here once the playground engine is wired
                    up.
                  </p>
                </div>
              </div>
            </volt-tabs-content>
          </volt-tabs>

          <div class="flex justify-between">
            <volt-button
              variant="outline"
              [disabled]="!hasPrevious()"
              (click)="previous()"
            >
              Previous
            </volt-button>
            <volt-button [disabled]="!hasNext()" (click)="next()">
              Next
            </volt-button>
          </div>
        </section>
      </div>
    </div>
  `,
})
export default class Mission {
  readonly steps = signal<Step[]>(DEMO_STEPS);
  readonly activeStep = signal<string>('concept');
  readonly code = signal<string>(STARTER_CODE);

  readonly currentStep = computed(() => {
    const step = this.steps().find((s) => s.id === this.activeStep());
    return step ?? this.steps()[0];
  });

  readonly stepIndex = computed(() =>
    this.steps().findIndex((s) => s.id === this.activeStep())
  );

  readonly hasPrevious = computed(() => this.stepIndex() > 0);
  readonly hasNext = computed(
    () => this.stepIndex() >= 0 && this.stepIndex() < this.steps().length - 1
  );
  readonly currentStepNumber = computed(() => this.stepIndex() + 1);
  readonly progress = computed(() =>
    Math.round((this.currentStepNumber() / this.steps().length) * 100)
  );

  previous(): void {
    const index = this.stepIndex();
    if (index > 0) {
      this.activeStep.set(this.steps()[index - 1].id);
    }
  }

  next(): void {
    const index = this.stepIndex();
    if (index >= 0 && index < this.steps().length - 1) {
      this.activeStep.set(this.steps()[index + 1].id);
    }
  }
}
