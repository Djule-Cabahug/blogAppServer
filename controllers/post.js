const Post = require("../models/Post");
const User = require("../models/User");

// Add a post based on the schema
module.exports.addPost = (req, res) => {

	if(req.user.isAdmin){
    	return res.status(403).send("Action Forbidden")
  	}
	
	
	return User.findById(req.user.id)
	.then(user => {

		let newPost = new Post({
			userId: req.user.id,
			title: req.body.title,
			content: req.body.content,
			author: user.username
		});

		return newPost.save()
		.then(savedPost => res.status(201).send(savedPost))
		.catch(saveErr => {
			console.error("Error in saving the post: ", saveErr)

			return res.status(500).send({ error: 'Failed to save the post' });
		});
	})
	.catch(findErr => {
	    console.error("Error in finding user: ", findErr)

	    return res.status(500).send({ message:'Error finding user' });
	});


};

// Get authenticated user's posts via their userId
module.exports.getMyPosts = (req, res) => {

	if(req.user.isAdmin){
    	return res.status(403).send("Action Forbidden")
  	}

	return Post.find({userId: req.user.id})
	.then(posts => {
		return res.status(200).send({ posts })
	}).catch(findErr => {
	    console.error("Error in finding posts: ", findErr)

	    return res.status(500).send({ message:'Error finding posts' });
	});
}

// Get all posts of the post collection
module.exports.getAllPosts = (req, res) => {

	return Post.find({}).then(posts => {
		return res.status(200).send({ posts });
	}).catch(findErr => {
	    console.error("Error in finding posts: ", findErr)

	    return res.status(500).send({ message:'Error finding posts' });
	});
}; 

// Retrieve a single post
module.exports.getPost = (req, res) => {

	return Post.findById(req.params.postId).then(post => {
		return res.status(200).send(post);
	}).catch(findErr => {
	    console.error("Error in finding post: ", findErr)

	    return res.status(500).send({ message:'Error finding post' });
	});
}; 

// Update post by id if it exists in the database
module.exports.updatePost = (req, res) => {

	if(req.user.isAdmin){
    	return res.status(403).send("Action Forbidden")
  	}

	let updatedPost = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    }

    return Post.findByIdAndUpdate(req.params.postId, updatedPost, {new: true})
    .then(updatedPost => {
        if (!updatedPost) {
            return res.status(404).send({ error: 'Post not found' });
        }

        return res.status(200).send({ 
        	message: 'Post updated successfully', 
        	updatedPost: updatedPost 
        });

    })
    .catch(err => {
		console.error("Error in updating a post: ", err)
		return res.status(500).send({ error: 'Error in updating a post.' });
	});
};

// Delete post by id if it exists in the database
module.exports.deletePost = (req, res) => {

	if(req.user.isAdmin){
    	return res.status(403).send("Action Forbidden")
  	}

    return Post.findByIdAndDelete(req.params.postId)
    .then(deletedPost => {
        if (!deletedPost) {
            return res.status(404).send({ error: 'Post not deleted' });
        }

        return res.status(200).send({message: 'Post deleted successfully'});

    })
    .catch(err => {
		console.error("Error in deleting a post: ", err)
		return res.status(500).send({ error: 'Error in deleting a post.' });
	});
};

// Add a post comment by id for a specific post
module.exports.addComment = (req, res) => {

	if(req.user.isAdmin){
    	return res.status(403).send("Action Forbidden")
  	}

	return Post.findById(req.params.postId).then(post => {

    	let userComment = {
    		userId: req.user.id,
        	comment: req.body.comment
    	}

	    post.comments.push(userComment);
	    
	    return post.save()
	    .then(updatedPost => {
	        if (!updatedPost) {
	            return res.status(404).send({ error: 'Post not found' });
	        }

	        return res.status(200).send({ 
	        	message: 'comment added successfully', 
	        	updatedPost: updatedPost 
	        });

	    })
	    .catch(err => {
			console.error("Error in updating a post: ", err)
			return res.status(500).send({ error: 'Error in updating a post.' });
		});
	})
};

// Get post comments by id if they exist in the post document
module.exports.getComments = (req, res) => {

	return Post.findById(req.params.postId).then(post => {

		return res.status(200).send({ comments: post.comments });
	})
	.catch(findErr => {
	    console.error("Error in finding post: ", findErr)

	    return res.status(500).send({ message:'Error finding post' });
	});
};

// Delete any post by id 
module.exports.deletePostAsAdmin = (req, res) => {

    return Post.findByIdAndDelete(req.params.postId)
    .then(deletedPost => {
        if (!deletedPost) {
            return res.status(404).send({ error: 'Post not deleted' });
        }

        return res.status(200).send({message: 'Post deleted successfully'});

    })
    .catch(err => {
		console.error("Error in deleting a post: ", err)
		return res.status(500).send({ error: 'Error in deleting a post.' });
	});
};

// Delete any comment by id 
module.exports.deleteComment = (req, res) => {

    return Post.findById(req.params.postId)
    .then(post => {
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });

        } else {

			const index = post.comments.findIndex(comment => {

				return comment._id.toString() === req.params.commentId;
			})

			if (index !== -1){

				post.comments.splice(index, 1);

				return post.save()
				.then(savedPost => res.status(200).send({
					message: "Comment successfully deleted",
					updatedPost: savedPost
				}))
				.catch(saveErr => {
					console.error("Error in saving the post: ", saveErr)
		
					return res.status(500).send({ error: 'Failed to save the post' });
				});

			} else {

				return res.status(404).send({ error: "Comment not found" })
			}
		}
    })
    .catch(err => {
		console.error("Error in deleting a post: ", err)
		return res.status(500).send({ error: 'Error in deleting a post.' });
	});
};
