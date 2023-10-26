async function fetchUsername(userId) {
  const userEndpoint = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userEndpoint);
  const userData = await response.json();
  return userData.name;
}

async function retrieveDataForPosts(page = 1) {
  const postsEndpoint = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsEndpoint);
  const postsData = await response.json();
  return postsData;
}

async function retrieveDataForComments(postId) {
  const commentsEndpoint = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsEndpoint);
  const commentsData = await response.json();
  return commentsData;
}

function extractPostIdFromDetail(detailElement) {
  const articleElement = detailElement.previousElementSibling;
  const articleData = articleElement.dataset;
  return articleData.postId;
}

function createArticleElement(postData) {
  const articleElement = document.createElement("article");
  articleElement.setAttribute("data-post-id", postData.id);

  const headingElement = document.createElement("h2");
  headingElement.textContent = postData.title;
  articleElement.appendChild(headingElement);

  const asideElement = document.createElement("aside");
  const spanElement = document.createElement("span");
  spanElement.className = "author";
  asideElement.textContent = "by ";
  asideElement.appendChild(spanElement);
  articleElement.appendChild(asideElement);

  const paragraphElement = document.createElement("p");
  paragraphElement.innerHTML = postData.body.replace(/\n/g, "<br>");
  articleElement.appendChild(paragraphElement);

  return articleElement;
}

async function appendArticlesToMainContainer(postsData) {
  const mainContainer = document.querySelector("main");

  for (const postData of postsData) {
    const articleElement = createArticleElement(postData);
    mainContainer.appendChild(articleElement);

    const userName = await fetchUsername(postData.userId);
    articleElement.querySelector(".author").textContent = userName;

    const detailsElement = document.createElement("details");
    const summaryElement = document.createElement("summary");
    summaryElement.textContent = "See what our readers had to say...";
    detailsElement.appendChild(summaryElement);
    const sectionElement = document.createElement("section");
    const headerElement = document.createElement("header");
    const h3Element = document.createElement("h3");
    h3Element.textContent = "Comments";
    headerElement.appendChild(h3Element);
    sectionElement.appendChild(headerElement);
    detailsElement.appendChild(sectionElement);

    mainContainer.appendChild(detailsElement);
  }
}

async function displayPostsAndComments() {
  const postsData = await retrieveDataForPosts();
  await appendArticlesToMainContainer(postsData);

  const detailsElements = document.getElementsByTagName("details");
  for (const detailsElement of detailsElements) {
    detailsElement.addEventListener("toggle", async (event) => {
      if (detailsElement.open) {
        const sectionElement = detailsElement.querySelector("section");
        const asideElements = sectionElement.querySelectorAll("aside");

        if (asideElements.length === 0) {
          const postId = extractPostIdFromDetail(detailsElement);
          const commentsData = await retrieveDataForComments(postId);

          console.log(`Comments for postId ${postId}:`, commentsData);

          commentsData.forEach((comment) => {
            const asideElement = document.createElement("aside");
            const commentTextElement = document.createElement("p");
            const commentAuthorElement = document.createElement("small");

            commentTextElement.innerHTML = comment.body.replace(/\n/g, "<br>");
            commentAuthorElement.textContent = comment.name;

            asideElement.appendChild(commentTextElement);
            asideElement.appendChild(commentAuthorElement);
            sectionElement.appendChild(asideElement);
          });
        }
      }
    });
  }
}
displayPostsAndComments();
