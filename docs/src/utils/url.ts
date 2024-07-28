const pathEqual = (path1: string, path2: string) =>
  path1.replace(/\/$/, "") === path2.replace(/\/$/, "");

export default pathEqual;
