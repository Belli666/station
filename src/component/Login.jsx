import { useState } from 'react';
import classes from './Login.module.css';
import Button from './UI/Button';
import Input from './UI/Input';

let Login = (props) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // email/code | step email is send code, and step code is verify code 
  const [error, setError] = useState('');

  const handleEmailChange = e => { setEmail(e.target.value); setError(''); };//email
  const handleCodeChange = e => { setCode(e.target.value); setError(''); };//code
  //send code
  const handleSendCode = async e => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setError("Введите корректную почту"); return; }
    const result = await props.sendCode(email);
    if (result?.error) { setError(result.error); return; }
    setStep('code');
  };
  //verify code
  const handleVerifyCode = async e => {
    e.preventDefault();
    const result = await props.verifyCode({ email, code });
    if (result?.error) { setError(result.error); return; }
    setEmail(''); setCode(''); setStep('email'); setError('');
    if (result.success===true) {
      props.onClick()
    }
  };

  return (
    <form className={classes.form} onSubmit={step === 'email' ? handleSendCode : handleVerifyCode}>
      <h1>Авторизация</h1>
      <div className={classes.data}>
        {step === 'email' ? (
          <>{/*email*/}
          <Input value={email} onChange={handleEmailChange} type="email" placeholder="Введите вашу почту" />
          {error && <p className={classes.error}>{error}</p>}</>
        ):(
          <>{/*code*/}
          <Input value={code} onChange={handleCodeChange} type="text" placeholder="4-значный код" maxLength="4"/>
          {error && <p className={classes.error}>{error}</p>}</>
        )}
      </div>
      <div className={classes.divBtn}>
        <Button type="submit" text={step === 'email' ? "Далее" : "Подтвердить"} />
        <Button type="button" text="Закрыть" onClick={props.onClick} className={classes.closebtn}/>
      </div>
    </form>
  );
};

export default Login;
