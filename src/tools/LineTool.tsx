import { forwardRef, useContext, useImperativeHandle, useRef, useState } from "react";
import { Line } from "react-konva";
import { settingsContext } from "src/main";

export const LineTool = forwardRef(function LineTool({ stageRef, lines, setLines }, ref) {
    const settings = useContext(settingsContext)

    const isDrawing = useRef(false)
    const penId = useRef(0)
    const [points, setPoints] = useState([])

    useImperativeHandle(ref, () => {
        return {
            start,
            move,
            end
        }
    })

    function start(currentPenId: number) {
        isDrawing.current = true;
        penId.current = currentPenId;

        const pointerPosition = stageRef.current.getPointerPosition()

        setPoints([pointerPosition.x, pointerPosition.y]);
    }

    function move() {
        if (isDrawing.current) {
            const pointerPosition = stageRef.current.getPointerPosition()
            setPoints(points.concat([pointerPosition.x, pointerPosition.y]));
        }
    }

    function end() {
        if (isDrawing.current) {
            isDrawing.current = false;
            const pointerPosition = stageRef.current.getPointerPosition()

            setPoints(points.concat([pointerPosition.x, pointerPosition.y]));
            //setLines(lines.concat({penId: penId.current, points: points}));
            setLines(lines.concat({penId: penId.current, points: points}))
        }
    }

    function getPenFromId(id: number) {
        return settings.pens.find(p => p.id === id);
    }

    if (isDrawing.current) {
        return (
            <Line
                points={points}
                stroke={getPenFromId(penId.current)?.color}
                strokeWidth={getPenFromId(penId.current)?.width}
                tension={getPenFromId(penId.current)?.tension}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={'source-over'}
            />
        )
    }
})