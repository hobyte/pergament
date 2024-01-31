export function Toolbar() {
    return (
      <div>
        <button onClick={() => {window.selectedColor = 'red'}}>Red</button>
        <button onClick={() => {window.selectedColor = 'green'}}>Green</button>
        <button onClick={() => {window.selectedColor = 'blue'}}>Blue</button>
      </div>
    )
  }