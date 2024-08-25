export function sql(strings: TemplateStringsArray, ...values: string[]) {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (values[i] || '');
  });
  return str;
}
