import { test, expect } from '@playwright/test';
import { baseURL } from '../testHelpers';

test.describe('/sell endpoint tests', () => {

    // Test case for successful Tocos sale
    test('Sell Tocos Success', async ({ request }) => {
        const response = await request.post(`${baseURL}/sell`, {
            data: {
                userId: 'user1',
                tocoAmount: 10 
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toMatch(/sale successful/);
        expect(responseBody).toHaveProperty('fiatAdded');
        expect(responseBody.fiatAdded).toBeGreaterThan(0);
        expect(responseBody).toHaveProperty('newTocoBalance');
    });

    // Test case for attempting to sell more Tocos than owned
    test('Attempt to Sell More Tocos Than Owned', async ({ request }) => {
        const response = await request.post(`${baseURL}/sell`, {
            data: {
                userId: 'user2',
                tocoAmount: 10000 // Excessively high amount for demonstration
            }
        });
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.error).toMatch(/insufficient tocos to sell/);
    });

    // Test case for exceeding daily Tocos sale limit
    test('Sell Tocos Beyond Daily Limit', async ({ request }) => {
        const numberOfSells = 5;

        for (let attempt = 1; attempt <= numberOfSells; attempt++) {
            const response = await request.post(`${baseURL}/sell`, {
                data: {
                    userId: 'user3',
                    tocoAmount: 1000 
                }
            });

            if (attempt < numberOfSells) {
                expect(response.status()).toBe(200); 
                const responseBody = await response.json();
                expect(responseBody.message).toMatch(/sale successful/);
            } else {
                expect(response.status()).toBe(400); 
                const responseBody = await response.json();
                expect(responseBody.error).toMatch(/daily limit exceeded/); 
            }
        }
    });

});
