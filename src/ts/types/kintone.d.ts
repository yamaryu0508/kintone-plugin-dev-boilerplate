import { KintoneRecordField, KintoneFormFieldProperty, KintoneFormLayout } from '@kintone/rest-api-client';

export type Lang = 'ja' | 'en' | 'zh' | 'user' | 'default';

export type Field = KintoneRecordField.OneOf;
export type File = KintoneRecordField.File | { value: Array<{ blob: Blob }> };

export type Record = {
  [code: string]: Field;
};

export type FieldProperty = KintoneFormFieldProperty.OneOf;

export type FieldProperties = {
  [code: string]: FieldProperty;
};

export type FieldLayoutOneOf = KintoneFormLayout.OneOf;

export type FieldLayout = FieldLayoutOneOf[];

// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/types/app/index.ts
export type App = {
  appId: string;
  code: string;
  name: string;
  description: string;
  spaceId: string | null;
  threadId: string | null;
  createdAt: string;
  creator: { code: string; name: string };
  modifiedAt: string;
  modifier: {
    code: string;
    name: string;
  };
};

// https://github.com/kintone/js-sdk/blob/master/packages/rest-api-client/src/client/AppClient.ts
export type Setting = {
  name: string;
  description: string;
  icon:
    | {
        type: 'FILE';
        file: {
          contentType: string;
          fileKey: string;
          name: string;
          size: string;
        };
      }
    | { type: 'PRESET'; key: string };
  theme: 'WHITE' | 'CLIPBOARD' | 'BINDER' | 'PENCIL' | 'CLIPS' | 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK';
  revision: string;
};

export type User = {
  birthDate: string | null;
  callto: string;
  code: string;
  ctime: string;
  customItemValues: Array<{
    code: string;
    value: string;
  }>;
  description: string;
  email: string;
  employeeNumber: string;
  extensionNumber: string;
  givenName: string;
  givenNameReading: string | null;
  id: string;
  joinDate: string | null;
  localName: string;
  localNameLocale: string;
  locale: string | null;
  mobilePhone: string;
  mtime: string | null;
  name: string;
  phone: string;
  primaryOrganization: string;
  sortOrder: string | null;
  surName: string;
  surNameReading: string | null;
  timezone: string;
  url: string;
  valid: boolean;
};
