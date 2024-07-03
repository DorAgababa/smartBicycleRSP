#!/usr/bin/env python
# coding: utf-8

# In[47]:


import os
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry






def download_image(name, url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    # Create a directory to save the images
    os.makedirs('images', exist_ok=True)
    session = requests.Session()
    retry = Retry(connect=3, backoff_factor=0.5)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    try:
        response = session.get(url, headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses
        image_path = os.path.join('images', name)
        with open(image_path, 'wb') as file:
            file.write(response.content)
        print(f"Downloaded {name}")
    except requests.exceptions.HTTPError as err:
        print(f"Failed to download {name} due to HTTP error occurred: {err}")
    except Exception as err:
        print(f"Failed to download {name} due to Other error occurred: {err}")




#function that get list of keys to search in wiki, and return the image urls of the this keys
def get_url_images_wiki(keys_to_search_wiki):
    # Wikipedia API endpoint
    wiki_api_url = "https://en.wikipedia.org/w/api.php"
    # Parameters for the API request
    params = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "prop": "pageimages|pageterms",
        "piprop": "original",
        "redirects": "1",  # Automatically resolve redirects
    }
    # Dictionary to store name and image URL pairs
    image_url_collection = {}
    unfindable_keys = []
    print("start searching for url images")
    # Fetch image URLs for each personality
    for key_name in keys_to_search_wiki:
        params["titles"] = key_name
        response = requests.get(wiki_api_url, params=params)
        data = response.json()

        # Extract image URL from API response
        pages = data.get("query", {}).get("pages", [])
        try :
            image_url_collection[f"{key_name}.jpg"] = pages[0]["original"]["source"]
        except (AttributeError, KeyError) :
            unfindable_keys.append(key_name)
    print(f"finished fetching images links, size is {len(image_url_collection)}")
    print(f"keys that cant find {unfindable_keys}")
    return image_url_collection
    

def download_images(image_url_collection) :
    print("start download images")
    for key_name, image_url in image_url_collection.items():
        download_image(key_name, image_url)




# Entry point
if __name__ == "__main__":
    keys_to_search_wiki = ['Benjamin Netanyahu', 'Naftali Bennett', 'Yair Lapid', 'Ayelet Shaked', 'Avigdor Lieberman', 'Isaac Herzog', 'Miri Regev', "Gideon Sa'ar", 'Tzipi Livni', 'Moshe Kahlon', 'Gal Gadot', 'Lior Ashkenazi', 'Ayelet Zurer', 'Shira Haas', 'Rotem Sela', 'Niv Sultan', 'Odeya Rush', 'Alona Tal', 'Moran Atias', 'Inbar Lavi', 'Noa Kirel', 'Netta Barzilai', 'Omar Adam', 'Eyal Golan', 'Shlomo Artzi', 'Arik Einstein', 'Yardena Arazi', 'Ofra Haza', 'Dahlia Haviv', 'Ninet Tayeb', 'Omri Casspi', 'Yarden Gerbi', "Shahar Pe'er", 'Dudi Sela', 'Maccabi Tel Aviv Basketball Team', 'Eran Zahavi', 'Manor Solomon', 'Linoy Ashram', 'Yam Madar', 'Tommy Hass', 'Adam Neumann', 'Shai Agassi', 'Gigi Levy-Weiss', 'Teddy Sagi', 'Erez Shachar', 'Or Offer', 'Dov Moran', 'Gil Shwed', 'Yossi Vardi', 'Sophie Shulman', 'Etgar Keret', 'David Grossman', 'Amos Oz', 'Assaf Gavron', 'Sayed Kashua', 'Dorit Rabinyan', 'Eshkol Nevo', 'Meir Shalev', 'Yuval Noah Harari', 'Ron Leshem', 'Ada Yonath', 'Daniel Kahneman', 'Amnon Shashua', 'Eran Segal', 'Naomi Habib', 'Ruth Arnon', 'Aviv Regev', 'Dan Shechtman', 'Hossam Haick', 'Moran Bercovici', 'Bar Refaeli', 'Esti Ginzburg', 'Shlomit Malka', 'Yael Shelbia', 'Dorothea Wierer', 'Neta Alchimister', 'Michaela Bercu', 'Adi Neumann', 'Galit Gutmann', 'Sendi Bar', 'Orly Levy', 'Lucy Aharish', 'Erez Tal', 'Yonit Levi', 'Guy Pines', 'Maya Dagan', 'Nir Barkat', 'Iris Zaki', 'Assaf Harofe', "Geula Even-Sa'ar", 'Gidi Gov', 'Rami Fortis', 'Omer Adam', 'Noga Erez', 'Eli Finish', 'Yehuda Levi', 'Ran Danker', 'Itay Turgeman', 'Efrat Dor', 'Yael Grobglas', 'Omer Dror', 'Omer Peretz', 'Sacha Baron Cohen', 'Avi Nesher', 'Adi Bielski', 'Avi Kushnir', 'Tomer Capon', 'Rona-Lee Shimon', 'Tzachi Halevy', 'Hila Klein', 'Yon Tumarkin', 'Rotem Cohen']
    image_url_collection = get_url_images_wiki(keys_to_search_wiki)
    download_images(image_url_collection)
    print("Image download process completed.")


