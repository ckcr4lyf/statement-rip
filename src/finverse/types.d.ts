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