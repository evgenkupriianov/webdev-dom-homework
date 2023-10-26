import {getComments} from "./api.js";
import {postComments} from "./api.js";
import {renderList} from "./render.js";
// Создаём переменные обращаясь к классу
const commentsElement = document.querySelector('.comments');
const nameInputElement = document.querySelector('.add-form-name');
const commentInputElement = document.querySelector('.add-form-text');
const buttonInputElement = document.querySelector('.add-form-button');
const formInputElement = document.querySelector('.add-form');
const loaderListElement = document.querySelector('.loader_list');
const loaderFormElement = document.querySelector('.loader_form');

// Массив с комментариями
export let commentsArray = [];

// Запрос в API и рендер
const fetchAdnRenderComments = () => {
  return getComments()
  .then((response) => {
    commentsArray = response.comments
    renderList();
  })
  .catch((error) => {
    alert('Нет соединения с интернетом');
    console.log(error);
  })
};

fetchAdnRenderComments()
.then(() => {
  loaderListElement.classList.add('hide-elem');
});

// Функция для окрашивания лайка в зависимости от значения activeLike
const activeLike = (comment) => {
    if (comment.isLiked === true) {
      return '-active-like'
    } 
}



// Enter в поле комментария означает клик на кнопку "Написать"
commentInputElement.addEventListener("keyup", () => {
if (event.keyCode === 13) {
    buttonInputElement.click();
}
});

// Функция кнопки "Написать"
const buttonListener = buttonInputElement.addEventListener("click", () => {

  // Проверка на пустые значения
  formInputElement.classList.remove("add-form-error");
  if (nameInputElement.value.trim() === '' || commentInputElement.value.trim() === '') {
    formInputElement.classList.add("add-form-error");
    return;
  };  

  // Убрали форму
  formInputElement.classList.add('hide-elem');
  loaderFormElement.classList.remove('hide-elem');

  // Отправили новый объект на сервер
  postComments(commentInputElement.value, nameInputElement.value)
    .then((response) => {
      // Проверили статус 
      switch (response.status) {
        case 400:
          throw new Error("Имя должено содержать хотя бы 3 символа")
          break;
        case 500:
          throw new Error("Ошибка на сервере")
          break;
        default:
          return fetchAdnRenderComments();
      }
    })
    // Вернули форму
    .then(() => {
      formInputElement.classList.remove('hide-elem');
      loaderFormElement.classList.add('hide-elem');

      // Очищаем форму от последнего комментария
      nameInputElement.value = '';
      commentInputElement.value = '';
    })
    .catch((error) => {
      formInputElement.classList.remove('hide-elem');
      loaderFormElement.classList.add('hide-elem');
      alert(error);
      console.log(error);
    });
});

// Функция кнопки "Удалить последний комментарий"
document.querySelector('.delete-comment-button').addEventListener("click", () => {
  let lastList = document.querySelector('li:last-child');
  lastList.remove();
});

renderList();
console.log("It works!");