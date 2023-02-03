// These are defined to use Kintone REST APIs even in Chrome Extension.
// (rest-api-client has no compatibility with Chrome Extension)

import { Record, FieldProperties, FieldLayout, Setting, App, Lang, User } from '../types/kintone';

export const getAppId = () => {
  const result = location.href.match(/k\/?m?\/(.*?)\//);
  if (result !== null && result[1] === 'guest') {
    const resultGuest = location.href.match(/k\/guest\/\d+\/?m?\/(.*?)\//);
    return resultGuest !== null ? Number(resultGuest[1]) : null;
  }
  return result !== null ? Number(result[1]) : null;
};

export const getGuestSpaceId = () => {
  const result = location.href.match(/k\/guest\/(.*?)\//);
  return result !== null ? Number(result[1]) : null;
};

// GET method client
export const get = <T>(
  url: string,
  params?: {
    [key: string]: string | number | Array<string | number>;
  }
): Promise<T> => {
  let requestURL = url;
  if (params) {
    const query = Object.entries(params)
      .reduce((prev: string[], [k, v]) => {
        if (!v) {
          return [...prev];
        }
        if (Array.isArray(v)) {
          return [...prev, ...v.map((_v, i) => `${k}[${i}]=${_v}`)];
        }
        return [...prev, `${k}=${v}`];
      }, [])
      .join('&');
    requestURL = url.match(/\?/) ? `${url}&${query}` : `${url}?${query}`;
  }
  return fetch(requestURL, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(response => {
    if (url.includes('file')) {
      return response.blob();
    }
    return response.json();
  });
};

const buildBaseURL = () => `https://${location.host}`;

const buildRequestPath = (params: { path: string; spaceId?: number | null; preview?: boolean }) => {
  const { path, spaceId, preview } = params;
  const guestSpaceId = spaceId || getGuestSpaceId();
  const guestPath = guestSpaceId ? `/guest/${guestSpaceId}` : '';
  const previewPath = preview ? '/preview' : '';
  return `/k${guestPath}/v1${previewPath}/${path.replace('/k/v1/', '').replace('.json', '')}.json`;
};

const buildRequestURL = (params: { path: string; spaceId?: number | null; preview?: boolean }) =>
  `${buildBaseURL()}${buildRequestPath(params)}`;

export const getRecords = <T extends Record>(params: {
  app: number;
  spaceId?: number | null;
  query?: string;
  fields?: string[];
}): Promise<{ records: T[] }> => {
  const { spaceId, ...rest } = params;
  const path = '/k/v1/records.json';
  const baseRequestURL = buildRequestURL({ path, spaceId });
  return get<{ records: T[] }>(baseRequestURL, { ...rest });
};

const getAllRecordsRecursiveWithId = <T extends Record>(
  params: {
    app: number;
    spaceId?: number | null;
    fields?: string[];
    condition?: string;
  },
  lastRecordID: string = '0',
  records: T[] = []
): Promise<T[]> => {
  const { spaceId, condition, ...rest } = params;
  const conditionQuery = condition ? `(${condition}) and ` : '';
  const query = `${conditionQuery}$id > ${lastRecordID} order by $id asc limit 500`;
  const path = '/k/v1/records.json';
  const baseRequestURL = buildRequestURL({ path, spaceId });
  return get<{ records: T[] }>(baseRequestURL, { ...rest, query }).then(response => {
    const newRecords = records.concat(response.records);
    if (response.records.length < 500) {
      return newRecords;
    }
    const lastRecord = response.records[response.records.length - 1];
    if (lastRecord.$id.type === '__ID__') {
      return getAllRecordsRecursiveWithId(params, lastRecord.$id.value, newRecords);
    }
    throw new Error('Missing `$id` in `getRecords` response. This error is likely caused at `kintone.ts`.');
  });
};

const recordWithBlob = (record: Record) =>
  Promise.all(
    Object.entries(record).map(([code, field]) => {
      const { type, value } = field;
      if (type === 'FILE') {
        return Promise.all(value.map(({ fileKey }) => downloadFile({ fileKey })))
          .then(blobs => {
            return value.map(({ name, contentType, fileKey }, i) => ({
              name,
              contentType,
              fileKey,
              blob: blobs[i]
            }));
          })
          .then(files => [code, { type, value: files }]);
      }
      return [code, { type, value }];
    })
  ).then(Object.fromEntries);

const getAllRecordsWithBlobsRecursiveWithId = <T extends Record>(
  params: {
    app: number;
    spaceId?: number | null;
    fields?: string[];
    condition?: string;
  },
  lastRecordID: string = '0',
  records: T[] = []
): Promise<T[]> => {
  const { spaceId, condition, ...rest } = params;
  const conditionQuery = condition ? `(${condition}) and ` : '';
  const query = `${conditionQuery}$id > ${lastRecordID} order by $id asc limit 500`;
  const path = '/k/v1/records.json';
  const baseRequestURL = buildRequestURL({ path, spaceId });
  return get<{ records: T[] }>(baseRequestURL, { ...rest, query }).then(response => {
    return response.records
      .reduce(
        (promiseChain: Promise<T[]>, record) =>
          promiseChain.then(results => recordWithBlob(record).then(result => [...results, result])),
        Promise.resolve([])
      )
      .then(recordsWithBlobs => {
        const newRecords = records.concat(recordsWithBlobs);
        if (recordsWithBlobs.length < 500) {
          return newRecords;
        }
        const lastRecord = recordsWithBlobs[recordsWithBlobs.length - 1];
        if (lastRecord.$id.type === '__ID__') {
          return getAllRecordsWithBlobsRecursiveWithId(params, lastRecord.$id.value, newRecords);
        }
        throw new Error('Missing `$id` in `getRecords` response. This error is likely caused at `kintone.ts`.');
      });
  });
};

export const getAllRecordsWithId = <T extends Record>(params: {
  app: number;
  spaceId?: number | null;
  fields?: string[];
  condition?: string;
}): Promise<T[]> => {
  const { fields: originalFields, ...rest } = params;
  let fields = originalFields;
  if (fields && fields.length > 0 && fields.indexOf('$id') === -1) {
    fields = [...fields, '$id'];
  }
  return getAllRecordsRecursiveWithId({ ...rest, fields }, '0', []);
};

export const getFormFields = <T extends FieldProperties>(params: {
  app: number;
  spaceId?: number | null;
  lang?: Lang;
  preview?: boolean;
}): Promise<{ properties: T; revision: string }> => {
  const { spaceId, preview, ...rest } = params;
  const path = '/k/v1/app/form/fields.json';
  const baseRequestURL = buildRequestURL({ path, spaceId, preview });
  return get(baseRequestURL, { ...rest });
};

export const getFormLayout = <T extends FieldLayout>(params: {
  app: number;
  spaceId?: number | null;
  preview?: boolean;
}): Promise<{ layout: T; revision: string }> => {
  const { spaceId, preview, ...rest } = params;
  const path = '/k/v1/app/form/layout.json';
  const baseRequestURL = buildRequestURL({ path, spaceId, preview });
  return get(baseRequestURL, { ...rest });
};

export const getAppSettings = (params: {
  app: number;
  spaceId?: number | null;
  lang?: Lang;
  preview?: boolean;
}): Promise<Setting> => {
  const { spaceId, preview, ...rest } = params;
  const path = '/k/v1/app/settings.json';
  const baseRequestURL = buildRequestURL({ path, spaceId, preview });
  return get(baseRequestURL, { ...rest });
};

export const getApp = (params: { app: number; spaceId?: number | null }): Promise<App> => {
  const { app, spaceId, ...rest } = params;
  const path = '/k/v1/app.json';
  const baseRequestURL = buildRequestURL({ path, spaceId });
  return get(baseRequestURL, { id: app, ...rest });
};

export const downloadFile = (params: { fileKey: string; spaceId?: number | null }): Promise<Blob> => {
  const { spaceId, ...rest } = params;
  const path = '/k/v1/file.json';
  const baseRequestURL = buildRequestURL({ path, spaceId });
  return get(baseRequestURL, { ...rest });
};

export const getAllUsers = (users: User[] = []) => {
  const path = '/v1/users.json';
  const baseRequestURL = `${buildBaseURL()}${path}`;
  return get<{ users: User[] }>(baseRequestURL, {}).then(response => {
    const newUsers = [...users, ...response.users];
    return newUsers;
  });
};
