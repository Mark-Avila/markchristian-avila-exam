// Global Variables
const modal = document.getElementById("modalBackground");
const eventsWrapper = document.getElementById("eventsList");
let currentEvents = null;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Renders events HTML to the 'eventsList' parent
 *
 * @param {Array<object>} events - List of objects of events
 */
function renderEvents(events) {
  events.map((item, index) => {
    const container = document.getElementById("eventsList");

    // If events is less than 3 items, span them 3 columns
    if (events.length <= 3) {
      container.insertAdjacentHTML("beforeend", createEventHTML(item, 3));
    }

    // Span the first item 3 columns
    else if (index === 0) {
      container.insertAdjacentHTML("beforeend", createEventHTML(item, 3));
    }
    // Span the next two item 2 columns
    else if (index === 1 || index === 2) {
      container.insertAdjacentHTML("beforeend", createEventHTML(item, 2));
    }
    // Render following normally
    else {
      container.insertAdjacentHTML("beforeend", createEventHTML(item, 1));
    }
  });
}

/**
 * Creates the HTML string for the event
 *
 * @param {object} item - Object with event details
 * @param {1 | 2 | 3} rank - Specify priority of events, spans column based on rank 1 to 3
 * @returns HTML string with event details
 */
function createEventHTML(item, rank) {
  const { id, date, title, location, host, desc, image } = item;

  // Extract the day and month
  const datePattern = date.split(" ");
  const [month, day] = datePattern;

  let modifier = "";

  // Span 3 columns
  if (rank === 3) {
    modifier = "--upcoming";
  }
  // Span 2 columns
  else if (rank === 2) {
    modifier = "--secondary";
  }

  return `
        <div class="event ${modifier}">
        <div class="event__image">
          <div class="event__date">
            <div class="event__date__day">
              <p>${day.replace(",", "")}</p>
            </div>
            <div class="event__date__mon">
              <p>${month.toUpperCase()}</p>
            </div>
          </div>
          <img src="${image}" alt="event-image" />
        </div>
        <div class="event__content">
          <p class="event__datetime">
            ${date}
          </p>
          <p class="event__title">${title}</p>
          <p class="event__host">Hosted By Posted By <span>${host}</span></p>
          <p class="event__location">
            ${location}
          </p>
          <p class="event__description">
            ${desc.slice(0, 250)}...
          </p>
          <div class="event__btn">
            <button onclick="openModal(${id})">Read More</button>
          </div>
        </div>
      </div>
        `;
}

/**
 * Makes the modal visible with event details based on ID
 *
 * @param {number} id - Event ID
 */
function openModal(id) {
  document.body.style.overflowY = "hidden";

  // Find event with target ID
  const eventDetails = mockEvents.find((item) => item.id === id);

  if (!eventDetails) {
    console.error("Failed to find event");
    return;
  }

  const elTitle = document.getElementById("modalTitle");
  const elHost = document.getElementById("modalHost");
  const elDatetime = document.getElementById("modalDatetime");
  const elDescription = document.getElementById("modalDescription");
  const elLocation = document.getElementById("modalLocation");
  const elImage = document.getElementById("modalImageSrc");

  const { title, host, date, desc, location, image } = eventDetails;

  // Fill in details
  elImage.src = image;
  elTitle.innerText = title;
  elHost.innerText = host;
  elDatetime.innerText = date;
  elDescription.innerText = desc;
  elLocation.innerText = location;

  // Render modal
  modal.style.display = "flex";
}

/**
 * Closes or hides the modal
 */
function closeModal() {
  document.body.style.overflowY = "auto";
  modal.style.display = "none";
}

/**
 * Filters events with dates later than target date
 *
 * @param {Array<object>} events - List of objects of events
 * @param {string} date - Target date in yyyy-MM-dd format
 * @returns {Array<object>} List of objects with dates later than target date
 */
function filterEventsByDate(events, date) {
  const parsedDate = new Date(date);

  // Write date to header label
  const headerLabel = document.getElementById("headerLabel");
  headerLabel.innerText = `Events from ${
    monthNames[parsedDate.getMonth()]
  } ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;

  return events.filter((event) => {
    // Extract the date part from the event date string
    const eventDateStr = event.date.split(",");
    const eventDate = new Date(`${eventDateStr[0]},${eventDateStr[1]}`);

    // Return if event date is greater or later than the target date
    return eventDate > parsedDate;
  });
}

/**
 * Filters events with search string
 *
 * @param {Array<object>} events - List of objects of events
 * @param {string} substring - Search string
 * @returns {Array<object>} List of objects that includes search string
 */
function filterEventsBySearch(events, substring) {
  // Filter the events
  return events.filter((event) => {
    // Check if the event title contains the specified substring
    return event.title.toLowerCase().includes(substring.toLowerCase());
  });
}

/**
 * Debounces or adds delay before executing function, used in 'oninput' event of search input
 *
 * @param {(args) => any} func - Function to execute
 * @param {number} delay - Delay before executing in miliseconds
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Handles date input 'onchange' event
 *
 * @param {HTMLInputElement} event - HTML Date Input event
 */
function handleDateChange(event) {
  currentEvents = filterEventsByDate(mockEvents, event.target.value);
  eventsWrapper.innerHTML = ""; //Clear all children first
  renderEvents(currentEvents); //Re-render
}

/**
 * Handles search input 'oninput' event
 *
 * @param {HTMLInputElement} event - HTML Text Input event
 */
function handleSearchChange(event) {
  currentEvents = filterEventsBySearch(mockEvents, event.target.value);
  eventsWrapper.innerHTML = ""; //Clear all children first
  renderEvents(currentEvents); //Re-render
}

/**
 * Increases or decreases the date of the 'dateInput' element by a month
 *
 * @param {"left" | "right"} direction - 'left' or 'right' to decrease or increase by a month
 */
function shiftMonth(direction) {
  // Get date input value
  const dateInput = document.getElementById("dateInput");
  let currentDate = dateInput.value;
  currentDate = new Date(currentDate);
  let newDate = currentDate;

  switch (direction) {
    case "left": // Decrease by a month
      newDate.setMonth(currentDate.getMonth() - 1);
      break;
    case "right": // Increase by a month
      newDate.setMonth(currentDate.getMonth() + 1);
      break;
    default:
      newDate.setMonth(currentDate.getMonth() + 1);
      break;
  }

  // Set header label eg. 'Events from August 1, 2024'
  const headerLabel = document.getElementById("headerLabel");
  headerLabel.innerText = `Events from ${
    monthNames[newDate.getMonth()]
  } ${newDate.getDate()}, ${newDate.getFullYear()}`;

  // Converts Date to yyyy-MM-dd
  newDate = `${newDate.getFullYear()}-${("0" + (newDate.getMonth() + 1)).slice(
    -2
  )}-${("0" + newDate.getDate()).slice(-2)}`;

  dateInput.value = newDate; //Set the date input value

  const filteredEvents = filterEventsByDate(mockEvents, newDate); // Filter Events
  eventsWrapper.innerHTML = ""; //Clear all children/events first
  renderEvents(filteredEvents); // Re-render
}

// Events mock data
const mockEvents = [
  {
    id: 1,
    date: "Jul 30, 2024, Tuesday @ 1:00 pm - 11:00 pm",
    title: "Summer Scoop Trail",
    image: "./assets/thumb1.jpg",
    location:
      "Grand Hyatt Hotel, Pandora, J. P. Rizal St, 1634 Makati, Philippines",
    host: "DSM",
    desc: "Explore the sweetness of your neighborhood as you embark on an unforgettable In-house Ice Cream Crawl. Join us for this delectable event which invites participants to hop from one delightful establishment to another while indulging in an array of in-house artisan ice creams. Experience a tantalizing adventure through unique flavors, inventive toppings, and a charming ambiance that will transport you to a whimsical ice cream wonderland. Engage with local ice cream connoisseurs, engage in interactive activities, and sip on refreshing treats made with love. Tantalize your taste buds and create delightful memories during this delightful and satisfying event. ",
  },
  {
    id: 2,
    date: "Aug 15, 2024, Thursday @ 2:00 pm - Saturday, Aug 17, 2024 @ 8:00 pm",
    title: "Virtual Summer Labs",
    image: "./assets/thumb2.jpg",
    location: "Up Technohub, Matalino 24, 1100 Quezon City, Philippines",
    host: "DSM",
    desc: "Join us for a series of immersive VR Summer Workshops and elevate your skills in a professional setting. Experience innovative technology, enhance your knowledge, and grasp the latest trends in virtual reality. Dive into interactive, hands-on sessions crafted by industry experts to boost your expertise. ",
  },
  {
    id: 3,
    date: "Aug 30, 2024, Friday @ 6:00 am - 10:00 pm",
    title: "Team Recognition Showcase",
    image: "./assets/thumb3.jpg",
    location: "Hundred Islands Alaminos Pangasinan",
    host: "DSM",
    desc: "Celebrate and acknowledge the hard work and achievements of your dedicated team with a Professional Team Appreciation event. This exclusive gathering embodies sophistication, elegance, and a polished ambiance. Elevate your team's morale and foster a sense of unity through tailored experiences, such as keynote speeches, recognition ceremonies, interactive workshops, and networking opportunities. With thoughtful attention to detail and seamless event branding, our team is committed to creating an atmosphere that recognizes and appreciates your employees' contributions, strengthening their commitment, and igniting a renewed sense of loyalty to your organization. ",
  },
  {
    id: 4,
    date: "Sep 19, 2024, Thursday @ 2:00 pm - 11:00 pm",
    title: "Sip, Sample & Savor",
    image: "./assets/thumb4.jpg",
    location:
      "The Venice Residences - McKinley Hill, Veniza Residences Tower Emmanuel, Venezia Dr, 1634 Taguig City, Philippines",
    host: "DSM",
    desc: "Wine Tasting Event presented by BuzzWine: Experience an evening of absolute indulgence in our exquisite wine assortment. Imbibe exceptional flavors meticulously curated from around the globe, whilst diving into conversations with esteemed sommeliers and wine connoisseurs. ",
  },
  {
    id: 5,
    date: "Sep 29, 2024, Sunday @ 2:00 am - 8:00 pm",
    title: "Brews & Beats A National Coffee Celebration",
    image: "./assets/thumb5.jpg",
    location:
      "Café Poblacion, A. Mabini Ave 512, 1411 Caloocan City, Philippines",
    host: "DSM",
    desc: "Join us on National Coffee Day for a side-splitting celebration of everyone's favourite caffeinated beverage! Get ready to indulge in a variety of hilarious performances and cleverly crafted puns that will leave you brewing with laughter. It's the perfect blend of funny, puns, and coffee! ",
  },
  {
    id: 6,
    date: "Oct 15, 2024, Tuesday @ 6:00 am - 11:45 pm",
    title: "Global Handwashing Day",
    image: "./assets/thumb6.jpg",
    location: "Grand Ballroom, Crowne Plaza Hotel",
    host: "DSM",
    desc: "Global Handwashing Day is an immensely impactful and highly anticipated international event observed annually. Aimed at promoting proper hand hygiene practices worldwide, this celebration traverses borders and cultural boundaries with its powerful message. ",
  },
  {
    id: 7,
    date: "Oct 24, 2024, Thursday @ 6:00 am - 11:45 pm",
    title: "United Nations Day",
    image: "./assets/thumb7.jpg",
    location: "No Location",
    host: "DSM",
    desc: "Celebrate unity, diversity, and peaceful collaboration at the United Nations Day event. This global occasion serves as a platform to promote understanding and awareness among diverse cultures and nations. ",
  },
  {
    id: 8,
    date: "Nov 4, 2024, Monday @ 10:00 pm - Friday, Nov 8, 2024 @ 10:00 am",
    title: "World Jellyfish Day",
    image: "./assets/thumb8.jpg",
    location:
      "Boracay Island, Philippines, Pearl of the Pacific Beach Resort, 5608 Malay, Philippines",
    host: "DSM",
    desc: "As this is the season when jellyfish will start their migration to the shores of the northern hemisphere, World Jellyfish Day has been set to fall in the springtime in the southern hemisphere.",
  },
  {
    id: 9,
    date: "Nov 21, 2024, Thursday @ 6:00 am - 11:00 pm",
    title: "World Television Day",
    image: "./assets/thumb9.jpg",
    location:
      "Samsung, Bead Talk, Gen. Roxas Ave, 1109 Quezon City, Philippines",
    host: "DSM",
    desc: "The World Television Day is an annual event celebrating the influential power of television in our lives. This global event provides a platform to inspire and raise awareness about various aspects of television, including its impact on social, economic, and cultural development. From panel discussions with industry professionals to interactive workshops and film screenings, the event highly focuses on showcasing the innovation, creativity, and potential of television in sparking social change and entertainment. It brings together television enthusiasts, professionals from the broadcasting industry, content creators, and individuals passionate about the medium. Prepare to be immersed in a captivating and insightful celebration of the world of television. ",
  },
  {
    id: 10,
    date: "Dec 10, 2024, Tuesday @ 5:30 am - 11:45 pm",
    title: "International Children's Day",
    image: "./assets/thumb10.jpg",
    location: "Tanghalang Pasigueno, Kape de Pasig, 1600 Pasig, Philippines",
    host: "DSM",
    desc: "The International Children's Day event is a celebration dedicated to children from different cultures and backgrounds. This event aims to create an inclusive and joyous space for children to come together, engage in fun activities, and foster cross-cultural understanding. With a range of interactive workshops, creative arts and crafts sessions, lively performances, and educational exhibits, this event offers a unique and immersive experience for children and their families. From exhilarating games to delicious food stalls, the International Children’s Day event provides endless entertainment and learning opportunities, making it a day full of laughter, friendship, and memories for all attendees. ",
  },
  {
    id: 11,
    date: "Dec 25, 2024, Wednesday @ 10:00 am - 11:45 pm",
    title: "Yuletide Delight",
    image: "./assets/thumb11.jpg",
    location:
      "Shangri-La Plaza, The Village, Shaw Blvd, 1556 Mandaluyong, Philippines",
    host: "DSM",
    desc: "Christmas Day: Join us for a one-of-a-kind festive experience filled with merriment, joy, and holiday cheer! Step into a winter wonderland and rediscover the magic of Christmas through enchanting decorations and heartwarming carols.",
  },
];

currentEvents = mockEvents;

/**
 * Set value to dateInput element on load
 */
function initDate() {
  document.getElementById("dateInput").value = "2024-07-01";
}

initDate();
renderEvents(mockEvents);
