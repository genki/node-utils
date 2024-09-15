// Note: Stringify JSON in stable order.
type Options = {
  cmp?: (a:any, b:any) => number;
  cycles?: boolean;
}
export function stringify(data:any, opts:Options = {}) {
  if (typeof opts === 'function') opts = { cmp: opts };
  const cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
  const cmp = opts.cmp && (function (f) {
    return function <T extends Record<PropertyKey,any>>(node:T) {
      return function (a:PropertyKey, b:PropertyKey) {
        const aobj = { key: a, value: node[a] };
        const bobj = { key: b, value: node[b] };
        return f(aobj, bobj);
      };
    };
  })(opts.cmp);

  const seen:object[] = [];
  return (function stringify (node) {
    if (node && node.toJSON && typeof node.toJSON === 'function') {
      node = node.toJSON();
    }

    if (node === undefined) return '';
    if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
    if (typeof node !== 'object') return JSON.stringify(node);

    let i:number, out:string;
    if (Array.isArray(node)) {
      out = '[';
      for (i = 0; i < node.length; i++) {
        if (i) out += ',';
        out += stringify(node[i]) || 'null';
      }
      return out + ']';
    }

    if (node === null) return 'null';

    if (seen.indexOf(node) !== -1) {
      if (cycles) return JSON.stringify('__cycle__');
      throw new TypeError('Converting circular structure to JSON');
    }

    const seenIndex = seen.push(node) - 1;
    const keys = Object.keys(node).sort(cmp && cmp(node));
    out = '';
    for (i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = stringify(node[key]);

      if (!value) continue;
      if (out) out += ',';
      out += JSON.stringify(key) + ':' + value;
    }
    seen.splice(seenIndex, 1);
    return '{' + out + '}';
  })(data);
}
