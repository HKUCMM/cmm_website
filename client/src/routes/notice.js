import "../css/notice.css";
import Noticeboard from "../components/noticeboard";
import { useEffect, useState } from "react";

function Notice() {
  const [loading, setLoading] = useState(true);
  const [postsData, setPostsData] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/view-all-post`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        setPostsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="noticeBackground">
      <div className="notice-board">
        <p className="notice-board-title">NOTICE</p>
        {loading
          ? null
          : postsData.map((data) => {
              return <Noticeboard noticeBoardData={data} />;
            })}
        <img
          className="add"
          src={process.env.PUBLIC_URL + "/add.png"}
          alt="add"
        />
      </div>
    </div>
  );
}

export default Notice;
