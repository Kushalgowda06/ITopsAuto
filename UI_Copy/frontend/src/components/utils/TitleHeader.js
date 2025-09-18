import React from "react";
import PropTypes from "prop-types";

const HeaderBar = ({ content, position = "start", padding }) => {
  const justifyClass = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
  }[position] || "justify-start";

  return (
    <div
      className={`
        flex 
        items-center 
        ${justifyClass}
        ${padding || 'px-3'}
        py-3
        bg-gradient-to-r from-neon-blue to-royal-500
        text-white
        rounded-t-lg
        shadow-md
      `}
    >
      <div className="m-0 text-sm md:text-base lg:text-lg xl:text-xl font-bold">
        {content}
      </div>
    </div>
  );
};

HeaderBar.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["start", "center", "end"]),
  padding: PropTypes.string,
};

export default HeaderBar; 