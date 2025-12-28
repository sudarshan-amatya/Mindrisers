import { useState } from "react";

export const Tabs = () => {
  const [currentTab, setTab] = useState("all")
  const change = (e) => {
    setTab(e.target.innerText);
  }
  const tabs =  ["all","images","videos"]

  return (
    <div className="m-12">
      <ul className="mb-8 flex gap-4 capitalize">
        <li>
          <a href='#' onClick={change}>all</a>
        </li>
        <li>
          <a href='#' onClick={change} >images</a>
        </li>
        <li>
          <a href='#' onClick={change}>videos</a>
        </li>
      </ul>
      {currentTab == "all" && (
        <div>
          <h2>All</h2>
          <p>
            ALL Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            aliquam ea nobis exercitationem animi! Fugit esse culpa distinctio
            labore repudiandae facilis possimus reprehenderit hic quia quos
            quidem veniam, cumque voluptates.
          </p>
        </div>
      )}

      {currentTab == "images" && (
        <div>
          <h2>Images</h2>
          <p>
            Images Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Alias aliquam ea nobis exercitationem animi! Fugit esse culpa
            distinctio labore repudiandae facilis possimus reprehenderit hic
            quia quos quidem veniam, cumque voluptates.
          </p>
        </div>
      )}
      {currentTab == "videos" && (
        <div>
          <h2>Videos</h2>
          <p>
            Videso Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Alias aliquam ea nobis exercitationem animi! Fugit esse culpa
            distinctio labore repudiandae facilis possimus reprehenderit hic
            quia quos quidem veniam, cumque voluptates.
          </p>
        </div>
      )}
    </div>
  );
};
