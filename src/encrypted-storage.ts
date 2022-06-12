import { NativeModules, Platform } from 'react-native';

type StorageErrorCallback = (error: Error | null) => void;
type StorageValueCallback<T> = (error: Error | null, value?: T) => void;

const LINKING_ERROR =
  `The package 'react-native-encrypted-storage' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const fallback = new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  },
});

const module = NativeModules.EncryptedStorage
  ? NativeModules.EncryptedStorage
  : fallback;

function getAllKeys(): Promise<Array<string>>;
function getAllKeys(cb: StorageValueCallback<Array<string>>): void;
function getAllKeys(cb?: StorageValueCallback<Array<string>>) {
  if (cb) {
    void module.getAllKeys()
      .then((output: Array<string>) => cb(null, output))
      .catch(cb);
  } else {
    return module.getAllKeys();
  }
}

function getItem(key: string): Promise<string>;
function getItem(key: string, cb: StorageValueCallback<string>): void;
function getItem(key: string, cb?: StorageValueCallback<string>) {
  const promise = module.multiGet([key]);

  if (cb) {
    void promise
      .then((output: Array<string>) => cb(null, output[0]))
      .catch(cb);
  } else {
    return promise
      .then((output: Array<string>) => output[0]);
  }
}

function setItem(key: string, value: string): Promise<void>;
function setItem(key: string, value: string, cb: StorageErrorCallback): void;
function setItem(key: string, value: string, cb?: StorageErrorCallback) {
  const promise = module.multiSet([[key, value]]);

  if (cb) {
    void promise.then(cb).catch(cb);
  } else {
    return promise;
  }
}

function removeItem(key: string): Promise<void>;
function removeItem(key: string, cb: StorageErrorCallback): void;
function removeItem(key: string, cb?: StorageErrorCallback) {
  const promise = module.multiRemove([key]);

  if (cb) {
    void promise.then(cb).catch(cb);
  } else {
    return promise;
  }
}

function multiGet(keys: Array<string>): Promise<Array<string>>;
function multiGet(keys: Array<string>, cb: StorageValueCallback<Array<string>>): void;
function multiGet(keys: Array<string>, cb?: StorageValueCallback<Array<string>>) {
  const promise = module.multiGet(keys);

  if (cb) {
    void promise
      .then((output: Array<string>) => cb(null, output))
      .catch(cb);
  } else {
    return promise;
  }
}

function multiSet(items: Array<[string, string]>): Promise<void>;
function multiSet(items: Array<[string, string]>, cb: StorageErrorCallback): void;
function multiSet(items: Array<[string, string]>, cb?: StorageErrorCallback) {
  const promise = module.multiSet(items);

  if (cb) {
    void promise.then(cb).catch(cb);
  } else {
    return promise;
  }
}

function multiRemove(keys: Array<string>): Promise<void>;
function multiRemove(keys: Array<string>, cb: StorageErrorCallback): void;
function multiRemove(keys: Array<string>, cb?: StorageErrorCallback) {
  const promise = module.multiRemove(keys);

  if (cb) {
    void promise.then(cb).catch(cb);
  } else {
    return promise;
  }
}

function clear(): Promise<void>
function clear(cb: StorageErrorCallback): void
function clear(cb?: StorageErrorCallback) {
  const promise = module.clear();

  if (cb) {
    void promise.then(cb).catch(cb);
  } else {
    return promise;
  }
}

export const EncryptedStorage = {
  getAllKeys,
  getItem,
  setItem,
  removeItem,
  multiGet,
  multiSet,
  multiRemove,
  clear,
}