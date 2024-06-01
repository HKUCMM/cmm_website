import "../css/noticeboard.css";

const Noticeboard = () => {
  return (
    <div className="noticeBox">
      <h1 className="noticeTitle">CMM 학회 웹사이트 이용안내</h1>
      <div className="noticeSubBox">
        <p className="dateAuthor">2024년 05월 21일 by 강현우</p>
        <div className="likeMessage">
          <img
            className="likeImg"
            src={process.env.PUBLIC_URL + "/like.png"}
            alt="like"
          />
          <span className="likeCount">5</span>
          <img
            className="messageImg"
            src={process.env.PUBLIC_URL + "/message.png"}
            alt="message"
          />

          <span className="messageCount">5</span>
        </div>
        {/* <div style={{ clear: "float" }}></div> */}
      </div>
      <p className="noticeLine"></p>
    </div>
  );
};

export default Noticeboard;
