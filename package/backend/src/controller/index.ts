import { AuthController } from './auth/AuthController';
import { AuthControllerDependencies } from './auth/type';
import { Controller } from './Controller';
import { ControllerDependencies } from './type';

// == Type ========================================================================
type ControllerRegistryDependencies = ControllerDependencies & {
 auth: Omit<AuthControllerDependencies, keyof ControllerDependencies>;
};

// ********************************************************************************
// == Factory =====================================================================
export const getControllers = (dependencies: ControllerRegistryDependencies): Controller[] => {
 return [
  new AuthController({
   ...dependencies.auth,
   t: dependencies.t,
  }),
 ];
};
