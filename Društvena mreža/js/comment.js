class Comment{
    post_id=''
    user_id=''
    content=''
    apo_url='https://6318df0af6b281877c78d5a7.mockapi.io'
    create(){
        let data ={
           post_id: this.post_id,
           user_id: this.user_id,
           content : this.content
        }
        data = JSON.stringify(data)
        fetch(this.apo_url +'/comments',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },body:data
        }).then(response=>{
           return  response.json()
        }).then(data=>{

        })
    }
    async get(post_id){
       let response =await fetch(this.apo_url + '/comments')
       let data =await response.json()
       let post_comments = []
       let i = 0 
       data.forEach(item=>{
        if(item.post_id === post_id){
            post_comments[i] = item
            i++
        }
    })
        return post_comments
    }
}