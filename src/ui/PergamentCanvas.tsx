import { useId, useLayoutEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { StorageAdapter } from "../StorageAdapter";
import { Pen } from "../Pen";
import { Background } from "./Background";
import { PergamentSettings } from "../settings";

export function PergamentCanvas(
    { parent, editable, source, storageAdapter, pens, getSelectedPen, settings }:
        { parent: HTMLElement, editable: boolean, source: string, storageAdapter: StorageAdapter, pens: Pen[], getSelectedPen: () => number, settings: PergamentSettings }) {
    const stageRef = useRef(null);
    const id = useId();
    const lineHeigth = getLineHeigth()
    const [width, setWidth] = useState(parent.innerWidth);
    const height = 400;

    const isDrawing = useRef(false);
    const [lines, setLines] = useState<[{ penId: number, points: number[] }]>(convertFromSource());

    useLayoutEffect(() => {
        function updateWidth() {
            setWidth(calculateWidth());
        }
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    function getLineHeigth() {
        const height = parseInt(getComputedStyle(parent).getPropertyValue('line-height'));
        if (!isNaN(height)) {
            return height
        } else {
            //return default value
            return 24
        }
    }

    function convertFromSource() {
        if (source.length <= 0) {
            return [];
        }
        let converted_source = JSON.parse(source);
        converted_source.forEach((line: { penId: number, points: number[] }, index: number) => {
            line.points = line.points.map((point: number, index: number) => {
                return point * lineHeigth;
            })
        });
        return converted_source;
    }

    function convertDataToString() {
        let converted_source = lines.map((line: { penId: number, points: number[] }, index: number) => {
            line.points = line.points.map((point: number, index: number) => {
                return point / lineHeigth;
            })
            return line;
        });
        return JSON.stringify(converted_source);
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
        storageAdapter.save(convertDataToString(), id);
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
            <Background
                width={width}
                height={height}
                settings={settings}
                lineHeight={lineHeigth}
            />
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