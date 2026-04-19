import type { IconBaseProps } from 'react-icons';
import { FiHome, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';

// ********************************************************************************
export const appIcons = {
 home: (props?: Partial<IconBaseProps>) => <FiHome {...props} />,
 logout: (props?: Partial<IconBaseProps>) => <FiLogOut {...props} />,
 menu: (props?: Partial<IconBaseProps>) => <FiMenu {...props} />,
 profile: (props?: Partial<IconBaseProps>) => <FiUser {...props} />,
};
