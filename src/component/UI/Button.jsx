import classes from './Button.module.css'

let Button = (props)=>{
    return(
        <button class="btn btn-success" type={props.type} onClick={props.onClick}>{props.text}</button>
    )
}

export default Button