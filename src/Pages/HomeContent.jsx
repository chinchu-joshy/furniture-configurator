import React from "react";
import Scene from "../3D/Scene/Scene";

function HomeContent() {
    
  return (
    <>
    <div className="container-home">
        <div className="left">
        <h5 className="content-head-home">App-less <span>Augmented
        </span> <span>Reality</span> </h5>
        <p className="paragraph-home">
            Increase shopping confidence with try-before-you-buy online. </p>
       <button className="btn-home">Get a demo</button>
        </div>
     
      <Scene />
     
    </div>
    
    </>
    
  );
}

export default HomeContent;
