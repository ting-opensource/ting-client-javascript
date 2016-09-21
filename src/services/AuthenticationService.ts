import 'whatwg-fetch';
import * as _ from 'lodash';

import {Base64Encoder} from '../utils/Base64Encoder';
import {Session} from '../models/Session';

export class AuthenticationService
{
    static authenticateSession(session:Session):Promise<Session>
    {
        let clientAuthCredentials:string = `${session.clientId}:${session.clientSecret}`;

        return fetch(`${session.serviceBaseURL}/authorize`, {
            method: 'POST',
            body: JSON.stringify({
                userId: session.userId
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Base64Encoder.encode(clientAuthCredentials)}`
            }
        })
        .then((response:any) =>
        {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                let error = new Error(response.statusText);
                throw error;
            }
        })
        .then((response:any) =>
        {
            session.autheticateWithToken(response.token);
            return session;
        });
    }
}