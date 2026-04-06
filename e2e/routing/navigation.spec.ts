import { expect, test } from '@playwright/test';

test.describe('Navegação e rotas', () => {
  test('rota inexistente exibe página 404', async ({ page }) => {
    await page.goto('/rota-inexistente', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('Oops! Page not found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return to Home' })).toBeVisible();
  });

  test('link da página 404 volta para a home', async ({ page }) => {
    await page.goto('/rota-inexistente', { waitUntil: 'domcontentloaded' });

    await page.getByRole('link', { name: 'Return to Home' }).click();

    await expect(page.getByRole('heading', { name: /pharmaspot/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Buscar produto' })).toBeVisible();
  });

  test('home carrega com header e footer visíveis', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /pharmaspot/i })).toBeVisible();
    await expect(page.getByText('Pesquise o produto e veja o corredor.')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});