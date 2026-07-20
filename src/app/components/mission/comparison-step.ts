import { Component, input } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnLightBulbIcon } from 'lumen-icons/light-bulb';
import type { Comparison } from '../../core/models/mission.model';

@Component({
  selector: 'app-comparison-step',
  standalone: true,
  imports: [
    VoltCard,
    VoltCardContent,
    VoltCardHeader,
    VoltCardTitle,
    TranslatePipe,
    LmnLightBulbIcon,
  ],
  template: `
    <div class="space-y-5">
      <div
        class="overflow-hidden rounded-xl border border-al-line shadow-sm"
      >
        <table class="w-full text-left text-sm">
          <thead class="bg-al-surface">
            <tr>
              <th
                class="px-4 py-3 font-semibold text-al-ink"
              >
                {{ 'mission.comparison.aspectHeader' | translate }}
              </th>
              <th
                class="px-4 py-3 font-semibold text-al-brand"
              >
                {{ comparison().titleA }}
              </th>
              <th
                class="px-4 py-3 font-semibold text-al-success"
              >
                {{ comparison().titleB }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-al-line">
            @for (point of comparison().points; track point.aspect) {
              <tr>
                <td
                  class="px-4 py-3 font-medium text-al-ink"
                >
                  {{ point.aspect }}
                </td>
                <td class="px-4 py-3 text-al-ink-muted">
                  {{ point.a }}
                </td>
                <td class="px-4 py-3 text-al-ink-muted">
                  {{ point.b }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <volt-card class="border-al-line">
        <volt-card-header>
          <div class="mb-1 flex items-center gap-2 text-al-brand">
            <lmn-light-bulb [size]="16" />
            <span class="text-xs font-semibold uppercase tracking-wide">{{
              'mission.comparison.recommendationLabel' | translate
            }}</span>
          </div>
          <volt-card-title class="text-base">{{
            'mission.comparison.whenToChooseTitle' | translate
          }}</volt-card-title>
        </volt-card-header>
        <volt-card-content>
          <p class="leading-relaxed text-al-ink">
            {{ comparison().recommendation }}
          </p>
        </volt-card-content>
      </volt-card>
    </div>
  `,
})
export class ComparisonStep {
  readonly comparison = input.required<Comparison>();
}
