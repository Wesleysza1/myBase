import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import { lightTheme, darkTheme } from '../app/theme';

const IconWrapper = styled('div')({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const RotatingIconContainer = styled('div')(({ isHovered }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)',
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
      title=""
      sx={{ 
        mr: 2, 
        color: darkMode ? darkTheme.palette.primary.white : lightTheme.palette.primary.white,
        backgroundColor: 'transparent'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconWrapper>
        <RotatingIconContainer isHovered={isHovered}>
          <MenuIcon />
        </RotatingIconContainer>
      </IconWrapper>
    </IconButton>
  );
};

export default AnimatedIconButton;