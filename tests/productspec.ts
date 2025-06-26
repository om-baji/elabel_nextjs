import { test, expect } from '@playwright/test';

test.describe('Create Product Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the create product page
    await page.goto('/products/new');
  });

  test('should render the create product form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create new product/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('should display validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /submit/i }).click();

    // Assuming validation errors show up
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should create a product successfully', async ({ page }) => {
    // Fill the form (adjust selectors/test IDs as per your ProductForm)
    await page.getByLabel(/product name/i).fill('Test Wine');
    await page.getByLabel(/description/i).fill('A great test wine');
    await page.getByLabel(/price/i).fill('29.99');

    // Mock API or let it hit real backend (depending on your setup)
    await page.getByRole('button', { name: /submit/i }).click();

    // Assert toast success message
    await expect(page.getByText(/product created successfully/i)).toBeVisible();

    // Should redirect to products list page
    await expect(page).toHaveURL('/products');
  });

  test('should show error toast on API failure', async ({ page }) => {
    // Simulate API failure by intercepting network request
    await page.route('/api/products', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    );

    await page.getByLabel(/product name/i).fill('Fail Wine');
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(/error creating product/i)).toBeVisible();
  });

  test('should cancel and navigate back to product list', async ({ page }) => {
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page).toHaveURL('/products');
  });
});
