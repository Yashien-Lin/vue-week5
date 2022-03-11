const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yashienxzxz";

export default {
  props: ["id", "innerLoadingItem"],
  template: "#userProductModal",
  data() {
    return {
      modal: {},
      selectedProduct: "",
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`).then((res) => {
        this.selectedProduct = res.data.product;
        // this.innerLoadingItem = ""; //單向資料流，不能修改prop傳進來的資料，要怎麼修改?
      });
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
