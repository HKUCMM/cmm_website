import "../css/comment.css";
<img src="/user.png" alt="user" />;

const Comment = ({ commentData }) => {
  return (
    <div className="box">
      <div className="user">
        <div className="info">
          <p className="name">{commentData.author}</p>
          <p className="date">{commentData.timeCreated}</p>
        </div>
      </div>
      <div className="component">
        <span className="content">{commentData.content}</span>
      </div>
    </div>
  );
};

export default Comment;
