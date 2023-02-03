import { App, Setting } from './kintone.d';
import { base64 } from '../assets/kintoneDefaultIcons';

type TypeOfBase64 = typeof base64;
export type Base64Icons = keyof TypeOfBase64;

export type ExpandedApp = App & Setting & { icon: { data: string } } & { app: number; guestSpaceId: number | null };
