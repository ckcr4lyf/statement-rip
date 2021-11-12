export type CustomerAccessTokenResponse = {
    access_token: string,
    expires_in: number,
    token_type: string,
}

export type LinkTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    link_url: string;
}

export type AuthTokenResponse = {
    access_token: string;
    expires_in: number;
    login_identity_id: string;
    refresh_token: string;
    token_type: string;
}