export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  try {
    const url = `https://shop.rewe.de/api/products?search=${encodeURIComponent(query)}&serviceTypes=DELIVERY&market=540592`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'de-DE,de;q=0.9',
        'Referer': 'https://shop.rewe.de/',
      }
    });

    if (!r.ok) {
      // Fallback: return mock data so app doesn't break
      return res.status(200).json({ fallback: true, products: getMockProducts(query) });
    }

    const data = await r.json();
    const products = (data._embedded?.['rex:products'] || data.products || []).slice(0, 4).map(p => ({
      name: p.name || p.productName || query,
      brand: p.brand?.name || p.brandName || '',
      price: p.pricing?.currentRetailPrice || p.price || null,
      priceFormatted: p.pricing?.currentRetailPriceFormatted || (p.price ? p.price.toFixed(2) + ' €' : null),
      unit: p.pricing?.grammage || p.unitSize || '',
      img: p.media?.thumbnail?.src || p.images?.[0]?.src || null,
      id: p.id || p.productId || '',
    }));

    return res.status(200).json({ products });
  } catch(e) {
    return res.status(200).json({ fallback: true, products: getMockProducts(query) });
  }
}

function getMockProducts(query) {
  // Fallback mock prices wenn API nicht erreichbar
  const q = query.toLowerCase();
  if (q.includes('ei') || q.includes('egg')) return [
    { name: 'Bio Eier 10er', brand: 'REWE Bio', priceFormatted: '2,49 €', unit: '10 Stück' },
    { name: 'Freilandeier 6er', brand: 'Ja!', priceFormatted: '1,29 €', unit: '6 Stück' },
  ];
  if (q.includes('hähnchen') || q.includes('chicken') || q.includes('hühnerbrust')) return [
    { name: 'Hähnchenbrustfilet', brand: 'REWE', priceFormatted: '4,99 €', unit: '500g' },
    { name: 'Bio Hähnchenbrustfilet', brand: 'REWE Bio', priceFormatted: '6,49 €', unit: '400g' },
  ];
  if (q.includes('lachs') || q.includes('salmon')) return [
    { name: 'Lachsfilet', brand: 'REWE', priceFormatted: '3,99 €', unit: '200g' },
    { name: 'Bio Lachs', brand: 'REWE Bio', priceFormatted: '5,49 €', unit: '200g' },
  ];
  if (q.includes('quinoa')) return [
    { name: 'Quinoa weiß', brand: 'REWE Bio', priceFormatted: '2,99 €', unit: '400g' },
    { name: 'Quinoa', brand: 'Alnatura', priceFormatted: '3,49 €', unit: '500g' },
  ];
  return [
    { name: query, brand: 'REWE', priceFormatted: '1,99 €', unit: '' },
    { name: query + ' Bio', brand: 'REWE Bio', priceFormatted: '2,79 €', unit: '' },
  ];
}
