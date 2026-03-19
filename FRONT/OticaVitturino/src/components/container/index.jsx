import './style.css'

function Box_Container({ children, maxWidth }) {

    return (
        <div className="container" style={{ maxWidth: maxWidth }}>
            {children}
        </div>
    )
}

export default Box_Container