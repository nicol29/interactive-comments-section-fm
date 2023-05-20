import './App.css';
import { useEffect, useState } from 'react';
import data from "./data.json";
import Comment from './components/comment';

function App() {
  const [comments, setComments] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if(!localStorage.getItem("comments") && !localStorage.getItem("currentUser")) {
      localStorage.setItem("comments", JSON.stringify(data.comments));
      localStorage.setItem("currentUser", JSON.stringify(data.currentUser));
    } 

    setComments([...comments, ...JSON.parse(localStorage.getItem("comments"))]);
    setUserInfo({ ...userInfo,  user: JSON.parse(localStorage.getItem("currentUser"))});
  }, []);

  return (
    <section className="App">
      {comments.length > 0 && comments.map(comment => {
        if (comment.replies.length > 0) {
          return (
            <>
              <Comment userInfo={userInfo} comment={comment}/>
              <div className="replies-container">
                {comment.replies.map(reply => (
                  <Comment userInfo={userInfo} comment={reply}/>
                ))}
              </div>
            </>
          )
        } else {
          return (
            <Comment userInfo={userInfo} comment={comment}/>
          )
        }
      })}
      <div className="add-comment">
        <textarea placeholder="Add a comment..." type="text"/>
        <div className="submit-comment">
          { userInfo.user?.image.png && <img src={require(`./images/avatars/${userInfo.user?.image.png}`)} alt="signed in profile"/>}
          <button>SEND</button>
        </div>
      </div>
    </section>
  );
}

export default App;
