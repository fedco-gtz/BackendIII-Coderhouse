document.addEventListener("DOMContentLoaded", () => {
  // const socket = io();

  // // Actualizar lista de productos en tiempo real
  // socket.on("updateProducts", (products) => {
  //   const productList = document.getElementById("product-list");
  //   if (productList) {
  //     productList.innerHTML = "";
  //     products.forEach((product) => {
  //       const listItem = document.createElement("li");
  //       listItem.textContent = `ID: ${product._id} - Title: ${product.title} - Price: $${product.price}`;
  //       productList.appendChild(listItem);
  //     });
  //   }
  // });

  // // Manejar envío de formulario de agregar producto
  // const productForm = document.getElementById("product-form");
  // if (productForm) {
  //   productForm.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(productForm);
  //     const product = {};
  //     formData.forEach((value, key) => {
  //       product[key] = value;
  //     });
  //     socket.emit("createProduct", product);
  //     productForm.reset();
  //   });
  // }

  // // Manejar envío de formulario de eliminar producto
  // const deleteForm = document.getElementById("delete-form");
  // if (deleteForm) {
  //   deleteForm.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const productId = new FormData(deleteForm).get("productId");
  //     socket.emit("deleteProduct", productId);
  //     deleteForm.reset();
  //   });
  // }
});
