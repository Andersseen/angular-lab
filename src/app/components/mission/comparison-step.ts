import { Component, input } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import { LmnLightBulbIcon } from 'lumen-icons/light-bulb';
import type { Comparison } from '../../core/models/mission.model';

@Component({
  selector: 'app-comparison-step',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle, LmnLightBulbIcon],
  template: `
    <div class="space-y-5">
      <div
        class="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800"
      >
        <table class="w-full text-left text-sm">
          <thead class="bg-zinc-100 dark:bg-zinc-900">
            <tr>
              <th
                class="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-200"
              >
                Aspect
              </th>
              <th
                class="px-4 py-3 font-semibold text-blue-700 dark:text-blue-300"
              >
                {{ comparison().titleA }}
              </th>
              <th
                class="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-300"
              >
                {{ comparison().titleB }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            @for (point of comparison().points; track point.aspect) {
              <tr>
                <td
                  class="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-200"
                >
                  {{ point.aspect }}
                </td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {{ point.a }}
                </td>
                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  {{ point.b }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <volt-card class="border-zinc-200 dark:border-zinc-800">
        <volt-card-header>
          <div class="mb-1 flex items-center gap-2 text-blue-600 dark:text-blue-300">
            <lmn-light-bulb [size]="16" />
            <span class="text-xs font-semibold uppercase tracking-wide">Recommendation</span>
          </div>
          <volt-card-title class="text-base">When to choose what</volt-card-title>
        </volt-card-header>
        <volt-card-content>
          <p class="leading-relaxed text-zinc-700 dark:text-zinc-200">
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
