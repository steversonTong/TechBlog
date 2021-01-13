const commentFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#comment-title').value;
  const content = document.querySelector('#comment-content').value;

  const post_id = document.location.href.substring(
    document.location.href.length - 1
  );

  if (content) {
    const response = await fetch(`/api/comments/${post_id}`, {
      method: 'POST',
      body: JSON.stringify({
        post_id,
        title,
        content,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/post/${post_id}`);
    } else {
      alert('Failed to post comment.');
    }
  } else {
    console.log('Comment must have a message.');
  }
};

document
  .querySelector('.comment-form')
  .addEventListener('submit', commentFormHandler);
