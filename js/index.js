/**
 * set elementos del dom
 */
const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

/**
 * Conseguir todos los heroes
 */
const getAll = async () => {
  try {
    let res = await fetch("http://localhost:3000/SuperheroeMarvel"),
      json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    console.log(json);
    json.forEach((el) => {
      $template.querySelector(".nombre").textContent = el.nombre;
      $template.querySelector(".poder").textContent = el.poder;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.poder = el.poder;
      $template.querySelector(".delete").dataset.id = el.id;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${err.status}: ${message}</b></p>`
    );
  }
};

/**
 * ejecuta el fecth
 */
d.addEventListener("DOMContentLoaded", getAll);

/**
 * crear superheroe
 */
d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //Create - POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              nombre: e.target.nombre.value,
              poder: e.target.poder.value,
            }),
          },
          res = await fetch("http://localhost:3000/SuperheroeMarvel", options),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
      /**
       * actualizar
       */
    } else {
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              nombre: e.target.nombre.value,
              poder: e.target.poder.value,
            }),
          },
          res = await fetch(
            `http://localhost:3000/SuperheroeMarvel/${e.target.id.value}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    }
  }
});

/**
 * Cambiar elementos del form y titulo
 */
d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = `Editar Hero ${e.target.dataset.name}`;
    $form.nombre.value = e.target.dataset.name;
    $form.poder.value = e.target.dataset.poder;
    $form.id.value = e.target.dataset.id;
  }

  /**
   * Elimina un heroe
   */
  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estás seguro de eliminar el id ${e.target.dataset.id}?`
    );

    if (isDelete) {
      try {
        let options = {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          res = await fetch(
            `http://localhost:3000/SuperheroeMarvel/${e.target.dataset.id}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }
});

