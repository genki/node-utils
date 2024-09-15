export const digest32 = async (data:BufferSource) => {
  const hash = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hash);
}

// compute the 32 byte hash value for the msg
export const hash32 = async (msg:string) => {
  const enc = new TextEncoder();
  return await digest32(enc.encode(msg));
}
