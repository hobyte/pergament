import { Tool } from "../tools/Tool";

export function Toolbar({ pens, setSelectedPen }: { pens: Tool[]; setSelectedPen: (penId: number) => void }) {
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