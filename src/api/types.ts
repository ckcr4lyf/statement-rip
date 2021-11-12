import { AuthTokenResponse } from "../finverse/types.js";

export type statefulLiat = AuthTokenResponse & {
    state: string;
}