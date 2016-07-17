function log() {

}

export function clean() {
  return log.apply(arguments);
}

export function dirty() {
  return log.apply(arguments);
}
