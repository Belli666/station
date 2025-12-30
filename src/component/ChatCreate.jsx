import { useState } from 'react';
import classes from './ChatCreat.module.css';
import Button from './UI/Button';
import Input from './UI/Input';

let ChatCreate = (props) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');


  const usersList = props.users || [];
  const currentUser = props.user || null;
  const searchChange = (e) => setSearchValue(e.target.value);

  const filteredUsers = usersList.filter(user =>
    user?.username?.toLowerCase().includes(searchValue.toLowerCase())
  );
  const handleClick = (entity) => {
    setSelectedUser(entity);
  };
  const handleSendCreate = async e => {
    e.preventDefault();
    if (!name || !currentUser || !selectedUser) { setError("Введите данные"); return; }
    const result = await props.sendCreate({name, avatar, currentUser: currentUser?.id, selectedUser: selectedUser?.id});
    if (result?.error) { setError(result.error); return; }
  };

  return (
    <form className={classes.form} onSubmit={handleSendCreate}>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        type="text"
        placeholder='Название группы'
      />
      <Input
        value={avatar}
        onChange={e => setAvatar(e.target.value)}
        type="text"
        placeholder='url аватару'
      />
        {/*users*/}
        <div className={classes.users}>
          <Input
            value={searchValue}
            onChange={searchChange}
            type="search"
            placeholder="Добавить пользователя"
          />
          <div className={classes.usersList}>
            {searchValue.trim() !== '' &&
              filteredUsers.map(user => (
                <div
                  onClick={() => handleClick(user)}
                  key={user.id}
                  className={`${classes.userItem} ${selectedUser?.id === user.id ? classes.selected : ''}`}
                >
                  <div className={classes.otherUsers}>
                    <img
                      src={user.avatar ||
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShOYL4L4yzGMszNHdQEvD3fJhbWPBuJjIZRw&s'}
                      alt=""
                    />
                    <p>{user.username}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <Button type="submit" text="Создать" />
        <Button onClick={props.onClick} text="Закрыть" /> 
    </form>
  );
};

export default ChatCreate;
