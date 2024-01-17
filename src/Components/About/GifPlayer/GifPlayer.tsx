//Deps
import React, { ReactElement } from "react";
import {useHoverDirty} from 'react-use';

//MUI
import {Box, useTheme} from "@mui/material";

//Components
import IconButton from "../../Utility/IconButton/IconButton";

//Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

//Props
interface IGifPlayerProps {
  children?: React.ReactNode;
  preview: string,
  gif: string,
}

const GifPlayer: React.FC<IGifPlayerProps> = ({preview, gif}): JSX.Element => {
  const theme = useTheme();
  const padding = 10;

  const [active, setActive] = React.useState(false);

  const playBtn = React.useRef<Element | null>(null);
  const isHovering = useHoverDirty(playBtn);
  
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    // Load the image and set its dimensions
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height });
      console.log(image.width)
    };
    // Use the preview image to set the size, assuming both images have the same dimensions
    image.src = preview;
  }, [preview]);


  return (
    <Box 
    ref={playBtn}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: imageSize.width + padding, // Set the width of the Box
      height: imageSize.height + padding, // Set the height of the Box
      borderWidth: "1px",
      borderStyle: "solid",
      marginBottom: "10px",
      borderColor: active ? theme.palette.primary.main : theme.palette.background.default,
    }}>
      {
        active ? <img src={gif} style={{
          position: `absolute`,
          top: `${padding/2}px`,
          left: `${padding/2}px`
        }}/> : (<img src={preview} style={{
          position: `absolute`,
          top: `${padding/2}px`,
          left: `${padding/2}px`
        }}/>)
      }
      <Box sx={{
        display: isHovering ? "block" : "none"
      }}>
        <IconButton title={"Play"} handler={() => setActive(prev => !prev)}>
          { active ? <StopIcon/> : <PlayArrowIcon/> }
        </IconButton>
      </Box>
    </Box>
  );
}

export default React.memo(GifPlayer);
