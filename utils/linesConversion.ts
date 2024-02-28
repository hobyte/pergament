export function stringToLines(source: string) {
    if (source.length <= 0) {
        return [];
    }
    let convertedSource = JSON.parse(source);
    convertedSource.forEach((line: { penId: number, points: number[] }) => {
        line.points = line.points.map((point: number) => {
            return point;
        })
    });
    return convertedSource;
}

export function linesToString(lines: [{ penId: number, points: number[] }]) {
    let jsonLines = lines.map((line: { penId: number, points: number[] }) => {
        line.points = line.points.map((point: number) => {
            return point;
        })
        return line;
    });
    return JSON.stringify(jsonLines);
}
