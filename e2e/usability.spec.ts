import { expect, test } from '@playwright/test';

test.describe('Usabilidade', () => {
  test('usuario consegue pesquisar um produto e limpar a busca', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dipirona');

    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Limpar busca' })).toBeVisible();

    await page.getByRole('button', { name: 'Limpar busca' }).click();
    await expect(searchInput).toHaveValue('');
  });

  test('usuario consegue navegar pelas sugestoes com teclado', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dip');
    await expect(page.getByRole('listbox')).toBeVisible();

    await searchInput.press('ArrowDown');
    await expect(page.getByRole('option').first()).toBeVisible();

    await searchInput.press('Enter');
    await expect(searchInput).not.toHaveValue('dip');
  });

  test('usuario mostra estado de busca sem resultados', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dipironx');

    await expect(page.getByRole('heading', { name: '"dipironx"' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Limpar busca' })).toBeVisible();
  });

  test('usuario consegue abrir sugestoes ao digitar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dor');

    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option').first()).toBeVisible();
  });

  test('usuario consegue fechar sugestoes com escape', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dor');

    await expect(page.getByRole('listbox')).toBeVisible();
    await searchInput.press('Escape');

    await expect(page.getByRole('listbox')).toHaveCount(0);
  });

  test('usuario consegue navegar para cima e para baixo nas sugestoes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dor');

    await expect(page.getByRole('listbox')).toBeVisible();

    await searchInput.press('ArrowDown');
    await expect(page.getByRole('option').first()).toBeVisible();

    await searchInput.press('ArrowDown');
    await expect(page.getByRole('option').nth(1)).toBeVisible();

    await searchInput.press('ArrowUp');
    await expect(page.getByRole('listbox')).toBeVisible();
  });

  test('usuario mantem a busca preenchida ao mostrar resultados', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dipirona');

    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();
    await expect(searchInput).toHaveValue('dipirona');
  });
});