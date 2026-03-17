import { useState } from 'react'
import './style.css'

const variants = {
    color1: {
        backgroundColor: "#1DA299",
        hoverColor: "#187e77",
        color: "#FFFFFF"
    },

    color2: {
        backgroundColor: "#DB3E3E",
        hoverColor: "#B33232",
        color: "#FFFFFF"
    },

    color3: {
        backgroundColor: "#AAAAAA",
        hoverColor: "#888888",
        color: "#FFFFFF"
    }
}

function Button({ variant = "color1", width, height, children, ...props }) {

    const [isHovered, setIsHovered] = useState(false);

    const currentVariant = variants[variant];

    const buttonStyle = {
        backgroundColor: isHovered ? currentVariant.hoverColor : currentVariant.backgroundColor,
        color: currentVariant.color,
        width: width,
        height: height,
        transition: "background-color 0.2s ease"
    }

    return (
        <button style={buttonStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...props}
        >
            {children}
        </button>
    )
}

export default Button