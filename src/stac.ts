export interface STACCollection {
  id: string;
  title: string;
  description: string;
  links: Array<{
    href: string;
    rel: string;
    type?: string;
  }>;
  extent: {
    spatial: {
      bbox: number[][];
    };
    temporal: {
      interval: Array<[string, string]>;
    };
  };
  properties: Record<string, any>;
}

export interface STACAsset {
  href: string;
  type: string;
  title?: string;
}

export interface STACItem {
  id: string;
  assets: Record<string, STACAsset>;
  properties: Record<string, any>;
  collection?: string;
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error loading ${url}`);
  return res.json();
}

export interface STACData {
  item: STACItem;
  itemUrl: string;
  collection: STACCollection;
}

export async function fetchRandomSTACItem(): Promise<STACData> {
  const catalogUrl =
    "https://nz-imagery.s3-ap-southeast-2.amazonaws.com/catalog.json";
  const catalog = await fetchJSON<{ links: { href: string; rel: string }[] }>(
    catalogUrl
  );

  const collectionLinks = catalog.links.filter((link) => link.rel === "child");
  const randomCollectionHref =
    collectionLinks[Math.floor(Math.random() * collectionLinks.length)].href;
  const collectionUrl = new URL(randomCollectionHref, catalogUrl).toString();

  const collection = await fetchJSON<STACCollection>(collectionUrl);

  const itemLinks = collection.links.filter((link) => link.rel === "item");

  if (itemLinks.length === 0) {
    throw new Error("No items found in the collection");
  }

  const randomItemHref =
    itemLinks[Math.floor(Math.random() * itemLinks.length)].href;
  const itemUrl = new URL(randomItemHref, collectionUrl).toString();
  const item = await fetchJSON<STACItem>(itemUrl);

  return { item, itemUrl, collection };
}
