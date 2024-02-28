import { Pen } from "../Pen";

export function Toolbar({ pens, setSelectedPen }: { pens: Pen[]; setSelectedPen: (penId: number) => void }) {
    return (
      <div>
        {
          pens.map(pen => (
            <button key={pen.id} onClick={() => setSelectedPen(pen.id)}>
              {pen.name}
            </button>
          ))
        }
      </div>
    )
  }