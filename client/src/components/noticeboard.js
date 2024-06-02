import { useNavigate } from "react-router-dom";
import "../css/noticeboard.css";

const Noticeboard = ({ noticeBoardData }) => {
  const navigate = useNavigate();

  const convertDate = (date) => {
    return date.substr(0, 10).replaceAll("-", ".");
  };

  return (
    <div className="noticeBox">
      <div
        className="notice-title-button"
        onClick={() => navigate(`/posts/${noticeBoardData.postId}`)}
      >
        <h1 className="noticeTitle">{noticeBoardData.title}</h1>
      </div>
      <div className="noticeSubBox">
        <p className="dateAuthor">
          {convertDate(noticeBoardData.date)} by {noticeBoardData.author}
        </p>
        <div className="likeMessage">
          <img className="likeImg" src={"/like.png"} alt="like" />
          <span className="likeCount">{noticeBoardData.numOfLikes}</span>
          <img className="messageImg" src={"/message.png"} alt="message" />
          <span className="messageCount">{noticeBoardData.numOfcomments}</span>
        </div>
        {/* <div style={{ clear: "float" }}></div> */}
      </div>
      <p className="noticeLine"></p>
    </div>
  );
};

export default Noticeboard;
