import "../css/notice.css";
import Noticeboard from "../components/noticeboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isLoggedIn) {
          navigate("/");
        }
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
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
        console.error(err);
      });
  };

  const handleLikeUpdate = (postId, newLikeCount) => {
    setPostsData(prevPosts =>
      prevPosts.map(post =>
        post.postId === postId ? { ...post, numOfLikes: newLikeCount } : post
      )
    );
  };

  return (
    <div className="noticeBackground">
      <div className="notice-board">
        <p className="notice-board-title">NOTICE</p>
        {loading
          ? null
          : postsData.map((data) => (
              <Noticeboard 
                key={data.postId}
                noticeBoardData={data}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
        <img className="add" src={"/add.png"} alt="add" />
      </div>
    </div>
  );
}

export default Notice;