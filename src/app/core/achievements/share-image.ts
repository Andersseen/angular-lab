import { SHARE_CARD_SIZE, shareCardDataUrl } from './share-card';

/**
 * Saves a completion card to disk. PNG is what social platforms accept, so it
 * is the target; if rasterising is unavailable (no canvas, tainted output) the
 * original SVG is saved instead rather than failing the user's click.
 */

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function rasterise(svg: string, scale: number): Promise<Blob> {
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Card image could not be rendered.'));
    image.src = shareCardDataUrl(svg);
  });

  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_SIZE.width * scale;
  canvas.height = SHARE_CARD_SIZE.height * scale;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is unavailable.');
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Encoding failed.'))),
      'image/png'
    );
  });
}

export async function downloadShareCard(
  svg: string,
  baseName: string
): Promise<void> {
  if (typeof URL.createObjectURL !== 'function') {
    return;
  }

  try {
    triggerDownload(await rasterise(svg, 2), `${baseName}.png`);
  } catch {
    triggerDownload(
      new Blob([svg], { type: 'image/svg+xml' }),
      `${baseName}.svg`
    );
  }
}
