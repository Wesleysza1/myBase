import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MaozinhaBlack from '@/components/icons/MaozinhaBlack';
import MaozinhaRockBlack from '@/components/icons/MaozinhaRockBlack';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';

const IconWrapper = styled('div')({
  position: 'relative',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const IconContainer = styled('div')(({ isHovered }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  transition: 'opacity 0.2s ease-in-out',
  opacity: isHovered ? 0 : 1,
  backgroundColor: 'transparent'
}));

const HoverIconContainer = styled('div')(({ isHovered }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  transition: 'opacity 0.2s ease-in-out',
  opacity: isHovered ? 1 : 0,
  backgroundColor: 'transparent'
}));

const AnimatedIconButton = ({ darkMode, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="Menu"
      title=''
      sx={{ 
        mr: 2, 
        color: darkMode ? '#000000' : '#000000',
        backgroundColor: 'transparent'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconWrapper>
        <IconContainer isHovered={isHovered}>
          {/* <MaozinhaBlack /> */}
          <MenuIcon />
        </IconContainer>
        <HoverIconContainer isHovered={isHovered}>
          <MaozinhaRockBlack />
        </HoverIconContainer>
      </IconWrapper>
    </IconButton>
  );
};

export default AnimatedIconButton;