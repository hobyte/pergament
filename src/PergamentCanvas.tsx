import { KonvaEventObject } from "konva/lib/Node";
import { useId, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { StorageAdapter } from "./StorageAdapter";

export function PergamentCanvas({ editable, source, storageAdapter }: { editable: boolean, source: string, storageAdapter: StorageAdapter }) {
    const id = useId();
    const width = window.innerWidth;
    const height = 400;

    const isDrawing = useRef(false);
    const [lines, setLines] = useState([]);
    let stageRef = useRef(null);

    const handelMouseDown = (event: KonvaEventObject<MouseEvent>) => {
        if (!editable) return;

        isDrawing.current = true;
        const pos = stageRef.current?.getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
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
        console.log(typeof stageRef.current);
        

        isDrawing.current = false;
        storageAdapter.save(JSON.stringify(lines), id);
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