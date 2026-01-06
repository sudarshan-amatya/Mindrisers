import { useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import './App.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState("Home");

  return (
    <>
      <Header setCurrentTab={setCurrentTab} />
      <Hero currentTab={currentTab} />
    </>
  );
}
