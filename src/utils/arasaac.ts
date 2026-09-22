/**
 * ARASAAC AAC (Augmentative and Alternative Communication) Pictogram API Service
 * ARASAAC (arasaac.org) provides open-license pictograms for cognitive and communication support.
 * We query the Brazilian Portuguese endpoint directly (no API key required).
 */

export interface ArasaacPictogram {
  id: number;
  name: string;
  imageUrl: string;
  synonyms?: string[];
}

export interface ArasaacCategoryQuickPick {
  label: string;
  query: string;
  emoji: string;
}

export const ARASAAC_POPULAR_TAGS: ArasaacCategoryQuickPick[] = [
  { label: 'Banheiro / Vaso', query: 'banheiro', emoji: '🚽' },
  { label: 'Escovar Dentes', query: 'escovar dentes', emoji: '🪥' },
  { label: 'Lavar as Mãos', query: 'lavar mãos', emoji: '🧼' },
  { label: 'Tomar Banho', query: 'banho', emoji: '🚿' },
  { label: 'Comer / Lanche', query: 'comer', emoji: '🍽️' },
  { label: 'Beber Água', query: 'beber água', emoji: '💧' },
  { label: 'Trocar Roupa', query: 'vestir', emoji: '👕' },
  { label: 'Guardar Brinquedos', query: 'guardar brinquedos', emoji: '🧸' },
  { label: 'Lição / Escola', query: 'escola', emoji: '🎒' },
  { label: 'Terapia / Fono', query: 'terapia', emoji: '🧩' },
  { label: 'Hora de Dormir', query: 'dormir', emoji: '🌙' },
  { label: 'Tomar Remédio', query: 'remédio', emoji: '💊' },
  { label: 'Esperar com Calma', query: 'esperar', emoji: '⏳' },
  { label: 'Parque / Passear', query: 'passear', emoji: '🌳' },
];

const memoryCache = new Map<string, ArasaacPictogram[]>();

export async function searchArasaacPictograms(
  query: string,
  limit: number = 24
): Promise<ArasaacPictogram[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  if (memoryCache.has(cleanQuery)) {
    return memoryCache.get(cleanQuery)!.slice(0, limit);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const endpoint = `https://api.arasaac.org/api/pictograms/br/search/${encodeURIComponent(cleanQuery)}`;
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        memoryCache.set(cleanQuery, []);
        return [];
      }
      throw new Error(`ARASAAC API error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    const pictograms: ArasaacPictogram[] = data.map((item: any) => {
      const primaryKeyword =
        item.keywords?.find((k: any) => k.keyword?.toLowerCase() === cleanQuery)?.keyword ||
        item.keywords?.[0]?.keyword ||
        cleanQuery;

      const synonyms = item.keywords?.map((k: any) => k.keyword).filter(Boolean) || [];

      return {
        id: item._id,
        name: primaryKeyword,
        imageUrl: `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`,
        synonyms,
      };
    });

    memoryCache.set(cleanQuery, pictograms);
    return pictograms.slice(0, limit);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('ARASAAC API search timed out.');
    } else {
      console.error('Failed to search ARASAAC pictograms:', error);
    }
    return [];
  }
}
