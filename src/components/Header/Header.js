import React from "react";
import PropTypes from "prop-types";
import { textStyle, useTheme, GU } from "@aragon/ui";

function Header({
  title,
  subtitle,
  calltoaction,
  topSpacing = 10 * GU,
  bottomSpacing = 7 * GU,
}) {
  const theme = useTheme();
  return (
    <header
      css={`
        padding: ${topSpacing}px ${2 * GU}px ${bottomSpacing}px;
        text-align: center;
      `}
    >
      <h1
        css={`
          // Not in aragonUI - exceptionally used here
          font-size: 40px;
          font-weight: 600;
          padding-bottom: ${subtitle ? 2 * GU : 0}px;
        `}
      >
        {title}
      </h1>
      {subtitle && (
        <div
          css={`
            ${textStyle("title4")};
            color: ${theme.contentSecondary};
          `}
        >
          {subtitle}
        </div>
      )}
      {calltoaction && (
        <div
          css={`
            ${textStyle("title2")};
            color: #FFFFFF;
          `}
        >
          {calltoaction}
          <a style='color:#FA297F; font-weight: 600;' href='https://app.nftx.org'>Try it out</a>!
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  calltoaction: PropTypes.node,
  topSpacing: PropTypes.number.isRequired,
  bottomSpacing: PropTypes.number.isRequired,
};

Header.defaultProps = {
  topSpacing: 10 * GU,
  bottomSpacing: 7 * GU,
};

export default Header;
