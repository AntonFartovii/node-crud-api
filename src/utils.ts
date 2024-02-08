export function parsePathExpress(path?: string) {
  if (!path) {
    return '';
  }
  const chunks = path.split('/');
  const mainPath = '/' + chunks[1];
  const routePath = '/' + chunks.slice(2).join('/');

  return [mainPath, routePath];
}
