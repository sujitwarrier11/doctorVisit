import React, { forwardRef } from "react";
import { useSelector } from "react-redux";

const withTheme = (Component) => {
  const Temp = forwardRef((props, ref) => {
    const { userTheme } = useSelector((state) => state.user);
    const {
      MainBackgroundColor,
      ThemeSubColor1,
      ThemeSubColor2,
      RegularTextColor,
      MainTitleFontColor,
      NavlinkFontColor,
    } = userTheme || {};
    const theme = {
      color: {
        bgBlue: "#2c6ed5",
        textBlack: "#222",
        error: "#f44336",
        success: "#4caf50",
        mainBg: MainBackgroundColor || "#fff",
        ThemeColor1: ThemeSubColor1 || "#fff",
        ThemeColor2: ThemeSubColor2 || "#fff",
        RegularTextColor: RegularTextColor || "#000",
        MainTitleFontColor,
        CardBorder: "#ececec",
        errorBorder: "#eb5757",
        matBlack: "#0f1821",
        fillGrey: "#5f6a7d",
        NavlinkFontColor: NavlinkFontColor || "#737373",
        SuccessGreen: "#539940",
        borderCream: "#e2e2e2",
        deepCream: "#bbb",
        transparentGreen: "rgba(102,204,204,.08)",
        borderGrey: "#f4f4f4",
        chatBlack: "#0f1821",
        chatBubble1: "#f4f6f5",
        chatBubble2: "#2d9cdb",
        linkHoverColor: "#01555b",
        alert: "#fdc54e",
        paginationBorder: "#d4d6d5",
        offlineRed: "rgba(235, 87, 87, 0.5)",
        onlineGreen: "rgba(39, 174, 96, 0.5)",
        onCallOrange: "rgba(242, 153, 74, 0.5)",
      },
      textStyles: {
        normal: {
          fontSize: "14px",
          lineHeight: 1.8,
          color: "#222",
          fontWeight: 300,
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        header: {
          lineHeight: 1.66,
          fontWeight: 300,
          color: "#222",
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "30px",
          textAlign: "center",
        },
        status: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          lineHeight: 1.43,
          fontSize: "0.875rem",
          color: "#fff",
        },
        link: {
          fontSize: "14px",
          lineHeight: 1.8,
          color: "#0000EE",
          fontWeight: 300,
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        NavHeaders: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          lineHeight: "12px",
          fontSize: "10px",
          fontWeight: 500,
          textTransform: "uppercase",
          color: ThemeSubColor1,
          letterSpacing: "0.25px",
        },
        EmptyMessaging: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          color: RegularTextColor,
          fontSize: "14px",
          lineHeight: "18.2px",
          fontStyle: "italic",
        },
        NavLink: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "40px",
          textSizeAdjust: "100%",
          fontWeight: 100,
        },
        MainTitle: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: 400,
          textSizeAdjust: "100%",
          color: MainTitleFontColor,
        },
        SubHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "16px",
          fontWeight: 400,
          textSizeAdjust: "100%",
          color: RegularTextColor,
        },
        ErrorMessaging: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "16px",
          lineHeight: 1.3,
          fontWeight: 700,
          textSizeAdjust: "100%",
          color: "#eb5757",
        },
        Regular: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "12px",
          lineHeight: "18px",
          textSizeAdjust: "100%",
          color: RegularTextColor,
        },
        RegularMedium: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "18px",
          textSizeAdjust: "100%",
          color: RegularTextColor,
        },
        H1: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "16px",
          lineHeight: "24px",
          textSizeAdjust: "100%",
          textAlign: "left",
          color: "#eb5757",
        },
        WhiteText: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "20px",
          textSizeAdjust: "100%",
          textAlign: "center",
          color: ThemeSubColor2,
        },
        PatientListUserName: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "17px",
          textSizeAdjust: "100%",
          fontWeight: 500,
          color: ThemeSubColor1,
        },
        PopupTitle: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "20px",
          lineHeight: "20px",
          textSizeAdjust: "100%",
        },
        LargeRegular: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "30px",
          lineHeight: "33px",
          textSizeAdjust: "100%",
          fontWeight: 500,
          color: RegularTextColor,
        },
        PopupSubHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "16px",
          lineHeight: "21px",
          textSizeAdjust: "100%",
          textAlign: "left",
          color: RegularTextColor,
        },
        IconCaption: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "16px",
        },
        link2: {
          fontSize: "14px",
          lineHeight: 1.8,
          color: RegularTextColor,
          fontWeight: 700,
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        tabHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "18px",
          lineHeight: "23.4px",
          color: RegularTextColor,
        },
        SettingsSectionHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "18px",
          lineHeight: "19.8px",
          fontWeight: 400,
          color: "#000",
        },
        ChatHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "36px",
          fontStyle: "italic",
          color: "white",
        },
        ChatMessage1: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "16px",
          fontWeight: 400,
          color: RegularTextColor,
        },
        ChatMessage2: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "16px",
          fontWeight: 400,
          color: "white",
        },
        tableHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: 700,
          color: RegularTextColor,
        },
        RegularMediumBreak: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "18px",
          textSizeAdjust: "100%",
          color: RegularTextColor,
          wordBreak: "break-all",
        },
        PatientName: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "20px",
          lineHeight: "22px",
          textSizeAdjust: "100%",
          color: "black",
          wordBreak: "break-all",
          fontWeight: 700,
        },
        WaitingText: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "15px",
          lineHeight: "18px",
          textSizeAdjust: "100%",
          color: "black",
          wordBreak: "break-all",
          fontWeight: 500,
        },
        AmountText: {
          fontFamily:
            userTheme?.FontFamily ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "30px",
          lineHeight: "40px",
          textSizeAdjust: "100%",
          color: ThemeSubColor1,
          wordBreak: "break-all",
          fontWeight: 700,
        },
        AmountTextFailure: {
          fontFamily:
            userTheme?.FontFamily ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "30px",
          lineHeight: "40px",
          textSizeAdjust: "100%",
          color: "Red",
          wordBreak: "break-all",
          fontWeight: 700,
        },
        ControlHeader: {
          fontFamily:
            userTheme?.FontFamily ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "16px",
          lineHeight: "19px",
          textSizeAdjust: "100%",
          color: "#687182 ",
          wordBreak: "break-all",
          fontWeight: 500,
        },
        NameHeader: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "17px",
          lineHeight: "24px",
          textSizeAdjust: "100%",
          color: "black",
          wordBreak: "break-all",
          fontWeight: 700,
        },
        onlineGreen: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "12px",
          lineHeight: "24px",
          textSizeAdjust: "100%",
          wordBreak: "break-all",
          fontWeight: 700,
          color: "#27ae60",
          letterSpacing: "0.5px",
        },
        offlineRed: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "12px",
          lineHeight: "24px",
          textSizeAdjust: "100%",
          wordBreak: "break-all",
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: "#eb5757",
        },
        onCallOrange: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "12px",
          lineHeight: "24px",
          textSizeAdjust: "100%",
          wordBreak: "break-all",
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: "#f2994a",
        },
        StatusText: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "20px",
          textSizeAdjust: "100%",
          wordBreak: "break-all",
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "0.5px",
          color: "#5f6a7d",
        },
        PopupButton: {
          fontFamily:
            (userTheme && userTheme.FontFamily) ||
            '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: "14px",
          lineHeight: "20px",
          textSizeAdjust: "100%",
          wordBreak: "break-all",
          fontWeight: 400,
          color: "#5f6a7d",
        },
      },
      fontFamily:
        (userTheme && userTheme.FontFamily) ||
        '"Roboto", "Helvetica", "Arial", sans-serif',
    };

    const checkStyle = (style, key, breakpointNo, objStyle) => {
      if (style) {
        if (Array.isArray(style)) {
          if (style[breakpointNo]) {
            objStyle[key] = style[breakpointNo];
          } else {
            objStyle[key] = style[style.length - 1];
          }
        } else {
          objStyle[key] = style;
        }
      }
      return objStyle;
    };

    const getStyle = (
      {
        flexDirection,
        flex,
        width,
        height,
        pr,
        pl,
        pt,
        pb,
        px,
        py,
        mt,
        mb,
        mr,
        ml,
        mx,
        my,
        m,
        p,
        alignItems,
        justifyContent,
        bg,
        r,
        backgroundImage,
        position,
        boxShadow,
        borderBottom,
        style,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        border,
        color,
      },
      breakpointNo,
      isFlex
    ) => {
      let objStyle = {
        //boxSizing: "border-box",
      };
      //  if (isFlex) objStyle.display = "flex";
      objStyle = checkStyle(
        flexDirection,
        "flexDirection",
        breakpointNo,
        objStyle
      );
      objStyle = checkStyle(flex, "flex", breakpointNo, objStyle);
      objStyle = checkStyle(width, "width", breakpointNo, objStyle);
      objStyle = checkStyle(height, "height", breakpointNo, objStyle);
      objStyle = checkStyle(pr, "paddingRight", breakpointNo, objStyle);
      objStyle = checkStyle(pl, "paddingLeft", breakpointNo, objStyle);
      objStyle = checkStyle(pt, "paddingTop", breakpointNo, objStyle);
      objStyle = checkStyle(pb, "paddingBottom", breakpointNo, objStyle);
      if (px) {
        objStyle = checkStyle(px, "paddingRight", breakpointNo, objStyle);
        objStyle = checkStyle(px, "paddingLeft", breakpointNo, objStyle);
      }
      if (py) {
        objStyle = checkStyle(py, "paddingTop", breakpointNo, objStyle);
        objStyle = checkStyle(py, "paddingBottom", breakpointNo, objStyle);
      }
      objStyle = checkStyle(mr, "marginRight", breakpointNo, objStyle);
      objStyle = checkStyle(ml, "marginLeft", breakpointNo, objStyle);
      if (mx) {
        objStyle = checkStyle(mx, "marginRight", breakpointNo, objStyle);
        objStyle = checkStyle(mx, "marginLeft", breakpointNo, objStyle);
      }
      objStyle = checkStyle(mt, "marginTop", breakpointNo, objStyle);
      objStyle = checkStyle(mb, "marginBottom", breakpointNo, objStyle);
      if (my) {
        objStyle = checkStyle(my, "marginTop", breakpointNo, objStyle);
        objStyle = checkStyle(my, "marginBottom", breakpointNo, objStyle);
      }
      objStyle = checkStyle(alignItems, "alignItems", breakpointNo, objStyle);
      objStyle = checkStyle(
        justifyContent,
        "justifyContent",
        breakpointNo,
        objStyle
      );
      objStyle = checkStyle(p, "padding", breakpointNo, objStyle);
      objStyle = checkStyle(m, "margin", breakpointNo, objStyle);
      objStyle = checkStyle(r, "borderRadius", breakpointNo, objStyle);
      if (bg) {
        const bgColor = theme.color[bg] || bg;
        objStyle = checkStyle(
          bgColor,
          "backgroundColor",
          breakpointNo,
          objStyle
        );
      }
      if (backgroundImage) {
        const bgImage = `url(${backgroundImage})`;
        objStyle = checkStyle(
          bgImage,
          "backgroundImage",
          breakpointNo,
          objStyle
        );
      }
      objStyle = checkStyle(position, "position", breakpointNo, objStyle);
      objStyle = checkStyle(boxShadow, "boxShadow", breakpointNo, objStyle);
      objStyle = checkStyle(
        borderBottom,
        "borderBottom",
        breakpointNo,
        objStyle
      );
      objStyle = checkStyle(maxHeight, "maxHeight", breakpointNo, objStyle);
      objStyle = checkStyle(maxWidth, "maxWidth", breakpointNo, objStyle);
      objStyle = checkStyle(minHeight, "minHeight", breakpointNo, objStyle);
      objStyle = checkStyle(minWidth, "minWidth", breakpointNo, objStyle);
      objStyle = checkStyle(border, "border", breakpointNo, objStyle);
      if (color) {
        const ftColor = theme.color[color] || color;
        objStyle = checkStyle(ftColor, "color", breakpointNo, objStyle);
      }
      const resultStyle = {
        ...style,
        ...objStyle,
      };
      return resultStyle;
    };

    const getTextStyles = (variant) =>
      theme.textStyles[variant] || theme.textStyles.normal;
    return (
      <Component
        {...props}
        ref={ref}
        getStyle={getStyle}
        getTextStyles={getTextStyles}
        theme={theme}
      />
    );
  });
  return Temp;
};

export default withTheme;
