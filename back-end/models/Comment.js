sql = require("./models/db.js"); 

const Comment = function (comment) {
    this.id = comment.id; 
    this.user_id = comment.user_id; 
    this.post_id = comment.post_id; 
    this.content = comment.content; 
}; 

//modèle pour obtenir des commentaires
Comment.get = (posdId, result) => {
    sql.query( 
        `SELECT comments.id, comments.user_id, comments.post_id, comments.content, user.lastname, user.avatar, user.isAdmin FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id = ${postId} ORDER BY comments.id DESC`,
        (err, res) => {
            if (err) {
                console.log("error :", err);
                result(null, err); 
                return; 
            }
            result(null, res); 
        }
    );
};

//modèle pour poster un commentaire
Comment.createComment = (newComment, result) => {
    //cette requête définit le nouveau commentaire dans la table des commentaires
    sql.query("INSERT INTO comments SET ?", newComment, (err, res) => {
        if (err) {
            console.log("erreur :", err); 
            result(err, null);
            return; 
        }
        result(null, {id: res.insertId, ...newComment });
    });
};

//modèle pour supprimé un commentaire
Comment.delete = (commentId, result) => {
    //cela supprime le commentaire identifié par son identifiant
    sql.query(`DELETE FROM comments WHERE comments.id = ${commentId}`, (err,res) => {
        if (err) {
            console.log("erreur :", err); 
            result(err, null);
            return; 
        }
        result(null, {id: res.insertId, ...newComment });
    });
};