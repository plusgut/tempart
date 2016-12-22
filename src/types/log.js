export function clean() {
  console.log.apply(console, arguments);

  return '';
}

export function dirty() {
  console.log.apply(console, arguments);

  return '';
}
