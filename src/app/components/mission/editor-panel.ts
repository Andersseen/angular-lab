import { Component, input, output } from '@angular/core';
import {
  VoltButton,
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import { VertexEditor } from '../editor/vertex-editor';

@Component({
  selector: 'app-editor-panel',
  standalone: true,
  imports: [
    VertexEditor,
    VoltButton,
    VoltTabs,
    VoltTabsContent,
    VoltTabsList,
    VoltTabsTrigger,
  ],
  template: `
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
            [language]="'typescript'"
            [theme]="'dark'"
            [value]="code()"
            (valueChange)="codeChange.emit($event)"
          />
        </div>
      </volt-tabs-content>

      <volt-tabs-content value="preview">
        <div
          class="flex h-96 items-center justify-center rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            class="w-full max-w-md rounded-lg border border-slate-200 p-5 shadow-sm dark:border-slate-800"
          >
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
              Preview will render here once the playground engine is wired up.
            </p>
          </div>
        </div>
      </volt-tabs-content>
    </volt-tabs>
  `,
})
export class EditorPanel {
  readonly code = input.required<string>();
  readonly codeChange = output<string>();
}
