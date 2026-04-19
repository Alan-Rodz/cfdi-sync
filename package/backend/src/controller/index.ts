import { AuthController } from './auth/AuthController';
import { Controller } from './Controller';
import { ControllerDependencies } from './type';

// ********************************************************************************
// == Factory =====================================================================
export const getControllers = (dependencies: ControllerDependencies): Controller[] => {
 return [
  new AuthController(dependencies),
 ];
};
