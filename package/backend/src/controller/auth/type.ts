import { Profile } from 'common';

import { ProfileLifecycle } from '../../service/entity/profile/ProfileLifecycle';
import { ControllerDependencies } from '../type';

// ********************************************************************************
// == Type ========================================================================
export type TokenPayload = {
 email: Profile['email'];
 profileId: Profile['id'];
}

export type AuthControllerDependencies = ControllerDependencies & {
 profileLifecycle?: ProfileLifecycle;
};
