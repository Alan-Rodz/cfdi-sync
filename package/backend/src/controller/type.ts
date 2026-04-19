import { SupabaseClient } from '@supabase/supabase-js';

import { Database, LocaledTranslationFn } from 'common';

// ********************************************************************************
export type ControllerResponse<T = null> = {
 data: T | null;
 message: string;
 token?: string;
};

export type ControllerDependencies = {
 client: SupabaseClient<Database>;
 t: LocaledTranslationFn;
};
