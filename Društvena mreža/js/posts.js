class Post{
    post_id = ''
    post_content = ''
    user_id = ''
    likes = ''
    api_url = 'https://6318df0af6b281877c78d5a7.mockapi.io'
    async create(){
        let session = new Session()
        session_id = session.getSession()
        let data={
            user_id:session_id,
            content:this.post_content,
            likes : 0
        }
        data= JSON.stringify(data)
        let response = await fetch(this.api_url+'/posts',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },body:data
        })
         data =await response.json()
         return data
    }
    async getAllPosts(){
        let response = await fetch(this.api_url + '/posts')
        let data = await response.json()
        return data
    }
    like(post_id,likes){
        let data = {
            likes : likes
        }
        data = JSON.stringify(data)
        fetch(this.api_url + '/posts/' + post_id,{
            method:"PUT",
            headers:{
                'Content-Type' : "application/json"
            },body:data

        }).then(response=>{
            response.json()
        }).then(data=>{{

        }})
        
    }
    delete(post_id){
        fetch(this.api_url+'/posts/'+post_id,{
            method:"Delete",
        }).then(response=>  {
          response.json()}
            ).then(data=>{

        })
    }
}