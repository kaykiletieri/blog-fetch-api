const endpoint = 'https://jsonplaceholder.typicode.com/posts'

const loadingElement = document.querySelector('.loading')
const postContainer = document.querySelector('.post')

const postPage = document.querySelector('.post__container')
const commentsContainer = document.querySelector('.comentarios')

const commentForm = document.querySelector('.comentarios__form')
//console.log(commentForm)
const emailInput = document.querySelector('#email')
//console.log(emailInput)
const bodyInput = document.querySelector('#comentario')
//console.log(bodyInput)

//Receber id do url
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get('id')

//Receber todos os posts
async function getAllPosts() {
    const response = await fetch(endpoint)
    //console.log(response)

    const data = await response.json()
    //console.log(data)

    loadingElement.classList.add('hide')

    data.map((post) => {
        const div = document.createElement('div')
        const title = document.createElement('h2')
        const body = document.createElement('p')
        const link  = document.createElement('a')

        title.innerText = post.title
        body.innerText = post.body
        link.innerText = 'ler'
        link.setAttribute('href', `/post.html?id=${post.id}`)

        div.appendChild(title)
        div.appendChild(body)
        div.appendChild(link)

        postContainer.appendChild(div)
    })
}

//Receber post individual
async function getPost(id) {
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${endpoint}/${id}`),
        fetch(`${endpoint}/${id}/comments`)
    ])

    const dataPost = await responsePost.json()
    const dataComments = await responseComments.json()
    //console.log(dataComments)
    //console.log(dataPost)

    loadingElement.classList.add('hide')
    postPage.classList.remove('hide')

    const title = document.createElement('h1')
    const body = document.createElement('p')

    title.innerText = dataPost.title
    body.innerText = dataPost.body

    postContainer.appendChild(title)
    postContainer.appendChild(body)

    dataComments.map((comment) => {
        createComment(comment)
    })
}

function createComment(comment) {
    const div = document.createElement('div')
    const email = document.createElement('h3')
    const commentBody = document.createElement('p')

    email.innerText = comment.email
    commentBody.innerText = comment.body

    div.appendChild(email)
    div.appendChild(commentBody)

    commentsContainer.appendChild(div)
}

//Post comentario
async function postComment(comment) {
    const response = await fetch(endpoint, {
      method: "POST",
      body: comment,
      headers: {
        "Content-type": "application/json",
      },
    });
  
    const data = await response.json();
  
    createComment(data);
  }


if(!postId) {
    getAllPosts()
} else {
    getPost(postId)

    //evento no formulario botao
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        }
        //console.log(comment)

        comment = JSON.stringify(comment)
        postComment(comment);
    })
}