
const updateStore = function name() {
    let store = Immutable.Map({
        user: { name: "Udacity" },
        apod: '',
        rovers: { Curiosity: { name: "Curiosity" }, Opportunity: { name: 'Opportunity' }, Spirit: { name: 'Spirit' } },
        selectedRover: 'Curiosity'
    })
    return function (newState) {
        store = store.mergeDeep(newState)
        const root = document.getElementById('root')
        render(root, store)
    }
}()


// create content
// const App = (state) => {
//     let { rovers, apod } = state


//     return `
//         <header></header>
//         <main>
//             ${Greeting(store.user.name)}
//             <section>
//                 <h3>Put things on the page!</h3>
//                 <p>Here is an example section.</p>
//                 <p>
//                     One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
//                     the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
//                     This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
//                     applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
//                     explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
//                     but generally help with discoverability of relevant imagery.
//                 </p>
//                 ${ImageOfTheDay(apod)}
//             </section>
//         </main>
//         <footer></footer>
//     `
// }
const App = (state) => {
    const rovers = state.get("rovers")
    const roverInStore = rovers[state.get("selectedRover")];
    return `<header></header>
        <main>
            <section>
                <h3>Rovers</h3>
                <div class="tab_bar">
                    ${renderRoverName(rovers, state)}
                </div>

                <div class="rover_detail_container">
                    ${RoverContent(roverInStore)}
                </div>
            </section>
        </main>
        <footer></footer>`
}

const render = async (root, state) => {
    // root.innerHTML = App(state)
    root.innerHTML = App(state)
}


// function roverNameClickHandler(e) {
//     store.selectedRover = e.target.textContent;
//     const root = document.getElementById('root')

//     render(root, store);
// }



// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    updateStore({})
    const allRoverNames = document.querySelectorAll(".rover_name");
    // allRoverNames.forEach((roverNameEle) => roverNameEle.addEventListener("click", roverNameClickHandler))
})



// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const switchTab = (roverName) => {
    updateStore({ selectedRover: roverName })
}

const renderRoverName = (rovers, state) => {
    const selectedRover = state.get("selectedRover")
    return Object.values(rovers).reduce((prev, cur) => prev + `<span class="rover_name" onclick="switchTab('${cur.name}')"  id=${selectedRover === cur.name ? "selected_rover" : ""}>${cur.name}</span>`, "")
}

// Example of a pure function that renders infomation requested from the backend
const RoverContent = (roverContent) => {
    if (!roverContent.max_date) {
        getRoverContent(roverContent.name);
        return ``
    } else {
        if (!roverContent.photo) {
            getRoverImage(roverContent)
        }
        return (`
            <div class="rover_detail">
                <div class="detail_row"><p>Name:</p> <p>${roverContent.name}</p></div>
                <div class="detail_row"><p>Landing Date:</p> <p>${roverContent.landing_date}</p></div>
                <div class="detail_row"><p>Launch Date:</p> <p>${roverContent.launch_date}</p></div>
                <div class="detail_row"><p>Status:</p> <p>${roverContent.status}</p></div>
                <div>Latest Picture:</div>
                <img src="${roverContent.photo || ""}" alt="rover image loading" />
            </div>
                `)
    }
}
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
// const getImageOfTheDay = (state) => {
//     let { apod } = state

//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))

//     return data
// }



const getRoverContent = (roverName) => {

    fetch(`http://localhost:3000/rovers?rover_name=${roverName}`)
        .then(res => res.json())
        .then(({ rover }) => updateStore({ rovers: { [rover.name]: rover } }))
}


const getRoverImage = (rover) => {
    fetch(`http://localhost:3000/roverimage?rover_name=${rover.name}&earth_date=${rover.max_date}`)
        .then(res => res.json())
        .then(({ photo }) => updateStore({ rovers: { [rover.name]: { ...rover, photo } } }))
}
