import {createContext, useContext} from 'react';
import type {AdProps} from './props';

export const AdPropsContext = createContext<AdProps>({draft: true, showSafeZones: false});
export const useAdProps = () => useContext(AdPropsContext);
