import "../css/post.css";
import Comment from "../components/Comment";
import { useState } from "react";

const Post = () => {
  const [content, setContent] = useState("");
  const handleChange = (e) => {
    setContent({ ...content });
  };
  return (
    <div className="background">
      <div className="SubBackground">
        <div className="components">
          <img className="icon" src="/toBackImg.png" alt="Back" />
          <p className="text">뒤로가기</p>
        </div>
        <p className="title">CMM 학회 웹사이트 이용안내</p>
        <p className="date">
          2024.05.20 by &nbsp;<span className="author"> 강현우</span>
        </p>
        <img className="img" src="/exampleImg.png" alt="" />
        <p className="body">
          안녕하십니까 강현우 입니다 안녕하십니까 강현우 입니다 안녕하 십니까
          강현우 입니다 안녕하십니까 강현우 입니다 안녕하십니까 강현우 입니다
          안녕하십니까 강현우 입니다 안녕하십니까 강현우 입니다 안녕하십니까
          강현우 입니다 안녕하 십니까 강현우 입니다 안녕하십니까 강현우 입니다
          안녕하십니까 강현우 입니다 안녕하십니까 강현우 입니다 안녕하십니까
          강현우 입니다 안녕하십니까 강현우 입니다 안녕하 십니까 강현우 입니다
          안녕하십니까 강현우 입니다 안녕하십니까 강현우 입니다 안녕하십니까
          강현우 입니다 안녕하십니까 강현우 입니다 안녕하십니까 강현우 입니다
          안녕하 십니까 강현우 입니다 안녕하십니까 강현우 입니다 안녕하십니까
          강현우 입니다 안녕하십니까 강현우 입니다{" "}
        </p>
        <p className="line"></p>
        <div className="components">
          <img className="icon" src="/likes.png" alt="likes" />
          <p className="text">공감</p>
        </div>
        <form className="input">
          <textarea
            className="inputfields"
            type="text"
            placeholder="댓글을 작성하세요."
            onChange={handleChange}
          />
          <button className="submit">댓글 작성</button>
        </form>
        <Comment />
        <Comment />
        <p className="list">목록열기</p>
      </div>
    </div>
  );
};

export default Post;
