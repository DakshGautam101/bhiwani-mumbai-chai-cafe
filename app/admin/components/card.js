import TiltedCard from "@/app/themes/tilted-card";
import React from 'react';

const Card = ({ src, altText = "Card image", captionText }) => (
  <TiltedCard
    imageSrc={src}
    altText={altText}
    captionText={captionText}
    containerHeight="300px"
    containerWidth="400px"
    imageHeight="200px"
    imageWidth="300px"
    rotateAmplitude={12}
    scaleOnHover={1.2}
    showMobileWarning={false}
    showTooltip={true}
    displayOverlayContent={true}
    overlayContent={
      <p className="tilted-card-demo-text">
        {captionText}
      </p>
    }
  />
);

export default Card;
