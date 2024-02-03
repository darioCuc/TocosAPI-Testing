import { APIRequestContext } from '@playwright/test';

export const baseURL: string = 'http://tocos-api-url.com';

/**
 * Fetches the current balance of a given user.
 * @param request The Playwright request context.
 * @param baseUrl The base URL of the API.
 * @param userId The ID of the user whose balance is being fetched.
 * @returns The current balance of the user as a Promise<number>.
 */
export async function getUserBalance(request: APIRequestContext, baseUrl: string, userId: string): Promise<number> {
    const response = await request.get(`${baseUrl}/balance/${userId}`);
    const responseBody = await response.json();
    // Ensure the balance is treated as a number in case the API returns it in a different format
    return Number(responseBody.balance); // Assuming the API returns a JSON with a balance property
}
