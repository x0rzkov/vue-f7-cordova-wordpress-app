<template>
  <f7-page name="pages" :page-content="false">
    <f7-navbar :title="$root.app.name"></f7-navbar>
    <f7-toolbar tabbar :position="'bottom'">
      <f7-link tab-link="#tab-home" tab-link-active text="Home" icon-fa="home" icon-size="15px"></f7-link>
      <f7-link tab-link="#tab-pages" text="Pages" icon-fa="list" icon-size="15px"></f7-link>
      <f7-link tab-link="#tab-categories" text="Categories" icon-fa="list" icon-size="15px"></f7-link>
    </f7-toolbar>
    <f7-tabs animated swipeable>
      <f7-tab
        id="tab-home"
        class="page-content infinite-scroll-content"
        tab-active
        @infinite.native="loadMore"
        :infinite-distance="50"
        @tab:show="tabHomeShown"
      >
        <f7-block-title>{{ pages.category ? pages.category.name : 'Pages' }}</f7-block-title>
        <f7-list media-list>
          <f7-list-item
            link="#"
            :title="item.title"
            :subtitle="(new Date(item.date)).toDateString()"
            v-for="(item, index) in pages.data"
            :key="'p' + index"
            @click="readMore(item)"
          >
            <img slot="media" :src="item.image ? item.image : noImage" width="80">
          </f7-list-item>
        </f7-list>
        <f7-block class="text-align-center" v-if="loading">
          <f7-preloader/>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab-categories" class="page-content" @tab:show="tabCategoriesShown">
        <f7-block-title>Categories</f7-block-title>
        <f7-list>
          <f7-list-item
            :title="item.name"
            :link="'/home/' + item.id"
            :badge="item.count"
            v-for="(item, index) in categories"
            :key="'c' + index"
            @click="showCategoryPages(item)"
          ></f7-list-item>
        </f7-list>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
export default {
  name: "pages",
  created() {
    this.getPages();
    this.getCategories();
  },
  mounted() {
    document.addEventListener("backbutton", this.onBackKeyDown, false);
  },
  computed: {
    noImage() {
      return require("../../assets/img/no-image.svg");
    }
  },
  data() {
    return {
      pages: {
        page: 1,
        category: null,
        data: []
      },
      categories: [],
      allowInfinite: true,
      loading: true
    };
  },
  methods: {
    getPages() {
      let url = "/wp-json/wp/v2/pages?_embed&page=" + this.pages.page;
      if (this.pages.category) {
        url =
          "/wp-json/wp/v2/pages?_embed&categories=" +
          this.pages.category.id +
          "&page=" +
          this.pages.page;
      }
      this.loading = true;
      window.api
        .call("get", url, null, [], true)
        .then(({ data }) => {
          let pages = [];
          for (let i = 0; i < data.length; i++) {
            let image = null;
            if (
              data[i]._embedded["wp:featuredmedia"] &&
              data[i]._embedded["wp:featuredmedia"][0] &&
              data[i]._embedded["wp:featuredmedia"][0].media_details &&
              data[i]._embedded["wp:featuredmedia"][0].media_details.sizes &&
              data[i]._embedded["wp:featuredmedia"][0].media_details.sizes
                .medium
            ) {
              image =
                data[i]._embedded["wp:featuredmedia"][0].media_details.sizes
                  .medium.source_url;
            }
            pages.push({
              id: data[i].id,
              title: data[i].title.rendered,
              date: data[i].date,
              image: image
            });
          }
          if (this.pages.category && this.pages.page === 1) {
            this.pages.data = pages;
            this.allowInfinite = false;
            if (this.pages.data.length >= this.pages.category.count) {
              this.loading = false;
            }
          } else {
            this.pages.data = this.pages.data.concat(pages);
            this.allowInfinite = true;
          }
        })
        .catch(() => {
          this.loading = false;
          this.allowInfinite = false;
        });
    },
    loadMore() {
      if (!this.allowInfinite) return;
      this.allowInfinite = false;
      this.pages.page += 1;
      this.getPages();
    },
    readMore(page) {
      document.removeEventListener("backbutton", this.onBackKeyDown);
      this.$f7router.navigate("/page/", {
        props: {
          page: page
        }
      });
    },
    getCategories() {
      window.api
        .call("get", "/wp-json/wp/v2/categories?_embed")
        .then(({ data }) => {
          this.categories = data;
        });
    },
    showCategoryPages(category) {
      this.pages.data = [];
      this.pages.category = category;
      this.pages.page = 1;
      this.getPages();
      this.$f7.tab.show("#tab-home");
    },
    tabHomeShown() {},
    tabCategoriesShown() {},
    onBackKeyDown(e) {
      e.preventDefault();
      window.navigator.app.exitApp();
    }
  }
};
</script>
