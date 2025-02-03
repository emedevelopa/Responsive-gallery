const input = document.querySelector('#header__search-input');
const search = document.querySelector('.header__search--btn');
const remove = document.querySelector('.header__remove--icon');
const containerImages = document.querySelector('.main__container');
const filterList = document.querySelector('#filter-list');

const API_KEY = "S_uUsVDujy8TiilL3wnYFgwoa5ZjACAdPwDM2OxYxxM"

input.addEventListener("input", () => {
    if(input.value.trim()!== "") {
        remove.style.display = "block" 
    } else {
        remove.style.display = "none"
    }
})

remove.addEventListener("input", () => {
    input.value = ""
    remove.style.display = "none" 
})

search.addEventListener("click", async () => {
    event.preventDefault();
    const query = input.value.trim() 
    console.log("busqueda",query)
    if (query === "") {
        alert("Porfavor, ingresa un texto de búsqueda")
        return
    }
    const images = await getImages(query)
    console.log('Imágenes obtenidas para la búsqueda:',images)
    displayImages(images)
})

filterList.addEventListener("click", async (event) => {
    event.preventDefault()
    if(event.target.tagName === "A") {
    const filter = event.target.getAttribute("data-filter")
    const images = await getImages(filter)
    displayImages(images)
    }
})

async function getImages (query) {
    const cacheKey = `images_${query}`;
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }
    
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=21&client_id=${API_KEY}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las imágenes');
        }
        const data = await response.json()
        sessionStorage.setItem(cacheKey, JSON.stringify(data.results));
        return data.results
    }
    catch (error) {
        console.error(error)
        return []
    }
}

function displayImages (images) {
    containerImages.innerHTML = ""

    const fragment = document.createDocumentFragment()

    images.forEach(image => {
        const cardContainer = document.createElement("div")
        cardContainer.classList.add("card")

        const imageCard = document.createElement("img")
        imageCard.classList.add("image__card")
        imageCard.dataset.src = image.urls.small
        imageCard.alt = image.alt_description || "Imagen de Unsplash";
        cardContainer.appendChild(imageCard)

        const imageFav = document.createElement("div")
        imageFav.classList.add("image__fav")

        const iconFav = document.createElement("i")
        iconFav.classList.add("bx", "bxs-heart", "bx-sm", "icon__fav")
        imageFav.appendChild(iconFav)
        cardContainer.appendChild(imageFav)

        const userContainer = document.createElement("div")
        userContainer.classList.add("user__container")

        const userImage = document.createElement("img")
        userImage.classList.add("user__image")
        userImage.dataset.src = image.user.profile_image.small

        const userName = document.createElement("span")
        userName.classList.add("user__name")
        userName.textContent = image.user.name

        userContainer.appendChild(userImage)
        userContainer.appendChild(userName)
        cardContainer.appendChild(userContainer)
        
        fragment.appendChild(cardContainer)
    })
    containerImages.appendChild(fragment)

    const lazyImages = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        observer.observe(img);
    });
}



document.addEventListener("DOMContentLoaded", async () => {
    const images = await getImages("random");
    console.log('Imágenes iniciales obtenidas:', images);
    displayImages(images);
})

//Random user
async function getRandomUser() {
    const url = `https://randomuser.me/api/`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("Error al obtener el usuario")  
        }
        const data = await response.json()
        return data.results
        }
    catch(error) {
        console.error(error)
        return []
    }
}
