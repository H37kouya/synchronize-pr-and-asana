import { Client } from 'asana'

export const createAsanaClient = (accessToken: string) => Client.create().useAccessToken(accessToken);
