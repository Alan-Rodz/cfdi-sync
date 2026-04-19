import { useState } from 'react';

// ********************************************************************************
// == Type ========================================================================
export type MenuDisclosure = ReturnType<typeof useMenuDisclosure>;

// == Hook ========================================================================
export const useMenuDisclosure = () => {
 // -- State -----------------------------------------------------------------------
 const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

 // -- Handler ---------------------------------------------------------------------
 const handleOpenMenu = (target: HTMLElement) => setMenuAnchor(target);
 const handleCloseMenu = () => setMenuAnchor(null);

 // -- Return ----------------------------------------------------------------------
 return { isMenuOpen: Boolean(menuAnchor), menuAnchor, handleCloseMenu, handleOpenMenu };
};
