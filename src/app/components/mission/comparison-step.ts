import { Component, input } from '@angular/core';
import {
  VoltCard,
  VoltCardContent,
  VoltCardHeader,
  VoltCardTitle,
} from '@voltui/components';
import type { Comparison } from '../../core/models/mission.model';

@Component({
  selector: 'app-comparison-step',
  standalone: true,
  imports: [VoltCard, VoltCardContent, VoltCardHeader, VoltCardTitle],
  template: `
    <div class="space-y-5">
      <div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-100 dark:bg-slate-900">
            <tr>
              <th class="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Aspect</th>
              <th class="px-4 py-3 font-semibold text-blue-700 dark:text-blue-300">{{ comparison().titleA }}</th>
              <th class="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-300">{{ comparison().titleB }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
            @for (point of comparison().points; track point.aspect) {
              <tr>
                <td class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{{ point.aspect }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ point.a }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ point.b }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <volt-card>
        <volt-card-header>
          <volt-card-title>Recommendation</volt-card-title>
        </volt-card-header>
        <volt-card-content>
          <p class="text-slate-700 dark:text-slate-200">{{ comparison().recommendation }}</p>
        </volt-card-content>
      </volt-card>
    </div>
  `,
})
export class ComparisonStep {
  readonly comparison = input.required<Comparison>();
}
