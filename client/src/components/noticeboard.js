import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/noticeboard.css";

const Noticeboard = ({ noticeBoardData, onLikeUpdate }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(noticeBoardData.numOfLikes);

  const convertDate = (date) => {
    return date.substr(0, 10).replaceAll("-", ".");
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/view-post/${noticeBoardData.postId}/like-post`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        if (onLikeUpdate) {
          onLikeUpdate(noticeBoardData.postId, data.likes);
        }
      } else {
        console.error('Failed to update like');
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleContentClick = (e) => {
    // Prevent navigation if the click was on the like button or message count
    if (!e.target.closest('.likeMessage')) {
      navigate(`/posts/${noticeBoardData.postId}`);
    }
  };

  return (
    <div className="noticeBox" onClick={handleContentClick}>
      <div className="notice-content">
        <h1 className="noticeTitle">{noticeBoardData.title}</h1>
        <div className="noticeSubBox">
          <p className="dateAuthor">
            {convertDate(noticeBoardData.date)} by {noticeBoardData.author}
          </p>
        </div>
      </div>
      <div className="likeMessage" onClick={(e) => e.stopPropagation()}>
        <button className="likeButton" onClick={handleLike}>
          <img className="likeImg" src={"/like.png"} alt="like" />
          <span className="likeCount">{likes}</span>
        </button>
        <div className="messageWrapper">
          <img className="messageImg" src={"/message.png"} alt="message" />
          <span className="messageCount">{noticeBoardData.numOfcomments}</span>
        </div>
      </div>
    </div>
  );
};

export default Noticeboard;