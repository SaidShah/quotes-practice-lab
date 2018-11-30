//Populate page with quotes with a GET
const url = "http://localhost:3000/quotes"
document.addEventListener("DOMContentLoaded",(event)=>{

  // fetch data and take the promise and return it to the display method
  fetchData().then(displayQuotes)
  // adding an event listener to listen for the submission of a new quote, given args is event and callback
  document.getElementById("new-quote-form").addEventListener("submit",createQuote)
  // grabbing the quote conatiner to listen for clicks and using a callback
  document.getElementById("quote-list").addEventListener("click", likeOrDeleteClicked)
})

// fetch the data and return a promise
function fetchData() {
  return fetch(url)
  .then(response => response.json())
}
// fetch for creating a new quote
function createQuoteFetch(givenQuote) {
  fetch(url,{method: "POST",// the method post and the url for the post req
  headers:{"Content-Type":"application/json"},// the header for the post request
  body: JSON.stringify(givenQuote)// changing data to json format
 })
}

function deleteQuoteFetch(givenId) {
  // using the fetch to pass in id and delete id
  fetch(url+`/${givenId}`, {method:"DELETE"})
}

function patchFetch(givenId, givenLikes) {
  // making a fetch with a patch method
  fetch(url+`/${givenId}`, {method: "PATCH",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify({likes:givenLikes})
  })
}

function editQuoteFetch(givenData,givenId){

  fetch(url+`/${givenId}`,{method: "PATCH",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify(data)
})
}

// receieveing a array of quote data
function displayQuotes(givenQuotes) {
  // receiving an array of quotes to display
  const ul = document.getElementById("quote-list")
  // refreshing the quote list
  ul.innerHTML=""
  // iterating through quotes to use each quote
  for(quote of givenQuotes){
    // creating a quote to add to ul
  const newQuote = `<li class='quote-card'>
                    <blockquote class="blockquote">
                      <p class="mb-0">${quote.quote}</p>
                      <footer class="blockquote-footer">${quote.author}</footer>
                      <br>
                      <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
                      <button class='btn-danger' data-id=${quote.id}>Delete</button>
                      <button class='btn-edit' data-id=${quote.id}>Edit</button>
                    </blockquote>
                  </li>`
  // adding quote to the ul
  ul.innerHTML+= newQuote
  }
}

function createQuote(givenEvent, givenId="") {
  const quote = document.getElementById("new-quote").value
  const author = document.getElementById("author").value
  let data;
  if(givenEvent.target.dataset.id === ""){
  // grabbing quote data
   data= {author: author, quote: quote, likes: 0}
   createQuoteFetch(data)// passing the data to the use in the fetch req for a new quote
  }else{
    data ={author: author, quote: quote}
    editQuoteFetch(data,givenId)
 }
}

function likeOrDeleteClicked(givenEvent) {
  // checking which button was clicked and routing the click accordingly based on the click
  if(givenEvent.target.className === "btn-success"){
    //grabbing the number of likes and increasing by 1
    let likes = parseInt(givenEvent.target.firstElementChild.innerText)
    givenEvent.target.firstElementChild.innerText = ++likes
    // routing to like method if like button is clicked
    addLikeToQuote(givenEvent, likes)
  }else if (givenEvent.target.className === "btn-danger"){
    // removing the quote from the dom
    givenEvent.target.parentElement.parentElement.remove()
    // routing to delete method if like button is clicked
    deleteQuote(givenEvent)
  }else if (givenEvent.target.className === "btn-edit"){
      // grabbing the form and filling in the data
     document.getElementById("new-quote").value = givenEvent.target.parentElement.childNodes[1].innerText
     document.getElementById("author").value= givenEvent.target.parentElement.childNodes[3].innerText
     const id = givenEvent.target.dataset.id
     const form = document.getElementById("new-quote-form").lastElementChild
     form.id = id
     createQuote(givenEvent,id)
  }
}

function addLikeToQuote(givenEvent, givenLikes) {
  // getting the id and the likes and passing them to the fetch to do a patch
  const id = givenEvent.target.dataset.id
  patchFetch(id, givenLikes)
}

function deleteQuote(givenEvent) {
  // getting the id and passing it to the fetch to delete
  const id = givenEvent.target.dataset.id
  deleteQuoteFetch(id)
}
