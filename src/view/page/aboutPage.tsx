import React from 'react';
import SplitText from '../../animations/splitText';
import Squares from '../../animations/squares';

const AboutPage: React.FC = () => {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Fullscreen Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>

      {/* Foreground Centered Text */}
      <div className="relative z-10 px-4 text-center">
        <SplitText
          text={`Welcome to <span class="text-pink-500">PORK</span> HUB!`}
          className="text-6xl font-bold"
          delay={100}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
};

export default AboutPage;
