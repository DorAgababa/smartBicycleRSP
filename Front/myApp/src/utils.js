import { SetAlert } from "./App";
import { State } from "./components/Alert";

export const Sleep = sec => new Promise(r => setTimeout(r, sec*1000));

export function saveToLocalStorage(key, value) {
    const timestamp = new Date().getTime(); // Get current timestamp
    const dataToSave = {
        timestamp: timestamp,
        data: value
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
  }

  export function getFromLocalStorage(key) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue).data : null;
  }
  export function getFromLocalStorageKeyTime(key) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue).timestamp : null;
  }
  export function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
  }

  export function calculateTimeDifferenceInMinutes(savedTimestamp) {
    try{
      if (savedTimestamp) {
        const currentTime = new Date().getTime();
        const savedTime = new Date(savedTimestamp).getTime();
        console.log(`saved time ${savedTime}`)
        const timeDifferenceInMillis = currentTime - savedTime;
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInMillis / (1000 * 60));
        return timeDifferenceInMinutes;
    } else {
        return null;
    }
    }
    catch(e){
      return null
    }
}

export function updateTimestamp(key) {
  const savedData = localStorage.getItem(key);
  if (savedData) {
      const parsedData = JSON.parse(savedData);
      parsedData.timestamp = new Date().getTime();
      localStorage.setItem(key, JSON.stringify(parsedData));
      console.log("timesmaped "+key +" " + parsedData.timestamp)
  } else {
      console.log('timestamp failed');
  }
}

  export function getRequest(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // or response.json() for JSON data
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
        return null;
      });
  }

  export async function postRequest(apiEndpoint,body,failMessage="Oops something failed") {
    try {
      let requestOptions = {
        method: 'POST',
        body: JSON.stringify(body)
      };
      let response = await window.fetch(apiEndpoint, requestOptions);
      document.getElementById("obj").innerHTML = "";
      response = await response.json()
      console.log("postRequestBody "+JSON.stringify(body))
      console.log(response)
      return JSON.parse(response.body)
  } catch (error) {
      SetAlert(failMessage, "", State.danger);
      console.log(error)
      return null
  }
  }


  export async function fetchDataFromGovmap(place) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
    const apiUrl = `https://es.govmap.gov.il/TldSearch/api/AutoComplete?query=${encodeURIComponent(place)}&ids=${randomNumber}&gid=govmap`;
    const response  = await getRequest(apiUrl)
    const jsonResponse = JSON.parse(response);
    let arr=[]
    for (const key in jsonResponse.res) {
      if (jsonResponse.res.hasOwnProperty(key)) {
        jsonResponse.res[key].forEach(e => {
          arr.push(e.Value.replace(/[^\u0591-\u05F4\s]/g, ''))
        });;
      }
    }
    arr = arr.filter((item, index) => arr.indexOf(item) === index); 
    return arr;
  }

  // Debounce function
  export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };


  export function directionFlip(direction){
    if(direction=="rtl")return "ltr"
    if(direction=="ltr")return "rtl"
    return ""
  }

  export function isIOS() {
    console.log(navigator.userAgent);
    return /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
  }

  export const centeredProperty ={display:"flex",justifyContent:'center',alignItems:"center"}

  export function isMobile() {return window.innerWidth < 768}

  export function getLanguage() {return getFromLocalStorage("Language") == "IL" || undefined ? "HE" : "EN"}

  export function downloadImage(readyImage,originalImage) {
    var a = document.createElement('a');
    a.href = readyImage;
    a.download = 'image.'+originalImage.fileType; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export async function slideAllElementToLeft(color) {
  document.body.style.backgroundColor = color;
  var buttons = document.querySelectorAll('.content');
  
  buttons.forEach(function(button) {
    button.classList.add('disappear');
  });

  await Sleep(0.9)
}