import React, { useState, useEffect, useRef } from 'react';

const ImageRevealer = ({ src, pieces = 50, width = 250, height = 250 }) => {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [piecesArray, setPiecesArray] = useState([]);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous"; // This allows cross-origin image loading
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions to fit within the canvas while maintaining aspect ratio
      let imgWidth = img.width;
      let imgHeight = img.height;
      let scaleFactor = 1;

      if (imgWidth > width || imgHeight > height) {
        const widthRatio = width / imgWidth;
        const heightRatio = height / imgHeight;
        scaleFactor = Math.min(widthRatio, heightRatio);
        imgWidth *= scaleFactor;
        imgHeight *= scaleFactor;
      }

      // Calculate offsets to center the image
      const offsetX = (width - imgWidth) / 2;
      const offsetY = (height - imgHeight) / 2;

      // Draw the scaled image on the canvas
      ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);

      // Calculate piece dimensions and positions
      const pieceWidth = imgWidth / Math.sqrt(pieces);
      const pieceHeight = imgHeight / Math.sqrt(pieces);
      const piecesArray = [];
      for (let y = 0; y < Math.sqrt(pieces); y++) {
        for (let x = 0; x < Math.sqrt(pieces); x++) {
          piecesArray.push({ x: x * pieceWidth + offsetX, y: y * pieceHeight + offsetY, pieceWidth, pieceHeight });
        }
      }

      setPiecesArray(piecesArray);
      setImageLoaded(true);
      console.log('Image loaded and pieces calculated');
    };
    img.onerror = (err) => {
      console.error('Failed to load image:', err);
    };
  }, [src, width, height, pieces]);

  useEffect(() => {
    if (!imageLoaded || piecesArray.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous"; // This allows cross-origin image loading
    img.onload = () => {
      const shuffledPieces = [...piecesArray];

      const interval = setInterval(() => {
        if (shuffledPieces.length === 0) {
          clearInterval(interval);
          console.log('Image fully revealed');
          return;
        }

        const randomIndex = Math.floor(Math.random() * shuffledPieces.length);
        const piece = shuffledPieces.splice(randomIndex, 1)[0];

        // Draw the piece from the image to the canvas
        ctx.drawImage(
          img,
          piece.x - (width - img.width * scaleFactor) / 2, // Adjust for original image scaling
          piece.y - (height - img.height * scaleFactor) / 2, // Adjust for original image scaling
          piece.pieceWidth,
          piece.pieceHeight,
          piece.x,
          piece.y,
          piece.pieceWidth,
          piece.pieceHeight
        );
        console.log(`Piece revealed at (${piece.x}, ${piece.y})`);
      }, 1000);

      return () => clearInterval(interval);
    };
    img.onerror = (err) => {
      console.error('Failed to reload image for drawing pieces:', err);
    };
  }, [imageLoaded, piecesArray, src, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid black' }} />;
};

export default ImageRevealer;
