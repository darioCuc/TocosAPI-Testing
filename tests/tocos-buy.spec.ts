import { test, expect } from '@playwright/test';
import { baseURL } from '../testHelpers';


test.describe('/buy endpoint tests', () => {

  // Test case for successful Tocos purchase
  test('Buy Tocos successfully', async ({ request }) => {
    const response = await request.post(`${baseURL}/buy`, {
      data: {
        userId: 'user1',
        fiatAmount: 10 
      }
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.message).toMatch(/purchase successful/); 
    expect(responseBody).toHaveProperty('tocosAdded');
    expect(responseBody.tocosAdded).toBeGreaterThan(0);
    expect(responseBody).toHaveProperty('newFiatBalance');
  });

  // Test case for attempting to buy Tocos with insufficient fiat currency
  test('Buy Tocos With Insufficient Fiat Currency', async ({ request }) => {
    const response = await request.post(`${baseURL}/buy`, {
      data: {
        userId: 'user2',
        fiatAmount: 1000000 // Exceeding the balance for demonstration
      }
    });
    expect(response.status()).toBe(400); 
    const responseBody = await response.json();
    expect(responseBody.error).toMatch(/insufficient funds/);
  });

  // Test case for exceeding daily Tocos purchase limit
  test('Buy Tocos Daily Limit Exceeded', async ({ request }) => {
    const numberOfBuys = 5; // Adjust based on the daily limit

    for (let attempt = 1; attempt <= numberOfBuys; attempt++) {
      const response = await request.post(`${baseURL}/buy`, {
        data: {
          userId: 'user3',
          fiatAmount: 100
        }
      });

      if (attempt < numberOfBuys) {
        expect(response.status()).toBe(200); 
        const responseBody = await response.json();
        expect(responseBody.message).toMatch(/purchase successful/); 
      } else {
        expect(response.status()).toBe(400); 
        const responseBody = await response.json();
        expect(responseBody.error).toMatch(/daily limit exceeded/);
      }
    }
  });

});
