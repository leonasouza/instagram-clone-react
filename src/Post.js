import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

function Post({ postId, user, username, caption, imageUrl, onFilter }) {
  const commentsQuantity = 2;
  const addCommentsQuantity = 4;
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(commentsQuantity);
  const likesShown = 2;

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    if (postId) {
      db.collection("posts")
        .doc(postId)
        .collection("likes")
        .onSnapshot((snapshot) => {
          setLikes(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, []);

  const showMoreComments = () => {
    setPage((previousValue) => previousValue + addCommentsQuantity);
  };

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  const checkIfLiked = () => {
    if (user) {
      const check = likes.filter(
        (isLiked) => isLiked.data.username === user.displayName
      );
      if (check.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const deletePost = () => {
    if (window.confirm("Delete the item?")) {
      db.collection("posts").doc(postId).delete();
    }
  };

  const renderIcon = () => {
    if (checkIfLiked()) {
      return <FavoriteIcon />;
    } else {
      return <FavoriteBorderIcon />;
    }
  };

  const likePost = (event) => {
    event.preventDefault();
    const check = likes.filter(
      (isLiked) => isLiked.data.username === user.displayName
    );
    if (check.length > 0) {
      db.collection("posts")
        .doc(postId)
        .collection("likes")
        .doc(check[0].id)
        .delete()
        .catch((error) => console.log("erro: ", error));
    } else {
      db.collection("posts").doc(postId).collection("likes").add({
        username: user.displayName,
      });
    }
  };

  const likesText = () => {
    if (likes.length > 0) {
      return "Curtido por";
    } else {
      return "Nenhuma curtida :(";
    }
  };

  return (
    <div className="post">
      {/*header*/}
      <div className="post__header">
        <div className="post__avatar">
          <Avatar
            className="post__avatarImg"
            alt={username}
            src="/static/images/avatar/1.jpg"
          />
          <button className="post__usernameButton">{username}</button>
        </div>
        <div className="post__moreOptions">
          {user && username === user.displayName && (
            <button className="post__deleteButton" onClick={deletePost}>
              <DeleteOutlineIcon />
            </button>
          )}
        </div>
      </div>
      {/*post*/}
      <img className="post__image" src={imageUrl} />
      {/* curtidas */}
      <div className="post__likes">
        <button className="post__likeButton" onClick={likePost}>
          {renderIcon()}
        </button>
        {likesText()}&nbsp;
        <strong>
          {likes.slice(0, likesShown).map((like) => " " + like.data.username)}
        </strong>
        &nbsp;
        {likes.length > likesShown &&
          " e mais " + (likes.length - likesShown) + " pessoas"}
      </div>
      {/* legenda */}
      <h4 className="post__text">
        {caption && (
          <div className="post__caption">
            <strong>{username}</strong> {caption}
          </div>
        )}
      </h4>
      {/*comentarios*/}
      <div className="post__comments">
        {comments.slice(0, page).map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
        {comments.length > commentsQuantity && comments.length >= page && (
          <button className="post__loadMore" onClick={showMoreComments}>
            Carregar mais comentários
          </button>
        )}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Envie um comentário"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Comentar
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
