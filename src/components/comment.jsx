import uniqid from "uniqid";
import { useState, useRef, useEffect } from "react";

function Comment (
  { 
    userInfo, 
    comment,
    dispatch,
    manageReplying,
    setModalDispatch,
    nested,
    pointing
  }
) {
  const [editable, setEditable] = useState(false);
  const editableElement = useRef();

  useEffect(() => {
    editableElement.current.setAttribute("contentEditable", editable ? "true" : "false");
    editableElement.current.focus();
  }, [editable]);

  const handleEditOperation = (e) => {
    setEditable(!editable);
  }

  const submitUpdatedComment = () => {
    const text = editableElement.current.innerText;
    let sanitizedComment;

    if (text.split(" ").shift().charAt(0) === "@") {
      sanitizedComment = text.split(" ").slice(1, text.length).join(" ");
    } else {
      sanitizedComment = text
    }

    dispatch({
      type: "update", 
      comment: sanitizedComment, 
      id: comment.id, 
      nested: nested
    });

    setEditable(!editable);
  }

  return (
    <article key={uniqid()} className={"comment"}>
      <div className="profile-info-container">
        <img src={require(`../images/avatars/${comment.user.image.png}`)} alt="user profile"/>
        <p className="username">{comment.user.username}</p>
        {comment.user.username === userInfo.user.username && <div className="you">you</div>}
        <p className="date-created">{comment.createdAt}</p>
      </div>
      <p className="content" ref={editableElement}>
        {comment?.replyingTo && <span className="replying-to">@{comment.replyingTo} </span>}
        {comment.content}
      </p>
      <div className="comment-interactables">
        <div className="vote-buttons">
          <button>+</button>
          <p>{comment.score}</p>
          <button>-</button>
        </div>
        {comment.user.username === userInfo.user.username ? 
          <div className="user-avail-buttons">
            {editable ? 
              <button className="update-button" onClick={() => submitUpdatedComment()}>UPDATE</button> :
              <>
                <div className="action-buttons" onClick={() => {
                  setModalDispatch({ type: "delete", id: comment.id, nested: nested});
                }}>
                  <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                  <p style={{color: "hsl(358, 79%, 66%)"}}>Delete</p>
                </div>
                <div className="action-buttons" onClick={(e) => handleEditOperation(e)}>
                  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
                  <p>Edit</p>
                </div> 
              </>
            }
          </div>:
          <div className="action-buttons" onClick={() => manageReplying(comment.id, pointing)}>
            <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
            <p>Reply</p>
          </div>
        }
      </div>
    </article>
  )
}

export default Comment;

