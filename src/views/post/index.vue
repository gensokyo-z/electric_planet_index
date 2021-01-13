<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'
// import { getInfo } from '@/api/user'

export default {
  name: 'CreateArticle',
  components: { ArticleDetail },
  mounted () {
    // getInfo()
  }
}
</script>
