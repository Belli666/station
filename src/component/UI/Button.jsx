let Button = (props)=>{
    return(
        <button id={props.id} class={props.class} type={props.type} onClick={props.onClick}>{props.text}</button>
    )
}

export default Button