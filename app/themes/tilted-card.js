'use client'
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A 3D-tilt card component with optional overlay and tooltip.
 * @param {Object} props
 * @param {string} props.imageSrc - Image URL
 * @param {string} [props.altText] - Image alt text
 * @param {string} [props.captionText] - Tooltip/caption text
 * @param {string} [props.containerHeight]
 * @param {string} [props.containerWidth]
 * @param {string} [props.imageHeight]
 * @param {string} [props.imageWidth]
 * @param {number} [props.scaleOnHover]
 * @param {number} [props.rotateAmplitude]
 * @param {boolean} [props.showMobileWarning]
 * @param {boolean} [props.showTooltip]
 * @param {React.ReactNode} [props.overlayContent]
 * @param {boolean} [props.displayOverlayContent]
 */
export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100, mass: 2 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100, mass: 2 });
  const scale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  // Handle mouse movement for 3D tilt
  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={captionText || altText}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden" aria-live="polite">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}
      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform dark:invert-100 [transform:translateZ(0)]"
          style={{ width: imageWidth, height: imageHeight }}
          draggable={false}
        />
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]"
            aria-label="Overlay content"
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] dark:text-white hidden sm:block"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
          aria-live="polite"
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
