import classes from './Input.module.css'
let Input = (props)=>{
    return(
        <input maxLength={props.maxLength} className={props.className} classId={classes.input} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onInput={props.onInput} type={props.type}></input>
    )
}
export default Input