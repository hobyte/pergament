import { Layer, Line } from "react-konva";
import { Pattern, PergamentSettings } from "./settings";

export function Background({ width, height, lineHeight, settings }: { width: number, height: number, lineHeight: number, settings: PergamentSettings }) {
    let lineKey = 0
    const lines: JSX.Element[] = []
    const lineDistance = lineHeight * settings.backgroundSize
    
    const horizontalCount = Math.ceil(width / settings.backgroundSize);
    const verticalCount = Math.ceil(height / settings.backgroundSize);

    const horizontalCoords = Array.from(Array(horizontalCount).keys()).map(x => x * lineDistance)
    const verticalCoords = Array.from(Array(verticalCount).keys()).map(x => x * lineDistance)

    //horizontal lines
    if (settings.backgroundPattern == Pattern.line || settings.backgroundPattern == Pattern.grid) {
        verticalCoords.forEach((cord: number) => {
            lineKey ++;
            lines.push(
                <Line
                    key={lineKey}
                    points={[0, cord, width, cord]}
                    stroke={'#808080'}
                    strokeWidth={1}
                >
                </Line>
            )
        })
    }

    //vetical lines
    if (settings.backgroundPattern == Pattern.grid) {
        horizontalCoords.forEach((cord: number) => {
            lineKey ++;
            lines.push(
                <Line
                    key={lineKey}
                    points={[cord, 0, cord, height]}
                    stroke={'#808080'}
                    strokeWidth={1}
                >
                </Line>
            )
        })
    }

    return (
        <Layer>
            {lines}
        </Layer>
    )
}