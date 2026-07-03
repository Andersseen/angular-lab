import { Component, input, output } from '@angular/core';
import {
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import type { Mission, Step } from '../../core/models/mission.model';
import { MockPreview } from './mock-preview';
import { VertexEditor } from '../editor/vertex-editor';

@Component({
  selector: 'app-editor-panel',
  standalone: true,
  imports: [
    VertexEditor,
    MockPreview,
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
        <app-mock-preview [mission]="mission()" [step]="step()" />
      </volt-tabs-content>
    </volt-tabs>
  `,
})
export class EditorPanel {
  readonly mission = input.required<Mission>();
  readonly step = input.required<Step>();
  readonly code = input.required<string>();
  readonly codeChange = output<string>();
}
