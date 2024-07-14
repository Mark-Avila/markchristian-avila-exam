const mockVideos = [
  {
    title:
      "Embed Meetup group events on your website for FREE #sociablekit #embed",
    image: "./assets/thumb1.jpg",
  },
  {
    title:
      "Embed Instagram profile on your website for FREE #sociablekit #embed",
    image: "./assets/thumb2.jpg",
  },
  {
    title:
      "Embed Linked page posts feed on your website for FREE #sociablekit #embed",
    image: "./assets/thumb3.jpg",
  },
  {
    title:
      "Embed Linkedin profile posts feed on your website for FREE #sociablekit #embed",
    image: "./assets/thumb4.jpg",
  },
  {
    title: "SociableKIT Reviews from our customers! #sociablekit #reviews",
    image: "./assets/thumb5.jpg",
  },
];

let previousNumber = null;

/**
 * Generates a random number between 1 to 5
 * @returns {number} Generated number
 */
function getRandomNumber() {
  let newNumber;
  do {
    newNumber = Math.floor(Math.random() * 5);
  } while (newNumber === previousNumber);
  previousNumber = newNumber;
  return newNumber;
}

const videosCount = 12;
const videoLists = document.getElementsByClassName("video__list");

/**
 * Fill video list with randomly selected elements from the mock data
 */
for (let el = 0; el < videoLists.length; el++) {
  for (let i = 0; i < videosCount; i++) {
    const videoIndex = getRandomNumber();
    const { image, title } = mockVideos[videoIndex];
    videoLists[el].insertAdjacentHTML(
      "beforeend",
      `
            <div class="video__item">
            <div class="video__thumbnail">
              <img
                class="video__thumbsrc"
                src="${image}"
                alt="video-thumbnail"
              />
              <img
                class="video__playico"
                src="./assets/play.svg"
                alt="video-play-icon"
              />
            </div>
            <p class="video__title">
    ${title}
            </p>
          </div>
                `
    );
  }
}

/**
 * Handle horizontal scroll for videoList element with '--horizontal' class
 *
 * @param {-1 | 1} direction - Left (-1) or Right (1)
 */
function scrollItems(direction) {
  const container = document.getElementById("featuredList");
  const scrollAmount = (container.offsetWidth / 3) * direction;

  container.scrollLeft += scrollAmount;
}
