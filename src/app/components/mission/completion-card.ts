import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VoltButton } from '@voltui/components';
import { TranslatePipe } from '@ngx-translate/core';
import { LmnArrowDownTrayIcon } from 'lumen-icons/arrow-down-tray';
import { LmnClipboardIcon } from 'lumen-icons/clipboard';
import {
  buildShareCardSvg,
  buildShareText,
  shareCardDataUrl,
} from '../../core/achievements/share-card';
import { downloadShareCard } from '../../core/achievements/share-image';
import type { Mission } from '../../core/models/mission.model';
import { AchievementsService } from '../../core/services/achievements.service';

@Component({
  selector: 'app-completion-card',
  standalone: true,
  imports: [VoltButton, TranslatePipe, LmnArrowDownTrayIcon, LmnClipboardIcon],
  template: `
    <figure class="m-0">
      <img
        class="w-full rounded-xl border border-al-line"
        [src]="imageSrc()"
        [alt]="
          'mission.completionCard.altText'
            | translate
              : {
                  title: mission().title,
                  track: card().track,
                  date: card().completedOn
                }
        "
        width="1200"
        height="630"
      />
      <figcaption class="mt-3 text-sm text-al-ink-muted">
        {{ 'mission.completionCard.caption' | translate }}
      </figcaption>
    </figure>

    <div class="mt-4 flex flex-wrap gap-3">
      <volt-button variant="outline" (click)="save()">
        <span class="flex items-center gap-2">
          <lmn-arrow-down-tray [size]="16" />
          {{ 'mission.completionCard.saveButton' | translate }}
        </span>
      </volt-button>
      <volt-button variant="outline" (click)="copy()">
        <span class="flex items-center gap-2">
          <lmn-clipboard [size]="16" />
          {{
            (copied()
              ? 'mission.completionCard.copiedButton'
              : 'mission.completionCard.copyButton'
            ) | translate
          }}
        </span>
      </volt-button>
    </div>
  `,
})
export class CompletionCard {
  private readonly achievements = inject(AchievementsService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly mission = input.required<Mission>();
  readonly copied = signal(false);

  readonly card = computed(() => this.achievements.completionCard(this.mission()));
  readonly svg = computed(() => buildShareCardSvg(this.card()));

  /**
   * Angular's URL sanitizer allowlists only raster `data:` images, so an inline
   * SVG has to be marked trusted. It is safe here: the markup is built by
   * `buildShareCardSvg` with every value XML-escaped, and an `<img>`-rendered
   * SVG is inert regardless.
   */
  readonly imageSrc = computed(() =>
    this.sanitizer.bypassSecurityTrustUrl(shareCardDataUrl(this.svg()))
  );

  save(): void {
    void downloadShareCard(this.svg(), `angular-lab-${this.mission().id}`);
  }

  copy(): void {
    void navigator.clipboard?.writeText(buildShareText(this.card())).then(() => {
      this.copied.set(true);
    });
  }
}
