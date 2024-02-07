import { useId, useLayoutEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { StorageAdapter } from "./StorageAdapter";
import { Pen } from "./Pen";

export function PergamentCanvas(
    { parent, editable, source, storageAdapter, pens, getSelectedPen }:
        { parent: HTMLElement, editable: boolean, source: string, storageAdapter: StorageAdapter, pens: Pen[], getSelectedPen: () => number }) {
    const stageRef = useRef(null);
    const id = useId();
    const [width, setWidth] = useState(parent.innerWidth);
    const height = 400;

    const isDrawing = useRef(false);
    const [lines, setLines] = useState(loadData());

    useLayoutEffect(() => {
        function updateWidth() {
            setWidth(calculateWidth());
        }
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function loadData() {
        if (source.length <= 0) {
            return [];
        }
        return JSON.parse(source);
    }

    function calculateWidth() {
        const editorWidth = parent.innerWidth;
        const contentWidth = Math.max(
            ...lines
                .map((line: { penId: number, points: number[] }, index: number) => { return line.points })
                .flat()
                //get only horizontal coordinates
                .filter((point: number, index: number) => index % 2 === 0)
        );
        return editorWidth > contentWidth ? editorWidth : contentWidth;
    };

    function handelMouseDown() {
        if (!editable) return;

        isDrawing.current = true;
        // @ts-ignore
        const pos = stageRef.current?.getPointerPosition();
        setLines([...lines, { penId: getPenFromId(getSelectedPen())?.id, points: [pos.x, pos.y] }]);
    }

    function handelMouseMove() {
        if (!editable) return;
        if (!isDrawing.current) return;

        const stage = stageRef.current;
        // @ts-ignore
        const point = stage?.getPointerPosition();
        let lastLine = lines[lines.length - 1];

        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    }

    function handleMouseUp() {
        if (!editable) return;

        isDrawing.current = false;
        storageAdapter.save(JSON.stringify(lines), id);
    }

    function getPenFromId(id: number) {
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
                {lines.map((line: { penId: number, points: number[] }, index: number) => (
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