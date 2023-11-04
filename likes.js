import { token } from "./login.js";
import { fetchAdnRenderComments } from "./main.js";

export function likeListener ({commentsArray, commentsElement}) {
    // Находим все лайки на странице
    const likeElements = document.querySelectorAll('.like-button');

    // Для каждого из них
    for (let like of likeElements) {
      // Добавляем слушатель нажатия
      like.addEventListener("click", (event) => {
          // Запрещаем всплытие
          event.stopPropagation();

          // Создаем переменную с id комментария
          let id = commentsArray[like.dataset.index].id;

          // Отправляем авторизованный запрос на сервер 
          fetch(`https://wedev-api.sky.pro/api/v2/:kupriianov/comments/${id}/toggle-like`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
          })
          .then((response) => {
            // Если статус ответа не 401, переводим ответ из формата json
            if (response.status === 401) {
              throw new Error('Для этого нужна авторизация')
            } else {
              return response.json();
            }
          })
          .then(() => {
            fetchAdnRenderComments()
          })
          .catch((Error) => {
            alert(Error)
          })
      });
    }
  }; 

  // Функция для окрашивания лайка в зависимости от значения activeLike
  export function activeLike (comment) {
      if (comment.isLiked === true) {
        return '-active-like';
      };
  };