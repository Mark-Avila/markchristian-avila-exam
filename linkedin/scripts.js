// Mock data to demo multiple images
const postWithImages = {
  id: "123456712345671234",
  username: "sociablekit-hq",
  is_pinned: "0",
  article_title: "",
  post_date_time: "2024-07-10T16:34:21+08:00",
  description: `<!---->Thank you, John! We're glad you like our widgets and appreciate your kind words about our support team. We%27re here to help anytime you need us!<span class=white-space-pre> </span><span><br></span><span><br></span><a class=app-aware-link  href=https://www.linkedin.com/feed/hashtag/?keywords=happycustomer&amp;highlightedUpdateUrns=urn%3Ali%3Aactivity%3A7216709049180913664 data-test-app-aware-link=><span><span aria-hidden=true>#</span>HappyCustomer</span></a><span class=white-space-pre> </span><!----><!----><a class=app-aware-link  href=https://www.linkedin.com/feed/hashtag/?keywords=topnotchsupport&amp;highlightedUpdateUrns=urn%3Ali%3Aactivity%3A7216709049180913664 data-test-app-aware-link=><span><span aria-hidden=true>#</span>TopNotchSupport</span></a><span class=white-space-pre> </span><!----><!----><a class=app-aware-link  href=https://www.linkedin.com/feed/hashtag/?keywords=widgets&amp;highlightedUpdateUrns=urn%3Ali%3Aactivity%3A7216709049180913664 data-test-app-aware-link=><span><span aria-hidden=true>#</span>Widgets</span></a><span class=white-space-pre> </span><!----><!----><a class=app-aware-link  href=https://www.linkedin.com/feed/hashtag/?keywords=sociablekit&amp;highlightedUpdateUrns=urn%3Ali%3Aactivity%3A7216709049180913664 data-test-app-aware-link=><span><span aria-hidden=true>#</span>SociableKIT</span></a>`,
  images: [
    "https://media.licdn.com/dms/image/D5610AQG15BrO8M_BtA/image-shrink_800/0/1720597516703?e=1721210400&v=beta&t=BU3KNcTEK5D3i9SklZ6_-FaLGoZLjPJu9CJv72bEeIE",
    "https://media.licdn.com/dms/image/D5610AQFV3b1HIqdDoA/image-shrink_800/0/1720430366580?e=1721282400&v=beta&t=Sc58WwuwvnEq68VAnz7R0CaRgRnTljIAbhfwbwr36RU",
    "https://media.licdn.com/dms/image/D5610AQFU-ed50ke73g/image-shrink_800/0/1720425624585?e=1721282400&v=beta&t=6whYbzjHO_IK6cj2JjEVJmGWyr6D6s9S2HnYaRhg_Eg",
    "https://media.licdn.com/dms/image/D5610AQHbk-KhXXBSGA/image-shrink_800/0/1720422765011?e=1721282400&v=beta&t=6WrtREzQe1LFKWj5TBAQKnKovzumSVyjtcFD-P07IqE",
    "https://media.licdn.com/dms/image/D5610AQG_subnpdhxaw/image-shrink_800/0/1720310414340?e=1721282400&v=beta&t=t0wX-1vEumu7lw5DF6jo0P1OYtvyP6_lCjh5mDd6htM",
  ],
  image_urls: [
    "https://images.sociablekit.com/images/linkedin-page-posts/32627/7216709049180913664-images-0.jpg?nocache=1720604061149",
  ],
  thumbnail: "",
  thumbnail_url:
    "https://images.sociablekit.com/images/linkedin-page-posts/32627/7216709049180913664-images-0.jpg?nocache=1720604061149",
  shared_profile_img: "",
  video_url: "",
  post_url:
    "https://www.linkedin.com/feed/update/urn:li:activity:7216709049180913664",
  likes_count: "0",
  comments_count: "0",
  embed_source: "",
  shared_post_owner_picture: "",
  shared_post_owner_name: "",
  shared_post_date: "",
  shared_post_owner_description: "",
  order: "9999",
  reposted: "0",
};

//Global values
let toggle = true;
let posts = null;
let blobUrl = null;
let imageIndex = 0;
const itemsPerPage = 9; // Number of items to show per page (-1)
let currentPage = 1; // Track current page
const video = document.getElementById("video");
const embed = document.getElementById("videoEmbed");

/**
 * Creates the HTML string or template of a post item
 *
 * @param {object} post - Post item from endpoint
 *
 * @returns {string} - The post HTML string template
 */
function createPostHTML(post) {
  const {
    id,
    username,
    images,
    description,
    post_date_time,
    likes_count,
    comments_count,
    video_url,
    embed_source,
    thumbnail_url,
    order,
  } = post;

  // Convert date to readable format (1 Jan 2000)
  const date = new Date(post_date_time);
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = date
    .toLocaleDateString("en-GB", options)
    .replace(/\//g, " ");

  return ` 
  <div id='post-${order}' class="post">
    <div class="post__header">
      <div class="post__details">
        <div class="post__pic">
          <img src="./assets/profile.jpg" />
        </div>
        <div class="post__user">
          <p class="fluid post__name">${username}</p>
          <p class="fluid post__date">${formattedDate}</p>
        </div>
      </div>
      <div>
        <button class="post__share">
          <img src="./assets/share-solid.svg" alt="share-icon" />
        </button>
      </div>
    </div>
    <div class="post__body">
      <p class="post__desc">${description.replace(/%27/g, "'")}</p>
      ${
        !video_url && images && images.length > 0
          ? `
      <ul
        class="post__media fluid"
        onclick="openModal('${id}')"
      >
        ${images
          .slice(0, 6)
          .map(
            (image) =>
              `<li>
                <img
                  src="${image}"
                  onerror="handleImageError(event)"
                  alt="post-image"
                />
              </li>`
          )
          .join("")}
      </ul>
      `
          : ""
      }
      ${
        video_url
          ? `<ul
        class="post__media fluid"
        onclick="openVideo('${embed_source}')"
      >
          <li class="post__video">
              <div>
                <img src="./assets/play.svg" alt="play-icon"/>
              </div>
              <img
                src="${thumbnail_url}"
                alt="post-image"
              />
          </li>
      </ul>
      `
          : ""
      }
    </div>
    <div class="post__footer">
      <div class="post__action">
        <button>
          <img src="./assets/thumbs-up.svg" alt="thumbsup-icon" />
        </button>
        <p>${likes_count}</p>
      </div>
      <div class="post__action">
        <button>
          <img src="./assets/comments.svg" alt="comments-icon" />
        </button>
        <p>${comments_count}</p>
      </div>
    </div>
  </div>`;
}

/**
 * Handles the image error event.
 *
 * @param {Event} event - The error event object
 * @param {string} id - The post ID
 */
function handleImageError(event) {
  const img = event.target;
  img.src = "./assets/notfound.jpg";
}

/**
 * Shift the current post modal's image index to the left
 *
 * @param {string} id - Post ID
 */
function toggleLeft(id) {
  const { images } = posts.find((post) => post.id === id);
  const elImage = document.getElementById("modalImageSrc");

  // Is on the first image
  if (imageIndex === 0) {
    imageIndex = images.length - 1; // Go to the last image
  } else {
    imageIndex = imageIndex - 1;
  }

  elImage.src = images[imageIndex];
}

/**
 * Shift the current post modal's image index to the right
 *
 * @param {string} id - Post ID
 */
function toggleRight(id) {
  const { images } = posts.find((post) => post.id === id);
  const elImage = document.getElementById("modalImageSrc");

  const isLastPage = images.length - 1 === imageIndex;

  // Is on the last image
  if (isLastPage) {
    imageIndex = 0; // Go to the first image
  } else {
    imageIndex = imageIndex + 1;
  }

  elImage.src = images[imageIndex];
}

/**
 * Open modal with relevant data from post ID
 *
 * @param {string} id - Post item ID
 */
function openModal(postId) {
  const postInfo = posts.find((post) => post.id === postId);

  // Handle no posts found
  if (!postInfo) {
    console.error("Post ID was not found");
    return;
  }

  const { id, username, images, description, likes_count, comments_count } =
    postInfo;

  // Modal elements
  const elUsername = document.getElementById("modalName");
  const elDesc = document.getElementById("modalDesc");
  const elImage = document.getElementById("modalImageSrc");
  const elLikes = document.getElementById("modalLikes");
  const elComments = document.getElementById("modalComments");
  const elModal = document.getElementById("modal");

  // Display image arrows if there are more than 1 images
  const elArrows = document.getElementById("modalArrows");
  if (images.length === 1) {
    elArrows.style.display = "none";
  } else {
    elArrows.style.display = "block";
    const leftButton = document.getElementById("modalLeft");
    const rightButton = document.getElementById("modalRight");
    leftButton.onclick = () => toggleLeft(id);
    rightButton.onclick = () => toggleRight(id);
  }

  // Set values to elements
  if (elUsername) elUsername.innerText = username;
  if (elImage && images) elImage.src = images[imageIndex];
  if (elDesc) elDesc.innerHTML = description.replace(/%27/g, "'"); //String of description has the aposthropes URL encoded
  if (elLikes) elLikes.innerText = likes_count;
  if (elComments) elComments.innerText = comments_count;

  // Hide the scroll of the whole webpage when modal is opened
  document.body.style.overflow = "hidden";

  // Open modal
  if (elModal) elModal.style.display = "flex";
}

/**
 * Close post modal
 */
function closeModal() {
  const modal = document.getElementById("modal");

  imageIndex = 0; // Reset images page number to 0
  document.body.style.overflow = "auto"; // Make the webpage scroll visible again
  modal.style.display = "none";
}

/**
 * Open video embed player
 *
 * @param {string} src - Embed source
 */
function openVideo(src) {
  // Hide the scroll of the whole webpage when modal is opened
  document.body.style.overflow = "hidden";
  embed.src = src;
  video.style.overflowY = "auto";
  video.style.display = "flex";
}

/**
 * Open video embed player
 */
function closeVideo() {
  embed.src = ""; //Reload iframe src to stop playback
  document.body.style.overflow = "auto"; // Make the webpage scroll visible again
  video.style.overflowY = "hidden";
  video.style.display = "none";
}

/**
 * Fetch post data from endpoint
 */
async function fetchPosts() {
  const ENDPOINT =
    "https://data.accentapi.com/feed/32627.json?nocache=1720496822996";

  const res = await fetch(ENDPOINT);
  const data = await res.json();
  posts = data.posts;
}

/**
 * Function to render items for the current page
 *
 * @param {number} page - Current Page number
 */
function renderPosts(page) {
  // For tablet/desktop screen sizes
  const leftColumn = document.getElementById("left");
  const rightColumn = document.getElementById("right");

  //For mobile screen sizes, used to keep the original order of posts even in mobile view
  const mobileWrapper = document.getElementById("postsMobile");

  // Get the start and end indecies for next number of posts
  const start = (page - 1) * (itemsPerPage + 1);
  const end = start + (itemsPerPage + 1);

  posts.slice(start, end).forEach((post) => {
    let postHTML = createPostHTML(post);

    // Used to achieve masonry grid layout
    if (toggle) {
      leftColumn.insertAdjacentHTML("beforeend", postHTML);
    } else {
      rightColumn.insertAdjacentHTML("beforeend", postHTML);
    }

    toggle = !toggle;

    mobileWrapper.insertAdjacentHTML("beforeend", postHTML);
  });
}

/**
 * handles loading more posts
 */
function loadPosts() {
  currentPage++;
  renderPosts(currentPage);

  // Hide the load more button if all items are loaded
  if (currentPage * itemsPerPage >= posts.length) {
    const loadMoreBtn = document.getElementById("postLoadMore");
    loadMoreBtn.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchPosts();
  } catch (err) {
    console.error(err);
  }

  // Insert mock post with multiple images
  posts.unshift(postWithImages);
  renderPosts(currentPage);
});
