import { useContext, useId, useLayoutEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { StorageAdapter } from "../StorageAdapter";
import { Background } from "./Background";
import { settingsContext } from "src/main";
import { LineTool } from "src/tools/LineTool";

export function PergamentCanvas(
    { parent, editable, source, storageAdapter, getSelectedPen }:
        { parent: HTMLElement, editable: boolean, source: string, storageAdapter: StorageAdapter, getSelectedPen: () => number }) {
    const stageRef = useRef(null);
    const settings = useContext(settingsContext)
    const id = useId();

    const lineHeigth = getLineHeigth()
    const [lines, setLines] = useState<[{ penId: number, points: number[] }]>(convertFromSource());
    const [width, setWidth] = useState(parent.innerWidth);
    const height = 400;

    const lineToolRef = useRef(null);

    storageAdapter.save(convertDataToString(), id)

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
        let convertedSource = JSON.parse(source);
        convertedSource.forEach((line: { penId: number, points: number[] }, index: number) => {
            line.points = line.points.map((point: number, index: number) => {
                return point;
            })
        });
        return convertedSource;
    }

    function convertDataToString() {
        let convertedSource = lines.map((line: { penId: number, points: number[] }, index: number) => {
            line.points = line.points.map((point: number, index: number) => {
                return point;
            })
            return line;
        });
        return JSON.stringify(convertedSource);
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

        stageRef.current

        lineToolRef.current?.start(getSelectedPen())
    }

    function handelMouseMove() {
        if (!editable) return;

        lineToolRef.current?.move()
    }

    function handleMouseUp() {
        if (!editable) return;

        lineToolRef.current?.end()

    }

    function getPenFromId(id: number) {
        return settings.pens.find(p => p.id === id);
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
            <Layer>
                <LineTool
                    ref={lineToolRef}
                    stageRef={stageRef}
                    lines={lines}
                    setLines={setLines}
                />
            </Layer>
        </Stage>
    );
};
