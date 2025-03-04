import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import PersonCreationModal from "../PersonCreationModal/PersonCreationModal";
import { createPerson } from "../../store/slices/personSlice";
import "./ContainerPersonCreation.css";
//TODO возрат ошибок валидации с сервера
export default function ContainerPersonCreation() {
  const defaultObjectData = {
    surname: "Кислюк",
    name: "Николай",
    middlename: "",
    phone: "",
    email: "kicluk@bk.ru",
  };

  const [personData, setPersonData] = useState(defaultObjectData);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSetOpen = () => {
    setOpen(!open);
    setPersonData(defaultObjectData);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение формы
    dispatch(createPerson(personData));
    toggleSetOpen(); // Закрываем модальное окно после отправки
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPersonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={toggleSetOpen}>
        Ввести персональные данные
      </Button>
      <PersonCreationModal
        open={open}
        handleClose={toggleSetOpen}
        handleSubmit={handleSubmit}
        personData={personData}
        handleChange={handleChange}
      />
    </div>
  );
}
