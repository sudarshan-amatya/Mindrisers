let courses = [
    {
        name: "html",
        duration: "1 weeks",
        status: true,
    },
    {
        name: "css",
        duration: "1 weeks",
        status: true,
    },
    {
        name: "js",
        duration: "2 weeks",
        status: true,
    },
];
export default function Numbers() {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course=>(
                        <tr>
                            <td>{course.name}</td>
                            <td>{course.duration}</td>
                            <td>{course.status?"Active":"Inactive"}</td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
        </>
    );

}