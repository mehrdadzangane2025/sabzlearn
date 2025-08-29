const buildCommentTree = (comments, postId) => {
    const commentMap = {};
    const commentTree = [];

    comments.forEach((comment) => {
        commentMap[comment._id] = {
            ...comment,
            address: postId,
            replies: [],
            isReplied: false,
        };
    });

    comments.forEach((comment) => {
        if (comment.mainCommentID) {
            const parent = commentMap[comment.mainCommentID];
            if (parent) {
                parent.replies.push(commentMap[comment._id]);
                parent.isReplied = true;
            }
        } else {
            commentTree.push(commentMap[comment._id]);
        }
    });

    return commentTree;
};


module.exports = buildCommentTree;