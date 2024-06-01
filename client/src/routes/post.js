import "../css/post.css";
import Comment from "../components/comment.js";
import Markdown from "react-markdown";
import { useEffect, useInsertionEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

const Post = () => {
  // const [content, setContent] = useState("");
  // const handleChange = (e) => {
  //   setContent({ ...content });
  // };
  const { postId } = useParams();
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [postData, setPostData] = useState({});
  const [commentData, setCommentData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/view-post/${postId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        setPostData(data);
        setLoadingPost(false);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${process.env.REACT_APP_API_URL}/get-comments/${postId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setCommentData(data);
        setLoadingComments(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBackClick = () => {
    navigate("/posts");
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
  };

  const convertDate = (date) => {
    return date.substr(0, 10).replaceAll("-", ".");
  };

  return (
    <div className="background">
      <div className="SubBackground">
        <div className="components" onClick={handleBackClick} type="button">
          <img className="icon" src="/toBackImg.png" alt="Back" />
          <p className="text">Back to Notice Page</p>
        </div>
        {loadingPost ? null : (
          <div>
            <div className="title-box">
              <p className="title">{postData.title}</p>
              <p className="date">
                {convertDate(postData.timeCreated)} by &nbsp;
                <span className="author"> {postData.author}</span>
              </p>
            </div>
            <div className="markdown">
              <Markdown remarkPlugins={remarkGfm}>{postData.content}</Markdown>
            </div>
            <p className="line"></p>
            <div className="components">
              <img className="icon" src="/likes.png" alt="likes" />
              <p className="text">Like</p>
            </div>
            <form className="input" onSubmit={handleCommentSubmit}>
              <textarea
                className="inputfields"
                type="text"
                placeholder="Share your thoughts"
              />
              <button className="submit">Submit</button>
            </form>
            {loadingComments
              ? null
              : commentData.map((data) => {
                  return <Comment commentData={data} />;
                })}
            <p className="list">Load More Comments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
