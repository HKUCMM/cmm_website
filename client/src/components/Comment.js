import "../css/comment.css";
<img src="/user.png" alt="user" />;

const Comment = () => {
  return (
    <div className="box">
      <div className="user">
        <img className="profile" src="/user.png" alt="user" />
        <div className="info">
          <p className="name">사용자1</p>
          <p className="date">2024년 05월 21일 14:30</p>
        </div>
      </div>
      <div className="component">
        <span className="content">좋은 정보 감사합니다.</span>
        <div className="like">
          <img className="likeimg" src="/likes.png" alt="like" />
          <p className="likecount">5</p>
        </div>
      </div>
      <p className="line"></p>
    </div>
  );
};

export default Comment;
