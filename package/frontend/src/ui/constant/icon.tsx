import type { IconBaseProps } from 'react-icons';
import { FiChevronLeft, FiHome, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';

// ********************************************************************************
export const appIcons = {
 arrowLeft: (props?: Partial<IconBaseProps>) => <FiChevronLeft {...props} />,
 home: (props?: Partial<IconBaseProps>) => <FiHome {...props} />,
 logout: (props?: Partial<IconBaseProps>) => <FiLogOut {...props} />,
 menu: (props?: Partial<IconBaseProps>) => <FiMenu {...props} />,
 profile: (props?: Partial<IconBaseProps>) => <FiUser {...props} />,
};
