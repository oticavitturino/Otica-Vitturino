import './style.css'

function Container({ width, height, children}) {

    const containerStyle = {
        width: width,
        height: height
    }

    return (
        <div className="container" style={containerStyle}>
            {children}
        </div>
    )
}

export default Container