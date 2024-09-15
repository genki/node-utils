export const skip = (...reason:any[]) => {
  if (!import.meta.env.TEST && import.meta.env.DEV) console.warn(...reason);
  return undefined;
}
export const fail = (...reason:any[]) => {
  skip(...reason);
  return false;
};
export function raise(reason:string, ...args:any[]):never {
  console.error(reason, ...args);
  throw Error(reason);
}
