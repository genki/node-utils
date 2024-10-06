export const skip = (...reason:any[]) => {
  if (!process.env.TEST && process.env.DEV) console.warn(...reason);
  return undefined;
}
export const fail = (...reason:any[]):false => {
  skip(...reason);
  return false;
};
export function raise(reason:string, ...args:any[]):never {
  console.error(reason, ...args);
  throw Error(reason);
}
