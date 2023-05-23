import './App.css';
import { useEffect, useState, useReducer } from 'react';
import data from "./data.json";
import Comment from './components/comment';
import Modal from './components/modal';
import reducer from './reducers/commentsReducer';


function App() {
  const [value, setValue] = useState("");
  const [recepient, setRecepient] = useState({});
  const [toggleModal, setToggleModal] = useState({active: false, info: {}});

  if(!localStorage.getItem("comments") || !localStorage.getItem("currentUser")) {
    localStorage.setItem("comments", JSON.stringify(data.comments));
    localStorage.setItem("currentUser", JSON.stringify(data.currentUser));
  }

  const [userInfo, setUserInfo] = useState({user: JSON.parse(localStorage.getItem("currentUser"))});

  const unsortedComments = JSON.parse(localStorage.getItem("comments"));
  const sortedByUpVotes = unsortedComments.sort((a, b) => a.score + b.score);

  const [comments, dispatch] = useReducer(reducer, sortedByUpVotes);

  const manageReplying = (commentId, pointer) => {
    comments.forEach(comment => {
      if(comment.id === commentId) {
        setRecepient({...comment})
        setValue(`@${comment.user.username} `)
      } else if (pointer && comment.replies.length > 0) {
        comment.replies.forEach(comment => {
          if(comment.id === commentId) {
            setRecepient({
              ...comment, 
              id: pointer.id
            })
            setValue(`@${comment.user.username} `)
          }
        });
      }
    });
    const textArea = document.querySelector("textarea");
    textArea.focus();
  }

  const manageModal = () => {
    setToggleModal({...toggleModal, active: !toggleModal.active});
  }

  const setModalDispatch = (dispatchObj) => {
    setToggleModal({active: !toggleModal.active, info: dispatchObj});
  }

  const modalDeleteComment = () => {
    dispatch(toggleModal.info);
    manageModal();
  }

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  return (
    <section className="App">
      {comments.length > 0 && comments.map(comment => {
        if (comment.replies?.length > 0) {
          return (
            <>
              <Comment 
                userInfo={userInfo} 
                comment={comment} 
                dispatch={dispatch} 
                manageReplying={manageReplying}
                setModalDispatch={setModalDispatch}
              />
              <div className="replies-container">
                {comment.replies.map(reply => (
                  <Comment 
                    userInfo={userInfo} 
                    comment={reply} 
                    dispatch={dispatch} 
                    manageReplying={manageReplying}
                    setModalDispatch={setModalDispatch}
                    nested={true} 
                    pointing={comment}
                    reply={true}
                  />
                ))}
              </div>
            </>
          )
        } else {
          return <Comment 
            userInfo={userInfo} 
            comment={comment} 
            dispatch={dispatch} 
            manageReplying={manageReplying}
            setModalDispatch={setModalDispatch}
          />
        }
      })}
      <div className="add-comment">
        <textarea 
          placeholder="Add a comment..." 
          type="text" 
          value={value} 
          onChange={(e) => {
            if(e.target.value === "") setRecepient({});
            setValue(e.target.value)
          }}
        />
        <div className="submit-comment">
          { userInfo.user?.image.png && <img src={require(`./images/avatars/${userInfo.user?.image.png}`)} alt="signed in profile"/>}
          <button onClick={() => {
            let sanitizedComment = value;

            if (value.split(" ").shift().charAt(0) === "@") {
              sanitizedComment = value.split(" ").slice(1, value.length).join(" ");
            } 
            
            dispatch({ 
              type: "add", 
              body: sanitizedComment, 
              userInfo: userInfo.user,
              recepient: recepient
            })
            setRecepient({});
            setValue("");
          }}>SEND</button>
        </div>
      </div>
      {toggleModal.active && <Modal manageModal={manageModal} modalDeleteComment={modalDeleteComment}/>}
    </section>
  );
}

export default App;
