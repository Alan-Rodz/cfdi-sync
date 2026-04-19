import { useState } from 'react';

// ********************************************************************************
// == Type ========================================================================
export type DrawerDisclosure = ReturnType<typeof useDrawerDisclosure>;

// == Hook ========================================================================
export const useDrawerDisclosure = () => {
 // -- State -----------------------------------------------------------------------
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);

 // -- Handler ---------------------------------------------------------------------
 const onDrawerOpen = () => setIsDrawerOpen(true);
 const onDrawerClose = () => setIsDrawerOpen(false);

 // -- Return ----------------------------------------------------------------------
 return { isDrawerOpen, onDrawerOpen, onDrawerClose };
};
