import { expect, test } from '@playwright/test';

test.describe('Busca avançada', () => {
  test('com 1 letra mostra ajuda e não abre a grade completa', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await expect(searchInput).toBeVisible();
    await searchInput.fill('d');

    await expect(
      page.getByText('Continue digitando para ver os produtos no catalogo.')
    ).toBeVisible();

    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('heading', { name: '"d"' })).toHaveCount(0);
  });

  test('busca por sinonimo retorna produtos relevantes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dor');

    await expect(page.getByRole('heading', { name: '"dor"' })).toBeVisible();
    await expect(page.getByText(/item\(ns\)/i)).toBeVisible();
    await expect(page.getByText(/Dorflex|Dipirona|Paracetamol/i).first()).toBeVisible();
  });

  test('busca com erro de digitação mostra estado sem resultado', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dipironx');

    await expect(page.getByRole('heading', { name: '"dipironx"' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Limpar busca' })).toBeVisible();
  });

  test('nova busca volta para o estado inicial após uma busca com resultado', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dipirona');

    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();

    await page.getByRole('button', { name: 'Nova busca' }).click();

    await expect(
      page.getByText('Digite o nome, marca ou categoria para localizar um produto.')
    ).toBeVisible();

    await expect(searchInput).toHaveValue('');
  });

  test('limpar uma busca sem resultado volta para o estado inicial', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dipironx');

    await expect(page.getByRole('heading', { name: '"dipironx"' })).toBeVisible();

    await page.getByRole('button', { name: 'Limpar busca' }).click();

    await expect(
      page.getByText('Digite o nome, marca ou categoria para localizar um produto.')
    ).toBeVisible();

    await expect(searchInput).toHaveValue('');
  });
});