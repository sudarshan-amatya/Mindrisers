import { useState } from "react"

export default function Counter() {
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(count + 1);
    }
    const decrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
        return;
    }
    const reset = () => {
        setCount(0);
    }
    return (
        <>
            <h2>Count: {count}</h2>
            <div>
                <button onClick={increment}>Increase</button>
                <button onClick={reset}>Reset</button>
                <button onClick={decrement}>Decrease</button>
            </div>
        </>
    )
}
