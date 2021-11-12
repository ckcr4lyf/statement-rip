import got from 'got';
import { CustomerAccessTokenResponse, LinkTokenResponse } from './types';

/**
 * Convenience wrapper for performing operations with Finverse API
 */
export class FinverseClient {

    private customerAccessToken: string;
    private baseUrl: string;

    constructor(private clientId: string, private clientSecret: string, private redirectUri: string){
        this.customerAccessToken = '';
        this.baseUrl = 'https://api.sandbox.finverse.net';
    }

    async getCustomerToken(){
        const token = <CustomerAccessTokenResponse> await got.post(`${this.baseUrl}/auth/customer/token`, {
            json: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials',
            }
        }).json();

        this.customerAccessToken = token.access_token;
    }

    async createLinkToken(userId: string, state: string): Promise<LinkTokenResponse> {

        const body = {
            client_id: this.clientId,
            user_id: userId,
            redirect_uri: this.redirectUri,
            state: state,
            response_mode: 'form_post',
            response_type: 'code',
            grant_type: 'client_credentials',
        }

        console.log(body);
        console.log(this.customerAccessToken);

        return got.post(`${this.baseUrl}/link/token`, {
            json: body,
            headers: {
                'Authorization': `Bearer ${this.customerAccessToken}`
            }
        }).json();
    }
}