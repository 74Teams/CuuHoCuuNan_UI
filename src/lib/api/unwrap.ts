/** Lấy id từ DTO backend (camelCase hoặc PascalCase) */
export function unwrapEntityId(
  data: { id?: string; Id?: string } | null | undefined,
): string {
  if (!data) return "";
  return String(data.id ?? data.Id ?? "");
}
