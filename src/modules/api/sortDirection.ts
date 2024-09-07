import { Static } from '@sinclair/typebox';
import { StringEnum } from '../../types';

export type SortDirection = Static<typeof sortDirectionSchema>;
export const sortDirectionSchema = StringEnum(['asc', 'desc', 'none']);
