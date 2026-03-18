import './style.css'

function Container({ children, maxWidth }) {

    return (
        <div className="container" style={{ maxWidth: maxWidth }}>
            {children}
        </div>
    )
}

export default Container