
const Home = () => {
  let courses = [
    {
      name: "express",
      description:
        "js is sum dolor sit amet consectetur adipisicing elit. Sit dolore min",
      duration: "2 weeks",
      status: false,
      image: "https://placehold.co/200",
    },
    {
      name: "html",
      description:
        "html is m dolor sit amet consectetur adipisicing elit. Sit dolore min",
      duration: "1 weeks",
      status: true,
      image: "https://placehold.co/200",
    },
    {
      name: "css",
      description:
        "css is sum dolor sit amet consectetur adipisicing elit. Sit dolore min",
      duration: "1 weeks",
      status: true,
      image: "https://placehold.co/200",
    },
    {
      name: "js",
      description:
        "js is sum dolor sit amet consectetur adipisicing elit. Sit dolore min",
      duration: "2 weeks",
      status: true,
      image: "https://placehold.co/200",
    },
    {
      name: "react",
      description:
        "react is sum dolor sit amet consectetur adipisicing elit. Sit dolore min",
      duration: "2 weeks",
      status: false,
      image: "https://placehold.co/200",
    },
    {
      name: "node",
      description:
        "js is sum dolor sit amet consectetur adipisicing elit. Sit dolore min",
      duration: "2 weeks",
      status: false,
      image: "https://placehold.co/200",
    },
  ];

  return (
    <div>
      <table>
        <thead>
          <th>Title</th>
          <th>Duration</th>
          <th>Status</th>
        </thead>
        <tbody>
          {courses.map((el) => {
            return (
              <tr className={el.status ? "green" : "red"}>
                <td>{el.name}</td>
                <td>{el.duration}</td>
                <td>{el.status ? <span>yes</span> : <span>no</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <br />
      <h2>Completed Todos</h2>
      {courses.map(e => {
        if (e.status) {
          return (<li>{e.name}</li>)
        }
      })}
      <h2>Incomplete Todos</h2>
      {courses.map(e => {
        if (!e.status) {
          return (<li>{e.name}</li>)
        }
      })}
    </div>
  );
};

export default Home;
