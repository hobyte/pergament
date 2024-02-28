function stringToLines(source: string) {
    if (source.length <= 0) {
        return [];
    }
    let convertedSource = JSON.parse(source);
    convertedSource.forEach((line: { penId: number, points: number[] }, index: number) => {
        line.points = line.points.map((point: number, index: number) => {
            return point;
        })
    });
    return convertedSource;
}

function linesToString(lines: [{ penId: number, points: number[] }]) {
    let jsonLines = lines.map((line: { penId: number, points: number[] }, index: number) => {
        line.points = line.points.map((point: number, index: number) => {
            return point;
        })
        return line;
    });
    return JSON.stringify(jsonLines);
}
