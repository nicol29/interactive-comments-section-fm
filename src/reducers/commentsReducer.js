import uniqid from "uniqid";

const reducer = (state, action) => {
  switch (action.type) {
    case "delete":
      if (action.nested) {
        return state.map(comment => {
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== action.id)
            }
          } else {
            return comment;
          }
        })
      } else {
        return state.filter(comment => comment.id !== action.id);
      }
    case "add":
      if (action.recepient.user) {
        return state.map(comment => {
          if(comment.id === action.recepient.id) {
            return {
              ...comment,
              replies: [
                ...comment.replies, 
                {
                  content: action.body,
                  createdAt: "Today",
                  id: uniqid(),
                  replyingTo: action.recepient.user.username,
                  score: 0,
                  user: {
                    ...action.userInfo
                  }
                }
              ]
            }
          } else {
            return comment;
          }
        })
      } else {
        return [
          ...state,
          {
            content: action.body,
            createdAt: "Today",
            id: uniqid(),
            replies: [],
            score: 0,
            user: {
              ...action.userInfo
            }
          },
        ]
      }
    case "update":
      if (action.nested) {
        return state.map(comment => {
          if (comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === action.id) {
                  reply.content = action.comment
                } 
                return reply
              })
            }
          } else {
            return comment;
          }
        })
      } else {
        return state.map(comment => {
          if (comment.id === action.id) comment.content = action.comment;
          return comment;
        })
      }
    default: 
      return state;
  }
}

export default reducer;