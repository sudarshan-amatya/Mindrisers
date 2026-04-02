import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";

const API_URL = "http://localhost:8000/todos";

export const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState({ text: "", completed: false });
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);

    // FETCH TODOS FROM DB
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await axios.get(API_URL);
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // ADD TODO
    const add = async (e) => {
        e.preventDefault();
        if (!task.text.trim()) return;

        try {
            const res = await axios.post(API_URL, task);
            setTodos([...todos, res.data]); // use DB response
            setTask({ text: "", completed: false });
        } catch (err) {
            console.error(err);
        }
    };

    // DELETE TODO
    const deleteTask = (todo) => {
        setSelectedTodo(todo);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${selectedTodo.id}`);
            setTodos(todos.filter((t) => t.id !== selectedTodo.id));
            setShowModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    // COMPLETE TODO
    const completeTask = async (todo) => {
        try {
            const res = await axios.put(`${API_URL}/${todo.id}`, {
                ...todo,
                completed: true,
            });

            setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
        } catch (err) {
            console.error(err);
        }
    };

    // EDIT TODO
    const editTask = (todo) => {
        setSelectedTodo(todo);
        setTask({ text: todo.text, completed: todo.completed });
        setShowModalEdit(true);
    };

    const confirmEdit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(`${API_URL}/${selectedTodo.id}`, task);
            setTodos(todos.map((t) => (t.id === selectedTodo.id ? res.data : t)));
            setShowModalEdit(false);
            setTask({ text: "", completed: false });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="div flex items-center justify-center flex-col gap-4 mt-4 ">
                <h1 className="font-extrabold text-3xl mb-4 text-center w-full text-[#af5555]">
                    Todo WebApp
                </h1>

                <form className="w-2xl flex items-end" onSubmit={add}>
                    <input
                        placeholder="Enter a new task"
                        className="bg-[#ffe9bf] outline-0 mr-4 px-4 py-2 rounded-xl h-10 w-full"
                        type="text"
                        value={task.text}
                        onChange={(e) =>
                            setTask({ text: e.target.value, completed: false })
                        }
                    />
                    <Button color="bg-blue-300" btnName="Add" />
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
                            <tr key={todo.id}>
                                <td className="border p-3 text-center">{index + 1}</td>
                                <td
                                    className={`border border-black p-3 text-center ${todo.completed
                                            ? "text-green-600"
                                            : "text-orange-400"
                                        }`}
                                >
                                    {todo.completed ? "Completed" : "Pending"}
                                </td>
                                <td className="border p-3 text-center capitalize">
                                    {todo.text}
                                </td>
                                <td className="border p-3 text-center gap-2">
                                    {!todo.completed && (
                                        <Button
                                            onClick={() => completeTask(todo)}
                                            color="bg-green-300"
                                            btnName="Complete"
                                        />
                                    )}
                                    <Button
                                        onClick={() => editTask(todo)}
                                        color="bg-orange-300"
                                        btnName="Edit"
                                    />
                                    <Button
                                        onClick={() => deleteTask(todo)}
                                        color="bg-red-400"
                                        btnName="Delete"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DELETE MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)] backdrop-blur-sm">
                    <div className="deleteConfirm flex flex-col justify-center items-center w-2xs h-25 rounded-xl bg-gray-500">
                        <p className="text-white mb-2">
                            Do you want delete this task?
                        </p>
                        <div className="flex gap-2 justify-center w-87.5">
                            <Button color="bg-green-300" onClick={confirmDelete} btnName="Yes" />
                            <Button
                                onClick={() => setShowModal(false)}
                                color="bg-red-400"
                                btnName="No"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {showModalEdit && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)] backdrop-blur-sm">
                    <div className="deleteConfirm flex flex-col justify-center items-center w-110 h-35 rounded-xl bg-gray-500">
                        <form
                            onSubmit={confirmEdit}
                            className="w-87.5 flex justify-center items-center gap-4"
                        >
                            <input
                                className="bg-amber-100 outline-0 px-4 py-2 rounded-xl h-10 my-4"
                                type="text"
                                value={task.text}
                                onChange={(e) =>
                                    setTask({ ...task, text: e.target.value })
                                }
                            />

                            <div className="flex justify-center items-center gap-2">
                                <input
                                    className="aspect-square h-5 accent-green-500"
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() =>
                                        setTask({ ...task, completed: !task.completed })
                                    }
                                />
                                <label className="text-white">Completed</label>
                            </div>
                        </form>

                        <div className="flex gap-2 w-87.5 justify-start">
                            <Button
                                color="bg-green-300"
                                onClick={confirmEdit}
                                btnName="Save changes"
                            />
                            <Button
                                onClick={() => setShowModalEdit(false)}
                                color="bg-red-400"
                                btnName="Cancel edit"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
