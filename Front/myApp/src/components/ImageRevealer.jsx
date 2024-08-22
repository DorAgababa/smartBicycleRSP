import React, { useState, useEffect, useRef,forwardRef, useImperativeHandle } from 'react';
import '../ImageReveal.css';
import { appDataDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import zIndex from '@mui/material/styles/zIndex';
import { relaunch } from '@tauri-apps/api/process';
import { SetAlert } from '../App';

const  getRandomImage = async (imagePaths, pickedImages) => {
    // Filter out picked images
    const availableImages = Object.keys(imagePaths).filter(path => !pickedImages.includes(path));
    
    if (availableImages.length === 0) {
      // All images have been picked; reset the pickedImages list
      pickedImages = [];
      return await getRandomImage(imagePaths, pickedImages);
    }
  
    // Pick a random image from available images
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    let path = availableImages[randomIndex]
    imagePaths = path.replace("..","/src")
    return imagePaths;
  };

let images
const ImageRevealer = forwardRef((props,ref) => {
    const [clearedCells, setClearedCells] = useState([]);
    const [imageSrc, setImageSrc] = useState('');
    const [pickedImages, setPickedImages] = useState([]);

    useImperativeHandle(ref, () => ({
      revealDiv
    }));
    
  useEffect(() => {
    (async () => {
        images = import.meta.glob('../images/discoverImagesGame/*.{png,jpg,jpeg,svg}');
    const gridOverlay = document.querySelector('.grid-overlay');
    const imagePath = await getRandomImage(images, pickedImages);
        setImageSrc(imagePath);
        setPickedImages(prev => [...prev, imagePath]);
        console.log(imagePath)
      for (let i = 0; i < 256; i++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('grid-cell');
      gridCell.dataset.index = i;  // Add an index to each grid cell
      gridOverlay.appendChild(gridCell);
    }
      })();
  }, []);

  const revealDiv = async () => {
    const gridCells = document.querySelectorAll('.grid-cell');
    const unRevealedCells = Array.from(gridCells).filter(cell => !clearedCells.includes(cell.dataset.index));

    if (unRevealedCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * unRevealedCells.length);
      const selectedCell = unRevealedCells[randomIndex];
      selectedCell.style.backgroundColor = 'transparent';
      setClearedCells([...clearedCells, selectedCell.dataset.index]);
    }
    if (clearedCells.length + 1 === gridCells.length) {
        // All cells are revealed, so reset the grid and change the image
        gridCells.forEach(cell => {
          cell.style.backgroundColor = '#f88f3b'; // Reset color to #f88f3b
        });
  
        // Get a new image path and update the image source
        const imagePath = await getRandomImage(images, pickedImages);
        setImageSrc(imagePath);
        setPickedImages(prev => [...prev, imagePath]);
        setClearedCells([]); // Clear the clearedCells for the new image
    }
  };

  return (
    <div className="container">
      <img src={imageSrc} alt="Your Image" className="image" />
      <div className="grid-overlay"></div>
      <button style={{zIndex:5,position:'relative',top:0}} onClick={revealDiv}>HELLO</button>
    </div>
  );
});

export default ImageRevealer;
