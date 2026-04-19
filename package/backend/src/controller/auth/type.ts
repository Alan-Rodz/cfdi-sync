import { Profile } from 'common';

import { ProfileLifecycle } from '../../service/entity/profile/ProfileLifecycle';
import { ProfileAuthPort, ProfileRepositoryFactoryPort } from '../../service/entity/profile/type';
import { ControllerDependencies } from '../type';

// ********************************************************************************
// == Type ========================================================================
export type TokenPayload = {
 email: Profile['email'];
 profileId: Profile['id'];
}

export type AuthControllerDependencies = ControllerDependencies & {
 profileAuthPort: ProfileAuthPort;
 profileLifecycle?: ProfileLifecycle;
 profileRepositoryFactoryPort: ProfileRepositoryFactoryPort;
};
