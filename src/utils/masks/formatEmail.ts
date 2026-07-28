export function formatEmail(value: string): string {
    return value
        .replace(/\s/g, "")
        .replace(/[^a-zA-Z0-9.@_+-]/g, "")
        .toLowerCase();
}
