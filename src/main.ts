import { fetchRandomSTACItem } from "./stac";
import { displayImageOnCanvas } from "./canvas";
import { displayMetadata } from "./metadata";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

async function display() {
  try {
    const { item, itemUrl, collection } = await fetchRandomSTACItem();
    console.log("STAC Item:", item);
    const rawAssetHref =
      item.assets["visual"]?.href || Object.values(item.assets)[0].href;
    const imageUrl = new URL(rawAssetHref, itemUrl).toString();
    console.log("Asset URL:", imageUrl);
    await displayImageOnCanvas(imageUrl, canvas);
    displayMetadata(item, collection);
  } catch (err) {
    console.error("Error while loading data:", err);
  }
}

display();
