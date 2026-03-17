import './style.css'

function Input({ width, height, ...props}) {

    const inputStyle = {
        backgroundColor: "#D9D9D9",
        color: "#6E6E6E",
        width: width,
        height: height
    }

    return (
        <input style={inputStyle}
               {...props} 
        />
    )
}

export default Input