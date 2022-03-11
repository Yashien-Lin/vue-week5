import modalComponent from "./components/modalComponent.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yashienxzxz";

//加入全部規則
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

//加入多國語系
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json"); // 讀取外部的資源
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  // validateOnInput: true,   // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      allProducts: [],
      productId: "",
      loadingItem: "",
      cartData: {
        carts: [],
      },
      innerLoadingItem: "",
      form: {
        user: {
          email: "",
          name: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getAllProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res) => {
        this.allProducts = res.data.products;
      });
    },
    openProductModal(id) {
      this.productId = id;
      this.innerLoadingItem = id;
      this.$refs.productModal.openModal();
    },
    addToCart(id, qty = 1) {
      this.loadingItem = id;
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, {
          data: {
            product_id: id,
            qty,
          },
        })
        .then((res) => {
          alert(`${res.data.data.product.title} ${res.data.message} `);
          this.getCartData();
          this.loadingItem = "";
          this.$refs.productModal.closeModal();
        })
        .catch((err) => console.log(err));
    },
    getCartData() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res) => {
        this.cartData = res.data.data; //存入購物車資料外層 ->才可以取得final_total & total
      });
    },
    updateCartData(item) {
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {
          data: {
            product_id: item.product_id,
            qty: item.qty,
          },
        })
        .then((res) => {
          this.getCartData();
        });
    },
    removeItem(item) {
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`).then((res) => {
        alert(`已刪除 ${item.product.title}`);
        this.getCartData();
      });
    },
    removeCart() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res) => {
        this.getCartData();
        alert("清空購物車");
      });
    },
    createOrder() {
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, {
          data: this.form,
        })
        .then((res) => {
          alert("已送出訂單");
          this.$refs.form.resetForm();
          this.getCartData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請填正確的電話號碼";
    },
  },
  mounted() {
    this.getAllProducts();
    this.getCartData();
  },
});

app.component("product-modal", modalComponent);

// 註冊全域的表單驗證元件（VForm, VField, ErrorMessage）
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
