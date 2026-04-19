import { Profile } from 'common';

// ********************************************************************************
export type TokenPayload = {
 email: Profile['email'];
 profileId: Profile['id'];
}
