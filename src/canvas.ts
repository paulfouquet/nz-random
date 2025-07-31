import { fromUrl } from "geotiff";

export async function displayImageOnCanvas(
  url: string,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context non disponible");

  const tiff = await fromUrl(url);
  const image = await tiff.getImage();

  const overviews = image.getOverviews?.();
  const lowResImage =
    overviews && overviews.length > 0 ? overviews[overviews.length - 1] : image;

  // reduire taille pour vitesse
  const scale = 0.25;
  const width = lowResImage.getWidth();
  const height = lowResImage.getHeight();

  const readWidth = Math.floor(width * scale);
  const readHeight = Math.floor(height * scale);

  const rasters = await lowResImage.readRasters({
    window: [0, 0, readWidth, readHeight],
    width: readWidth,
    height: readHeight,
    samples: [0, 1, 2],
  });

  canvas.width = readWidth;
  canvas.height = readHeight;

  const imageData = ctx.createImageData(readWidth, readHeight);
  const data = imageData.data;
  // converts a 3-band raster image (RGB) into a flat RGBA
  for (let i = 0; i < readWidth * readHeight; i++) {
    data[i * 4] = rasters[0][i];
    data[i * 4 + 1] = rasters[1][i];
    data[i * 4 + 2] = rasters[2][i];
    data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
