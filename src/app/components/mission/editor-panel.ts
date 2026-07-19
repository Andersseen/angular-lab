import { Component, input, output } from '@angular/core';
import {
  VoltTabs,
  VoltTabsContent,
  VoltTabsList,
  VoltTabsTrigger,
} from '@voltui/components';
import { LmnCodeBracketIcon } from 'lumen-icons/code-bracket';
import { LmnEyeIcon } from 'lumen-icons/eye';
import type { Mission, Step } from '../../core/models/mission.model';
import { MockPreview } from './mock-preview';
import { LivePreview } from './live-preview';
import { VertexEditor } from '../editor/vertex-editor';

@Component({
  selector: 'app-editor-panel',
  standalone: true,
  imports: [
    VertexEditor,
    MockPreview,
    LivePreview,
    VoltTabs,
    VoltTabsContent,
    VoltTabsList,
    VoltTabsTrigger,
    LmnCodeBracketIcon,
    LmnEyeIcon,
  ],
  template: `
    <volt-tabs value="editor">
      <volt-tabs-list
        class="grid w-full grid-cols-2 border border-al-line"
      >
        <volt-tabs-trigger value="editor">
          <span class="flex items-center gap-2">
            <lmn-code-bracket [size]="14" />
            Editor
          </span>
        </volt-tabs-trigger>
        <volt-tabs-trigger value="preview">
          <span class="flex items-center gap-2">
            <lmn-eye [size]="14" />
            Preview
          </span>
        </volt-tabs-trigger>
      </volt-tabs-list>

      <volt-tabs-content value="editor">
        <div
          class="h-96 overflow-hidden rounded-xl border border-al-line shadow-sm"
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
        @if (mission().previewMode === 'live') {
          <app-live-preview [code]="code()" />
        } @else {
          <app-mock-preview [mission]="mission()" [step]="step()" />
        }
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
