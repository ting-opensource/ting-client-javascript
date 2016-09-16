import 'whatwg-fetch';
import _ from 'lodash';

import {Session} from '../models/Session';

export class AuthenticationService
{
    static authenticateSession(session:Session):Promise<Session>
    {
        return fetch(`${session.serviceBaseURL}/authorize`, {
            method: 'POST',
            body: JSON.stringify({
                userId: session.userId
            }),
            headers: {
                'Content-Type': 'application/json'
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