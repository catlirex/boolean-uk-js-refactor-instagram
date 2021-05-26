const state={
    users:[],
    posts:[],
    activeId: null
}

const rootDiv = document.getElementById("root")

function getUsers(){
    return fetch("http://localhost:3000/users")
    .then(response => response.json())
    .then(function(users){
        state.users = users
        console.log(state.users)
    });
}

function getPosts(){
    return fetch("http://localhost:3000/posts")
    .then(response => response.json())
    .then(function(posts){
        state.posts = posts
        console.log(state.posts)
    });
}

function renderHeaderSection(){
    let header = document.createElement("header")
    header.setAttribute("class", "main-header")
    rootDiv.append(header)

    let headerWrapper = document.createElement("div")
    headerWrapper.setAttribute("class", "wrapper")
    header.append(headerWrapper)

    for(user of state.users) {
        userChip = createUserChip(user)
        headerWrapper.append(userChip) 
    }
}

function createUserChip(user){
    let chipDiv = document.createElement("div")
    chipDiv.setAttribute("class", "chip")
    chipDiv.setAttribute("id", user.id)
    let avatarDiv = document.createElement("div")
    avatarDiv.setAttribute("class", "avatar-small")
    let avatarImg = document.createElement("img")
    avatarImg.setAttribute("src", user.avatar)
    avatarImg.setAttribute("alt", user.username)
    avatarDiv.append(avatarImg)
    let userName = document.createElement("span")
    userName.innerText = user.username
    chipDiv.append(avatarDiv, userName)

    chipDiv.addEventListener("click",function(){
        state.activeId = user.id
        updateActiveChip()
        updatePreviewChip()
      })
    return chipDiv
}

function updatePreviewChip(){
    let previewDiv = document.querySelector(".post")
    previewChip = previewDiv.querySelector(".chip")
    previewChip.remove()

    activeUser = state.users.find(function(user){
        return user.id === state.activeId
    })
    newChip = createUserChip(activeUser)
    previewDiv.prepend(newChip)
}

function updateActiveChip(){
    let allUsersChip = document.querySelectorAll(".chip")
    allUsersChip.forEach(function(chip){
        if (chip.id === state.activeId.toString()){
            chip.setAttribute("class", "active chip")
        }
        else{
            chip.setAttribute("class", "chip")
        }
    })
}

function renderMain(){
    let mainWrapper = document.createElement("main")
    mainWrapper.setAttribute("class", "wrapper")
    rootDiv.append(mainWrapper)

    renderCreatePostSection()

}

function renderCreatePostSection(){
    let formH2 = document.createElement("h2")
    formH2.innerText = "Create a post"

    let imageLabel = document.createElement("label")
    imageLabel.setAttribute("for", "image")
    imageLabel.innerText = "Image"
    let imageInput = document.createElement("input")
    imageInput.setAttribute("id", "image")
    imageInput.setAttribute("name", "image")
    imageInput.setAttribute("type", "text")

    let titleLabel = document.createElement("label")
    titleLabel.setAttribute("for", "title")
    titleLabel.innerText = "Title"
    let titleInput = document.createElement("input")
    titleInput.setAttribute("id", "title")
    titleInput.setAttribute("name", "title")
    titleInput.setAttribute("type", "text")
    
    let contentLabel = document.createElement("label")
    contentLabel.setAttribute("for", "content")
    contentLabel.innerText = "Content"
    let contentInput = document.createElement("textarea")
    contentInput.setAttribute("id", "content")
    contentInput.setAttribute("name", "content")
    contentInput.setAttribute("rows", "2")
    contentInput.setAttribute("columns", "30")

    let previewBtn = document.createElement("button")
    previewBtn.setAttribute("id", "preview-btn")
    previewBtn.setAttribute("type", "button")
    previewBtn.innerText = "Preview"
    previewBtn.addEventListener("click", function(){
       previewPost={
           title: titleInput.value,
           content: contentInput.value,
           image: imageInput.value
       }
       renderPostPreview(previewPost)
    })

    let submitBtn = document.createElement("button")
    submitBtn.setAttribute("type", "submit")
    submitBtn.innerText = "Post"

    let btnDiv  = document.createElement("div")
    btnDiv.className = "action-btns"
    btnDiv.append(previewBtn, submitBtn)

    let createPostForm = document.createElement("form")
    createPostForm.setAttribute("id", "create-post-form")
    createPostForm.setAttribute("autocomplete", "off")
    createPostForm.append(formH2, imageLabel, imageInput, titleLabel, titleInput, contentLabel, contentInput, btnDiv)
    createPostForm.addEventListener("submit", function(event){
        event.preventDefault()
        if(state.activeId === null){
            alert("Please select User")
        } 
        else{
            newPost = {
                title: titleInput.value,
                content: contentInput.value,
                image :{
                    src: imageInput.value,
                    alt: titleInput.value
                },
                likes:0,
                userId: state.activeId
            }

            postNewPost(newPost)
            .then(function(newPostFromServer){
                let newPostToRender = newPostFromServer
                newPostToRender.comments = "null"
                let ulEl = document.querySelector(".stack")
                ulEl.prepend(renderFeed(newPostToRender))
                createPostForm.reset()
            })
        }
    })

    

    let createPostSection = document.createElement("section")
    createPostSection.className = "create-post-section"
    createPostSection.append(createPostForm, renderPostPreviewDummy())

    let mainWrapper = document.querySelector("main")
    mainWrapper.append(createPostSection)
}

function renderPostPreview(previewPost){
    let previewDiv = document.querySelector(".post")
    let previewImgDiv = previewDiv.querySelector(".post--image")
    previewImgDiv.classList.remove("loading-state")
    previewImgDiv.innerHTML = ""
    let previewImg = document.createElement("img")
    previewImg.setAttribute("src", previewPost.image)
    previewImgDiv.append(previewImg)

    let previewTitle = previewDiv.querySelector("h2")
    previewTitle.classList.remove("loading-state")
    previewTitle.innerText = previewPost.title

    let previewPara = previewDiv.querySelector("p")
    previewPara.classList.remove("loading-state")
    previewPara.innerText = previewPost.content

}

function renderPostPreviewDummy(){
    let previewDiv = document.createElement("div")
    previewDiv.className = "post"

    if(state.activeId !== null){
        activeUser = state.users.find(function(user){
            return user.id === state.activeId
        })
       userChip = createUserChip(activeUser)
    }
    else{
        let dummyUser ={
            username: "Please Select User",
            avatar: "https://cdn2.vectorstock.com/i/1000x1000/23/81/default-avatar-profile-icon-vector-18942381.jpg"
        }
        userChip = createUserChip(dummyUser)
    }
    let previewImgDiv = document.createElement("div")
    previewImgDiv.className = "post--image loading-state"
    let previewContent = document.createElement("div")
    previewContent.className = "post--content"
    let previewH2 = document.createElement("h2")
    previewH2.className = "loading-state"
    let previewPara = document.createElement("p")
    previewPara.className = "loading-state"

    previewContent.append(previewH2, previewPara)
    previewDiv.append(userChip, previewImgDiv, previewContent)

    return previewDiv
}

function postNewPost(newPost){
    return fetch("http://localhost:3000/posts", {
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost)
      }).then(response => response.json())
}

function renderFeeds(){

    let ulEl = document.createElement("stack")
    ulEl.className = "stack"

    for (post of state.posts){
       postLi = renderFeed(post)
       ulEl.prepend(postLi) 
    }

    let feedSection = document.createElement('section')
    feedSection.className = "feed"
    feedSection.append(ulEl)

    let main = document.querySelector("main")
    main.append(feedSection)
}

function renderFeed(post){
    let postUser = state.users.find(function(user){
        return user.id === post.userId
    })

    let userChip = createUserChip(postUser)

    let postImgDiv = document.createElement("div")
    postImgDiv.className = "post--image"
    let postImg = document.createElement("img")
    postImg.setAttribute("src", post.image.src)
    postImg.setAttribute("alt", post.image.alt)
    postImgDiv.append(postImg)

    let postContentDiv = document.createElement("div")
    postContentDiv.className = "post--content"
    let postContentH2 = document.createElement("h2")
    postContentH2.innerText = post.title
    let postContent = document.createElement("p")
    postContent.innerText = post.content
    postContentDiv.append(postContentH2, postContent)

    let postCommentsDiv = document.createElement("div")
    postCommentsDiv.className = "post--comments"
    postCommentH3 = document.createElement("h3")
    postCommentH3.innerText = "Comments"
    postCommentsDiv.prepend(postCommentH3)

    if (post.comments !== "null"){
        for (comment of post.comments){
            postCommentsDiv.append(renderCommentDiv(comment))
        }
    }

    commentForm = renderCommentForm(post)

    let postLi = document.createElement("li")
    postLi.className = "post"
    postLi.append(userChip, postImgDiv, postContentDiv, postCommentsDiv, commentForm)

    return postLi
}

function renderCommentForm(post){
    let commentLabel = document.createElement("label")
    commentLabel.setAttribute("for", "comment")
    commentLabel.innerText = "Add Comment"

    let commentInput = document.createElement("input")
    commentInput.setAttribute("id", "comment")
    commentInput.setAttribute("name", "comment")
    commentInput.setAttribute("type", "text")

    let commentSubmit = document.createElement("button")
    commentSubmit.setAttribute("type", "submit")
    commentSubmit.innerText = "Comment"

    let commentForm = document.createElement("form")
    commentForm.setAttribute("id", "create-comment-form")
    commentForm.setAttribute("autocomplete", "off")
    commentForm.append(commentLabel, commentInput, commentSubmit)

    commentForm.addEventListener("submit", function(event){
        event.preventDefault()
        
        if(state.activeId === null){
            alert("Please select User")
        } 
        else{
            newComment = {
                content: commentInput.value,
                postId: post.id,
                userId: state.activeId
            }
            postComment(newComment)
            .then(function(newCommentFromServer){
                let postIndex = state.posts.findIndex(function(post){
                    return post.id === newCommentFromServer.postId
                })
                state.posts[postIndex].comments = [...state.posts[postIndex].comments, newCommentFromServer]
                let feedSection = document.querySelector(".feed")
                feedSection.remove()
                renderFeeds()
            })
        }
    })

    return commentForm
}

function postComment(newComment){
    return fetch("http://localhost:3000/comments", {
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newComment)
      }).then(response => response.json())
}

function renderCommentDiv(comment){
    let commentUser = state.users.find(function(user){
        return user.id === comment.userId
    })

    let avatarDiv = document.createElement("div")
    avatarDiv.className = "avatar-small"
    let avatarImg = document.createElement("img")
    avatarImg.setAttribute("src", commentUser.avatar)
    avatarImg.setAttribute("alt", commentUser.username)
    avatarDiv.append(avatarImg)

    let commentContent = document.createElement("p")
    commentContent.innerText = comment.content

    let postCommentDiv = document.createElement("div")
    postCommentDiv.className = "post--comment"
    postCommentDiv.append(avatarDiv, commentContent)

    return postCommentDiv
}

function render(){
    getUsers()
        .then(function(){
            getPosts() 
                .then(function(){
                    renderHeaderSection()
                    renderMain()
                    renderFeeds()
                })
        })
     
}

render()

