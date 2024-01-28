import { KonvaEventObject } from "konva/lib/Node";
import { useId, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { StorageAdapter } from "./StorageAdapter";

export function PergamentCanvas({ editable, source, storageAdapter }: { editable: boolean, source: string, storageAdapter: StorageAdapter }) {
    const id = useId();
    const width = window.innerWidth;
    const height = 400;

    const isDrawing = useRef(false);
    const [lines, setLines] = useState(source.length > 0 ? JSON.parse(source) : []);
    let stageRef = useRef(null);

    const handelMouseDown = (event: KonvaEventObject<MouseEvent>) => {
        if (!editable) return;

        isDrawing.current = true;
        const pos = stageRef.current?.getPointerPosition();
        setLines([...lines, { color: window.selectedColor, points: [pos.x, pos.y] }]);
    }

    const handelMouseMove = (event: KonvaEventObject<MouseEvent>) => {
        if (!editable) return;
        if (!isDrawing.current) return;

        const stage = stageRef.current;
        const point = stage?.getPointerPosition();
        let lastLine = lines[lines.length - 1];

        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    }

    const handleMouseUp = (event: KonvaEventObject<MouseEvent>) => {
        if (!editable) return;

        isDrawing.current = false;
        storageAdapter.save(JSON.stringify(lines), id);
    }

    const calculateColor = (source: string) => {
        switch (source) {
            case 'red':
                return '#fd0802';
            case 'green':
                return '#07f80a';
            case 'blue':
                return '#0a99f5';
            default:
                return '#eaff00';
        }
    }

    return (
        <Stage
            className="pergament-stage"
            id={id}
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
                        stroke={calculateColor(line.color)}
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