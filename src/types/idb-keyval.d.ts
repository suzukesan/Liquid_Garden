declare module 'idb-keyval' {
  export function set<T = any>(key: IDBValidKey, value: T, store?: IDBObjectStore): Promise<void>
  export function get<T = any>(key: IDBValidKey, store?: IDBObjectStore): Promise<T | undefined>
} 