import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

export const Table = () => {
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    let index = 1;

    useEffect(() => {
        toast("Loading.....");
        async function fetchData() {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/todos/');
                const datas = await response.json();
                setDatas(datas);
            } catch (err) {
                console.log("Error", err);
            }
            finally {
                setLoading(false);
            }
        }
        setTimeout(() => {
            fetchData();
        }, 2000);
    }, []);



    return (
        <>
            {loading && (
                // <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
                //     <p className="mt-4 text-white">Loading...</p>
                // </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            )}

            {!loading &&
                <table className="m-auto my-4">
                    <thead>
                        <tr>
                            <th className="border p-3">Id</th>
                            <th className="border p-3">Title</th>
                            <th className="border p-3">Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.filter(data => data.completed).map((data) => (
                            <tr key={data.id}>
                                <td className="border p-3">{index++}</td>
                                <td className="border p-3">{data.title}</td>
                                <td className="border border-black p-3 text-green-500">{data.completed ? "yes" : "No"}</td>
                            </tr>
                        ))}
                        {datas.filter(data => !data.completed).map((data) => (
                            <tr key={data.id}>
                                <td className="border p-3">{index++}</td>
                                <td className="border p-3">{data.title}</td>
                                <td className="border border-black p-3 text-red-500">{data.completed ? "yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};
