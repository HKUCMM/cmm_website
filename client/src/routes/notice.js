import "../css/notice.css";
import Noticeboard from "../components/noticeboard";
import { useState } from "react";

function Notice() {
  return (
    <div className="noticeBackground">
      <p className="title">Notice</p>
      <Noticeboard />
      <Noticeboard />
      <Noticeboard />
      <img
        className="add"
        src={process.env.PUBLIC_URL + "/add.png"}
        alt="add"
      />
    </div>
  );
}

export default Notice;
