import { STACCollection, STACItem } from "./stac";

export function displayMetadata(item: STACItem, collection: STACCollection) {
  const container = document.getElementById("collection-description");
  if (!container) return;

  const collectionDescription = collection.description || "unknown";

  container.textContent = collectionDescription;
}
