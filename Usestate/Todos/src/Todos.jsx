import { useState } from "react";
import { Button } from './Button'

export const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState({});
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const add = (e) => {
        e.preventDefault();
        if (!task.text || !task.text.trim()) return;
        setTodos([...todos, task]);
        setTask({ text: "", completed: false });
    }
    const deleteTask = (todo) => {
        setSelectedTodo(todo);
        setShowModal(true);
    };

    const confirmDelete = () => {
        setTodos(todos.filter(t => t !== selectedTodo));
        setShowModal(false);
    };
    const completeTask = (todo) => {
        setTodos(todos.map(t => t === todo ? { ...t, completed: true } : t));
    }
    const editTask = (todo) => {
        setShowModalEdit(true);
        setTask({ ...todo });
        setSelectedTodo(todo);
    };

    const confirmEdit = (e) => {
        e.preventDefault();
        setTodos(todos.map(t => t === selectedTodo ? { ...t, text: task.text, completed: task.completed } : t));
        setTask({ text: "", completed: false });
        setShowModalEdit(false);
    };

    return (
        <>
            <div className="div flex items-center justify-center flex-col gap-4 mt-4 ">
                <h1 className="font-extrabold text-3xl mb-4 text-center w-full text-[#af5555]">Todo WebApp</h1>
                <form className="w-2xl flex items-end" onSubmit={add}>
                    <input placeholder="Enter a new task" className="bg-[#ffe9bf] outline-0 mr-4  px-4 py-2 rounded-xl h-10 w-full" type="text" name="task" id="task" onChange={(e) => setTask({ text: e.target.value, completed: false })} />
                    <Button color="bg-blue-300" btnName="Add"></Button>
                </form>
                <table className="w-2xl bg-white">
                    <thead>
                        <tr>
                            <th className="border p-3">SN</th>
                            <th className="border p-3 w-44">Status</th>
                            <th className="border p-3">Tasks</th>
                            <th className="border p-3 min-w-2xs">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {todos.map((todo, index) => (
                            <tr key={index}>
                                <td className="border p-3 text-center">{index + 1}</td>
                                <td className={`border border-black p-3 text-center ${todo.completed ? "text-green-600" : "text-orange-400"}`}>{todo.completed ? "Completed" : "Pending"} </td>
                                <td className="border p-3 text-center capitalize">{todo.text}</td>
                                <td className="border p-3 text-center gap-2"> {!todo.completed && <Button onClick={() => completeTask(todo)} color="bg-green-300" btnName="Complete"></Button>}
                                    <Button onClick={() => editTask(todo)} color="bg-orange-300" btnName="Edit"></Button> <Button onClick={() => deleteTask(todo)} color="bg-red-400" btnName="Delete"></Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            {showModal &&
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)] backdrop-blur-sm">
                    <div className="deleteConfirm flex flex-col justify-center items-center w-2xs h-25 rounded-xl bg-gray-500">
                        <p className="text-white mb-2">Do you want delete this task?</p>
                        <div className=" flex gap-2 justify-center w-87.5">
                            <Button color="bg-green-300" onClick={confirmDelete} btnName="Yes"></Button>
                            <Button onClick={() => setShowModal(false)} color="bg-red-400" btnName="No"></Button>
                        </div>
                    </div>

                </div>
            }
            {showModalEdit &&
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)] backdrop-blur-sm">
                    <div className="deleteConfirm flex flex-col justify-center items-center w-110 h-35 rounded-xl bg-gray-500">
                        <form onSubmit={confirmEdit} className=" w-87.5 flex justify-center items-center gap-4">
                            <input
                                className="bg-amber-100 outline-0 px-4 py-2 rounded-xl h-10 my-4"
                                type="text"
                                value={task.text}
                                placeholder="Enter a name for task"
                                onChange={(e) => setTask({ text: e.target.value, completed: false })}
                            />
                            <div className="flex justify-center items-center gap-2">
                                <input className="aspect-square h-5 accent-green-500" type="checkbox" name="uncheck" id="uncheck" checked={task.completed} onChange={() => setTask({ ...task, completed: !task.completed })} />
                                <label htmlFor="uncheck" className="text-white">Completed</label>
                            </div>
                        </form>

                        <div className=" flex gap-2 w-87.5 justify-start">
                            <Button color="bg-green-300" onClick={confirmEdit} btnName="Save changes"></Button>
                            <Button onClick={() => setShowModalEdit(false)} color="bg-red-400" btnName="Cancel edit"></Button>
                        </div>
                    </div>

                </div>
            }
        </>
    );
};
