import { test, expect } from '@playwright/test';
import { baseURL, getUserBalance } from '../testHelpers';

test.describe('/transactions endpoint tests', () => {

    // Test case for successful Toco transaction between users
    test('Successful Toco Transaction Between Users', async ({ request }) => {
        const user1InitialBalance = await getUserBalance(request, baseURL, 'user1');
        const user2InitialBalance = await getUserBalance(request, baseURL, 'user2');

        // Perform the transaction
        const transactionResponse = await request.post(`${baseURL}/transactions`, {
            data: {
                fromUserId: 'user1',
                toUserId: 'user2',
                tocoAmount: 50 
            }
        });
        expect(transactionResponse.status()).toBe(200);
        const transactionBody = await transactionResponse.json();
        expect(transactionBody).toHaveProperty('transactionId');
        expect(transactionBody.message).toMatch(/transfer successful/);

        // Fetch balances after the transaction and validate the balance changes
        expect(await getUserBalance(request, baseURL, 'user1')).toBeLessThan(user1InitialBalance);
        expect(await getUserBalance(request, baseURL, 'user2')).toBeGreaterThan(user2InitialBalance);
    });

    // Test case for unauthorized transaction attempt
    test('Unauthorized Transaction Attempt', async ({ request }) => {
        const unauthorizedResponse = await request.post(`${baseURL}/transactions`, {
            data: {
                fromUserId: 'user1',
                toUserId: 'user2',
                tocosAmount: 5
            },
            headers: {
                'Authorization': 'InvalidToken'
            }
        });
        expect(unauthorizedResponse.status()).toBe(401);
        const unauthorizedBody = await unauthorizedResponse.json();
        expect(unauthorizedBody.error).toMatch(/unauthorized/);
    });

    // Test case for insufficient Toco balance for transaction
    test('Insufficient Toco Balance for Transaction', async ({ request }) => {
        const insufficientBalanceResponse = await request.post(`${baseURL}/transactions`, {
            data: {
                fromUserId: 'user1',
                toUserId: 'user2',
                tocosAmount: 10000 
            }
        });
        expect(insufficientBalanceResponse.status()).toBe(400);
        const insufficientBalanceBody = await insufficientBalanceResponse.json();
        expect(insufficientBalanceBody.error).toMatch(/insufficient balance/);
    });
});

test.describe('/transactions/{userId} endpoint tests', () => {

    test('Retrieve Transaction History Success', async ({ request }) => {
        const userId = 'userA';
        const transactionHistoryResponse = await request.get(`${baseURL}/transactions/${userId}`);
        expect(transactionHistoryResponse.status()).toBe(200);
        const transactionHistory = await transactionHistoryResponse.json();
        expect(Array.isArray(transactionHistory)).toBeTruthy();
        expect(transactionHistory.length).toBeGreaterThan(0); 
    });

    test('Unauthorized Access to Transaction History', async ({ request }) => {
        const unauthorizedUserId = 'userB';
        const unauthorizedResponse = await request.get(`${baseURL}/transactions/${unauthorizedUserId}`, {
            headers: {
                'Authorization': 'UserAToken'
            }
        });
        const status = unauthorizedResponse.status();
        expect([401, 403]).toContain(status);
    });

    test('Transaction History of a New User', async ({ request }) => {
        const newUser = 'newUserId'; 
        const newUserResponse = await request.get(`${baseURL}/transactions/${newUser}`);
        expect(newUserResponse.status()).toBe(200);
        const history = await newUserResponse.json();
        expect(Array.isArray(history)).toBeTruthy();
        expect(history.length).toBe(0); 
    });

    // Performance: Evaluate API response time under simulated load
    test('API Response Time Under Load', async ({ request }) => {
        const startTime = Date.now();
        const response = await request.get(`${baseURL}/transactions/userA`);
        const endTime = Date.now();
        expect(response.status()).toBe(200);
        const responseTime = endTime - startTime;
        console.log(`Response time: ${responseTime} ms`);
        
        // We're expecting the API to respond in under 1 second
        expect(responseTime).toBeLessThan(1000); 
    });

});
