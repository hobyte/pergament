import { useId, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { StorageAdapter } from "./StorageAdapter";
import { Pen } from "./Pen";

export function PergamentCanvas(
        { parent, editable, source, storageAdapter, pens, getSelectedPen }: 
        { parent: HTMLElement, editable: boolean, source: string, storageAdapter: StorageAdapter, pens: Pen[], getSelectedPen: () => number }) {
    const stageRef = useRef(null);
    const id = useId();
    const width = parent.innerWidth;
    const height = 400;

    const isDrawing = useRef(false);
    const [lines, setLines] = useState(source.length > 0 ? JSON.parse(source) : []);

    const handelMouseDown = () => {
        if (!editable) return;

        isDrawing.current = true;
        const pos = stageRef.current?.getPointerPosition();
        setLines([...lines, { penId: getPenFromId(getSelectedPen())?.id, points: [pos.x, pos.y] }]);
    }

    const handelMouseMove = () => {
        if (!editable) return;
        if (!isDrawing.current) return;

        const stage = stageRef.current;
        const point = stage?.getPointerPosition();
        let lastLine = lines[lines.length - 1];

        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    }

    const handleMouseUp = () => {
        if (!editable) return;

        isDrawing.current = false;
        storageAdapter.save(JSON.stringify(lines), id);
    }

    const getPenFromId = (id: number) => {
        return pens.find(p => p.id === id);
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
                {lines.map((line: {penId: number, points: number[]}, index: number) => (
                    <Line
                        key={index}
                        points={line.points}
                        stroke={getPenFromId(line.penId)?.color}
                        strokeWidth={getPenFromId(line.penId)?.width}
                        tension={getPenFromId(line.penId)?.tension}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={'source-over'}
                    />
                ))}
            </Layer>
        </Stage>
    );
};