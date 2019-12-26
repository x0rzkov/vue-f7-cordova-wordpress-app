<template>
  <f7-page name="page">
    <f7-navbar :title="post ? page.title : ''" back-link="Back"></f7-navbar>
    <f7-card class="demo-card-header-pic" outline v-if="page">
      <f7-card-header
        v-if="page.image"
        class="no-border"
        valign="bottom"
        :style="'background-image:url(' + page.image + '); height: 120px'"
      ></f7-card-header>
      <f7-card-content>
        <p class="date">Posted on {{ (new Date(page.date)).toUTCString() }}</p>
        <h1>{{ page.title }}</h1>
        <br>
        <div class="content" v-html="content"></div>
      </f7-card-content>
    </f7-card>
  </f7-page>
</template>

<script>
export default {
  name: "page",
  props: ["page"],
  created() {
    if (this.post) {
      this.$f7.preloader.show();
      window.api
        .call("get", "/wp-json/wp/v2/page/" + this.page.id + "?_embed")
        .then(({ data }) => {
          this.content = data.content.rendered;
        });
    }
  },
  mounted() {
    document.addEventListener("backbutton", this.onBackKeyDown, false);
  },
  data() {
    return {
      content: null
    };
  },
  methods: {
    onBackKeyDown(e) {
      e.preventDefault();
      this.$f7router.back();
      document.removeEventListener("backbutton", this.onBackKeyDown);
    }
  }
};
</script>
