export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 20, 30] as const;
export const MAX_PAGE_SIZE = 30;

export function normalizePageSize(value: string | undefined) {
    const parsed = Number(value);
    return PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number]) && parsed <= MAX_PAGE_SIZE
        ? parsed
        : DEFAULT_PAGE_SIZE;
}
