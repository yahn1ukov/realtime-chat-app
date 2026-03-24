export function transformURL(path: string, id: string): string {
  return path.replace(":id", id);
}
