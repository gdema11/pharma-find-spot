import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Acessibilidade', () => {
  test('home deve carregar sem violacoes criticas', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('combobox', { name: 'Buscar produto' })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('resultado de busca deve continuar acessivel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dipirona');
    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('main')
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('campo de busca tem nome acessivel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('combobox', { name: 'Buscar produto' })).toBeVisible();
  });

  test('botao de limpar busca tem nome acessivel', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dipirona');

    await expect(page.getByRole('button', { name: 'Limpar busca' })).toBeVisible();
  });

  test('lista de sugestoes expoe opcoes acessiveis', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('dor');

    await expect(page.getByRole('listbox', { name: 'Sugestões de busca' })).toBeVisible();
    await expect(page.getByRole('option').first()).toBeVisible();
  });
});