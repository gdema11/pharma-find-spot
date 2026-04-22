import { expect, test } from '@playwright/test';

const apiBaseUrl = 'http://127.0.0.1:3001/api';

test.describe('API do catálogo', () => {
  test('health responde com status ok', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/health`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.status).toBe('ok');
    expect(body.service).toBe('pharma-find-spot-api');
    expect(body.database).toContain('pharma-find-spot');
    expect(body.timestamp).toBeTruthy();
  });

  test('products retorna lista com total e items', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/products`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(typeof body.total).toBe('number');
    expect(Array.isArray(body.items)).toBeTruthy();
    expect(body.total).toBeGreaterThan(0);
    expect(body.items.length).toBeGreaterThan(0);
  });

  test('products filtra por termo de busca', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/products?q=dipirona`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.total).toBeGreaterThan(0);
    expect(
      body.items.some((item: { name: string }) =>
        item.name.toLowerCase().includes('dipirona')
      )
    ).toBeTruthy();
  });

  test('products filtra por categoria e corredor', async ({ request }) => {
    const response = await request.get(
      `${apiBaseUrl}/products?category=${encodeURIComponent('Analgésicos')}&aisleId=corredor-1`
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.total).toBeGreaterThan(0);

    for (const item of body.items) {
      expect(item.category).toBe('Analgésicos');
      expect(item.aisleId).toBe('corredor-1');
    }
  });

  test('products ordena por preço decrescente', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/products?sort=price-desc`);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.items.length).toBeGreaterThan(1);

    for (let index = 0; index < body.items.length - 1; index += 1) {
      expect(body.items[index].priceInCents).toBeGreaterThanOrEqual(
        body.items[index + 1].priceInCents
      );
    }
  });

  test('products por id retorna 404 para item inexistente', async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/products/nao-existe`);

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe('Produto não encontrado');
  });
});