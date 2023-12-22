import React from "react";

function Hover({point, content}){
    return(
        <p className="hover-text" style={{"--pointX": point.x + "px", "--pointY": point.y + "px"}}>{content}</p>
    )
}

export default Hover;