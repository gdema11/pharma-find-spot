import { expect, test } from '@playwright/test';

test.describe('Memória de busca e analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      window.localStorage.clear();
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
  });

  test('salva busca recente e mostra nas sugestões ao focar o campo vazio', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dipirona');
    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();

    await page.waitForTimeout(900);

    await page.getByRole('button', { name: 'Limpar busca' }).click();
    await expect(searchInput).toHaveValue('');

    await searchInput.click();

    const suggestionsList = page.getByRole('listbox', { name: 'Sugestões de busca' });

    await expect(suggestionsList).toBeVisible();
    await expect(page.getByText('Busca recente')).toBeVisible();
    await expect(suggestionsList.getByText('dipirona')).toBeVisible();
  });

  test('mostra termo pesquisado em buscas mais feitas', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dipirona');
    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();

    await page.waitForTimeout(700);

    await page.getByRole('button', { name: 'Limpar busca' }).click();

    await expect(page.getByText('Buscas mais feitas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'dipirona' }).first()).toBeVisible();
  });

  test('mostra termo sem resultado na área de analytics', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('zzzzzzz');

    await expect(page.getByRole('heading', { name: '"zzzzzzz"' })).toBeVisible();

    await page.waitForTimeout(700);

    await page.getByRole('button', { name: 'Limpar busca' }).click();

    await expect(page.getByText('Termos sem resultado')).toBeVisible();
    await expect(page.getByRole('button', { name: 'zzzzzzz' }).first()).toBeVisible();
  });

  test('clicar em termo salvo em buscas mais feitas reaplica a busca', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Buscar produto' });

    await searchInput.fill('dipirona');
    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();

    await page.waitForTimeout(700);

    await page.getByRole('button', { name: 'Limpar busca' }).click();
    await page.getByRole('button', { name: 'dipirona' }).first().click();

    await expect(page.getByRole('heading', { name: '"dipirona"' })).toBeVisible();
    await expect(searchInput).toHaveValue('dipirona');
  });
});