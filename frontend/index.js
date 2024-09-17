import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('posts');
    const newPostBtn = document.getElementById('newPostBtn');
    const newPostForm = document.getElementById('newPostForm');
    const postForm = document.getElementById('postForm');

    // Initialize TinyMCE
    tinymce.init({
        selector: '#body',
        plugins: 'link image code',
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | link image | code'
    });

    // Fetch and display posts
    async function displayPosts() {
        const posts = await backend.getPosts();
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h2>${post.title}</h2>
                <div class="meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</div>
                <div class="content">${post.body}</div>
            `;
            postsContainer.appendChild(article);
        });
    }

    // Show/hide new post form
    newPostBtn.addEventListener('click', () => {
        newPostForm.style.display = newPostForm.style.display === 'none' ? 'block' : 'none';
    });

    // Handle form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const body = tinymce.get('body').getContent();

        await backend.createPost(title, body, author);
        postForm.reset();
        tinymce.get('body').setContent('');
        newPostForm.style.display = 'none';
        displayPosts();
    });

    // Initial display of posts
    displayPosts();
});
