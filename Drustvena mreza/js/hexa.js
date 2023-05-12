let session = new Session()
session_id = session.getSession()
if(session_id !== ''){

    async function populateUserData(){
        let user = new User()
        data= await user.get(session_id)
        document.querySelector('#username').innerText=data['username']
        document.querySelector('#email').innerText=data['email']

        user.username = document.querySelector('#korisnicko_ime').value = data['username']
        user.email = document.querySelector('#edit_mail').value = data['email']
    }
    populateUserData()
}else{
    window.location.href = '/'
}

document.querySelector('#logout').addEventListener('click',event=>{
    event.preventDefault()
    session.destroySession()
    window.location.href = '/'
})

document.querySelector('#editAccount').addEventListener('click',()=>{
    document.querySelector('.custom-modal').style.display = 'block'
})
document.querySelector('#closeModal').addEventListener('click',()=>{
    document.querySelector('.custom-modal').style.display = 'none'
})

document.querySelector('#editForm').addEventListener('submit',e=>{
    e.preventDefault()

    let user = new User()
    user.username = document.querySelector('#korisnicko_ime').value
    user.email = document.querySelector('#edit_mail').value
    user.edit()
})

document.querySelector('#deleteProfile').addEventListener('click',event=>{
    event.preventDefault()
    let text = 'Da li ste sigurni da želite da obrišete profil'
    if(confirm(text)===true){
        let user = new User()
        user.delete()
    }
})

document.querySelector('#postForm').addEventListener('submit',event=>{
    event.preventDefault()
    async function createPost(){
        let content = document.querySelector('#postContent').value
        let post = new Post()
        post.post_content = content
        post=await post.create()

        let current_user = new User()

        let delete_post_html = ''
        if(session_id === post.user_id){
            delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`
        }

        current_user = await current_user.get(session_id)
        document.querySelector('#allPostWrapper').innerHTML=`
            <div class="single-post" data-post_id="${post.id}">
                <div class="post-content">${post.content}</div>
                    <div class="post-actions">
                        <p><b>Author: </b>${current_user.username}</p>
                        <div>
                            <button onclick="likePost(this)" class="likePostJS like-btn"><span> ${post.likes}</span> likes </button>
                            <button class="comment-btn" onclick="commentPost(this)">Comments</button>
                            ${delete_post_html}
                        </div>
                </div>
                <div class="post-comments">
                    <form>
                        <input placeholder="Napiši komentar..." type='text'>
                        <button onclick="commentPostSubmit(event)">Comment</button>
                    </form>
                 </div>
            </div>`
    }
    createPost()
})

async function getAllPosts(){
    let all_posts = new Post()
    all_posts = await all_posts.getAllPosts()
    all_posts.forEach(post=>{
        async function getPostUser(){
            let user = new User()
            user = await user.get(post.user_id)
            let comments = new Comment()
            comments = await comments.get(post.id)
            let comment_html=''
            if(comments.length > 0){
                comments.forEach(comment=>{
                    comment_html += `<div class="single-comment">${comment.content}</div>`
                })
        }
        let html = document.querySelector('#allPostWrapper').innerHTML
        let delete_post_html = ''
        if(session_id === post.user_id) delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`
        document.querySelector('#allPostWrapper').innerHTML = `
        <div class="single-post" data-post_id="${post.id}">
            <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <p><b>Author: </b>${user.username}</p>
                    <div>
                        <button onclick="likePost(this)" class="likePostJS like-btn"><span> ${post.likes}</span> likes </button>
                        <button class="comment-btn" onclick="commentPost(this)">Comments</button>
                        ${delete_post_html}
                    </div>
            </div>
            <div class="post-comments">
                <form>
                    <input placeholder="Napiši komentar..." type='text'>
                    <button onclick="commentPostSubmit(event)">Comment</button>
                </form>
                ${comment_html}
             </div>
        </div> `+html
        
    } 
    getPostUser()
})
}
getAllPosts()

const commentPostSubmit = event =>{
    event.preventDefault()
    let btn = event.target
    btn.setAttribute('disabled',true)
    let main_post_el = btn.closest('.single-post')
    let post_id = main_post_el.getAttribute('data-post_id')
    let html = main_post_el.querySelector('.post-comments').innerHTML
    let comment_value = main_post_el.querySelector('input').value
    main_post_el.querySelector('.post-comments').innerHTML += `<div class="single-post">${comment_value}</div>`

    let comment = new Comment()
    comment.content = comment_value  
    comment.user_id = session_id
    comment.post_id = post_id
    comment.create()
}

const removeMyPost = btn =>{
    
    let post_id = btn.closest('.single-post').getAttribute('data-post_id')
    btn.closest('.single-post').remove()
    let post = new Post()
    post.delete(post_id)
}

const likePost = btn =>{
    let main_post_el = btn.closest('.single-post')
    let post_id = main_post_el.getAttribute('data-post_id')
    let num_of_likes = +(btn.querySelector('span').innerText)
    btn.querySelector('span').innerText = num_of_likes +1 
    btn.setAttribute('disabled','true')
    let post = new Post()
    post.like(post_id,num_of_likes+1)
}   


/*const commentPost = btn=>{
    let main_post_el = btn.closest('.single-post')
    let post_id = main_post_el.getAttribute('data-post_id')
    main_post_el.querySelector('.post-comments').style.display = 'block'


}*/