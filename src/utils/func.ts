export function parseName(str: string) {
    const parts = str.split('|');
    return parts[0].trim();
}

export function parseDeparture(str: string) {
    const parts = str.split('|');
    return parts[1].trim();
}