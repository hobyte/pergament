import { Rect } from "konva/lib/shapes/Rect";
import { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

export function PergamentCanvas({ editable, source }: { editable: boolean, source: string }) {
    const width = window.innerWidth;
    const height = 400;
    const isDrawing = useRef(false);
    const [lines, setLines] = useState([]);
    let stageRef = useRef(null);

    const handelMouseDown = (event) => {
        if (!editable) return;

        isDrawing.current = true;
        const pos = stageRef.current?.getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
    }

    const handelMouseMove = (event) => {
        if (!editable) return;
        if (!isDrawing.current) return;

        const stage = stageRef.current;
        const point = stage?.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    }

    const handleMouseUp = (event) => {
        if (!editable) return;

        isDrawing.current = false;
    }

    return (
        <Stage
            className="pergament-stage"
            width={width}
            height={height}
            ref={stageRef}
            onMouseDown={handelMouseDown}
            onMouseMove={handelMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke="#df4b26"
                        strokeWidth={5}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={'source-over'}
                    />
                ))}
            </Layer>
        </Stage>
    );
};