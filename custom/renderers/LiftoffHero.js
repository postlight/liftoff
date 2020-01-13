import * as React from "react";

const LiftoffHero = () => {
  const title = (
    <div className="title">
      <h1 className="index-page title">{process.env.HEADER_TITLE}</h1>
      <h3>The Pizza Examiners</h3>
      <div>PIZZA ICON THING HERE</div>
      <p>
        Top-notch, totally-not-made-up pizza reviews from the heart of the Big
        Apple. Built with Liftoff by your friends at Postlight.
      </p>
    </div>
  );

  return <div>{title}</div>;
};

export default LiftoffHero;
