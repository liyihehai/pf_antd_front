export const appendURL = (rootString?: string, urlString?: string) => {
  let root = rootString ?? '';
  if (root.length > 0) {
    if (root[length - 1] == '/') root = root.substring(root.length - 1);
  }
  let linkWord = '/';
  const url = urlString ?? '';
  if (url.indexOf('/') == 0) linkWord = '';
  return root + linkWord + url;
};
