const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCartBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
let cart = []; // array para armazenar os itens do carrinho

// abrir o modal  do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// fechar o modal do carrinho
cartModal.addEventListener("click", function (e) {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeCartBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Resgatar item clicado
menu.addEventListener("click", function (e) {
  let parentBtn = e.target.closest(".add-to-cart-btn");
  if (parentBtn) {
    const name = parentBtn.getAttribute("data-name");
    const price = parseFloat(parentBtn.getAttribute("data-price"));

    // adicionar item ao carrinho
    addIToCart(name, price);
  }
});

// Função para adicionar item ao carrinho
function addIToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Atualiza carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
   <div class="flex items-center justify-between">
    <div>
      <p class="font-medium">${item.name}</p>
      <p>Qtd: ${item.quantity}</p>
      <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
    </div>
    
      <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
      </button>
    </div>
   

   `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-from-cart-btn")) {
    const name = e.target.getAttribute("data-name");
    removeItemCart(name);
  }
});
function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

// Finalizar pedido

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops! O restaurante está fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }
  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
  }

  // Enviar pedido para o WhatsApp
  const cartItems = cart
    .map((item) => {
      return ` ${item.name} Quantidade:  (${item.quantity})Preço: R$${
        item.price
      } Total: R$ ${item.price.toFixed(2).replace(".", ",")} |`;
    })
    .join("");
  const message = encodeURIComponent(cartItems);
  const phone = "61992904145";
  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    `_blank`
  );
  cart = [];
  updateCartModal();
});
// programar funcionamento do restaurante
function checkRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22; //true = Restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();
if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-500");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
}
