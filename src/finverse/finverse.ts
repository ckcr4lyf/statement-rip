import got from 'got';
import { AuthTokenResponse, CustomerAccessTokenResponse, LinkTokenResponse, LoginIdentityResponse, StatementsOverviewResponse } from './types.js';

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

        // console.log(body);
        // console.log(this.customerAccessToken);

        return got.post(`${this.baseUrl}/link/token`, {
            json: body,
            headers: {
                'Authorization': `Bearer ${this.customerAccessToken}`
            }
        }).json();
    }

    async exchangeCode(code: string): Promise<AuthTokenResponse> {
        return got.post(`${this.baseUrl}/auth/token`, {
            form: {
                client_id: this.clientId,
                code: code,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code',
            },
            headers: {
                'Authorization': `Bearer ${this.customerAccessToken}`
            }
        }).json();
    }

    async getLoginIdentity(liat: string): Promise<LoginIdentityResponse> {
        return got.get(`${this.baseUrl}/login_identity`, {
            headers: {
                'Authorization': `Bearer ${liat}`
            }
        }).json();
    }

    async getStatementsOverview(liat: string): Promise<StatementsOverviewResponse> {
        return got.get(`${this.baseUrl}/statements`, {
            headers: {
                'Authorization': `Bearer ${liat}`
            }
        }).json();
    }

    async downloadStatement(statementId: string, liat: string): Promise<Buffer> {
        return got.get(`${this.baseUrl}/statements/${statementId}`, {
            headers: {
                'Authorization': `Bearer ${liat}`
            }
        }).buffer();
    }
}