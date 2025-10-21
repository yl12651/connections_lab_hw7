const postsList = document.querySelector('#posts');
const emptyState = document.querySelector('#empty-state');
const form = document.querySelector('#lfg-form');
const statusField = document.querySelector('#form-status');

// create a post card li element for a single post
const createPostElement = (post) => {
  let item = document.createElement('li');
  item.className = 'post-card';

  let title = document.createElement('h3');
  title.textContent = post.gameName;

  let meta = document.createElement('div');
  meta.className = 'post-meta';
  meta.innerHTML = `<span>Players: ${post.groupSize}</span>`;

  let description = document.createElement('p');
  description.className = 'post-description';
  description.textContent = post.description;

  item.append(title, meta, description);
  return item;
};

// for each post, check if empty or calls createPostElement() to render posts
const renderPosts = (posts) => {
  postsList.innerHTML = '';

  if (!posts.length) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  posts.forEach((post) => postsList.append(createPostElement(post)));
};

// read posts from index.js using /data route
const loadPosts = async () => {
  try {
    let response = await fetch('/data');
    let data = await response.json();
    renderPosts(data.posts);
  } catch (er) {
    console.error(er);
    emptyState.textContent = 'Unable to load posts. Try refreshing.';
    emptyState.classList.remove('hidden');
  }
};

// submit new post to index.js using /new-data route
const postFormData = async (payload) => {
  let response = await fetch('/new-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to save post.');
  }

  return response.json();
};

// calls postFormData() and handles callback message
const handleSubmit = async (event) => {
  event.preventDefault();
  statusField.textContent = 'Sending...';
  statusField.classList.remove('error');

  let formData = new FormData(form);
  let payload = Object.fromEntries(formData.entries());

  try {
    await postFormData(payload);
    statusField.textContent = 'Post ready for the game!';
    form.reset();
    loadPosts();
  } catch (error) {
    statusField.textContent = error.message;
    statusField.classList.add('error');
  }
};

form.addEventListener('submit', handleSubmit);

window.addEventListener('DOMContentLoaded', () => {
  loadPosts();
});
