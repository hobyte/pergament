import { Rect } from "konva/lib/shapes/Rect";
import { useRef } from "react";
import { Stage, Layer } from "react-konva";

export function PergamentCanvas() {
    const width = window.innerWidth;
    const height = 400;
    let stageRef = useRef(null);

    const handleClick = (event) => {
        const stage = stageRef.current
        if (!stage) {
            console.log('stage is null');
            return
        }
        const layer = stage.getLayers()[0];
        const pos = stage.getPointerPosition();
        const rect = new Rect({
            x: pos.x,
            y: pos.y,
            width: 100,
            height: 100,
            fill: 'red',
            draggable: true
        });
        layer.add(rect);
    }

    return (
        <Stage
            className="pergament-stage"
            width={width}
            height={height}
            onClick={handleClick}
            ref={stageRef}
        >
            <Layer>
            </Layer>
        </Stage>
    );
};