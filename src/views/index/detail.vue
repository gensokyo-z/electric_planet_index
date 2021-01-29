<template>
  <section class="index-detail">
    <div class="layout">
      <Header />
      <div class="layout-main">
        <div class="tweet-container">
          <div class="tweet-main">
            <article class="tweet-article">
              <h1 class="article-title">{{content.title}}</h1>
              <div class="article-info">
                <div class="article-avatar"
                  v-show="content.source === 'user'">
                  <img :src="content.user.avatar">
                </div>
                <div class="article-author"
                  v-show="content.source === 'user'"> {{content.user.username}}· </div>

                <div class="article-date">{{content.create_time||content.created_at}}</div>
                <div class="article-date"
                  v-show="content.url"> <a :href="content.url"
                    target="_blank">查看原文</a></div>
              </div>
              <div class="article-planet"
                v-show="content.source !== 'user'">&nbsp;{{content.planet.name}}
                <a v-for="(tag,idx) in content.tags"
                  :key="idx">#{{tag.name}}</a>
              </div>
              <div class="article-content"
                v-html="content.content"></div>
              <section class="comments-section"
                id="comments-section"
                ref="commentsSection"
                v-show="commentList">
                <h2 class="section-title">全部评论</h2>
                <div class="comment-container">
                  <ul class="comments-list">
                    <li class="comment-item"
                      v-for="(item,index) in commentList"
                      :key="index">
                      <div class="author-avatar">
                        <img :src="item.user.avatar">
                      </div>
                      <div class="comment-main">
                        <div class="comment-header">
                          <span class="author-name">{{item.user.username}}</span> ·
                          <span class="comment-time">{{item.created_at}}</span>
                        </div>
                        <div class="comment-content">
                          {{item.content}}
                        </div>
                        <div class="comment-footer">
                          <div class="footer-button"
                            @click="checkAuth(bindApproval(item))">
                            <div class="like-simple">
                              <i class="iconfont iconzan"></i>
                              <span class="data-number">{{item.user_liked_count>0?item.user_liked_count:'点赞'}}</span>
                            </div>
                          </div>
                          <div class="footer-button"
                            @click="checkAuth(handlerInputDialog(item))">
                            <i class="iconfont iconpinglun"></i>
                            <span class="data-number">{{item.second_comments_count>0?item.second_comments_count:'回复'}}</span>
                          </div>
                        </div>
                        <ul class="reply-container">
                          <li class="comment-item"
                            v-for="(item1,index) in item.second_comments"
                            :key="index">
                            <div class="author-avatar">
                              <img :src="item1.user.avatar">
                            </div>
                            <div class="comment-main">
                              <div class="comment-header">
                                <span class="author-name">{{item1.user.username}}</span> ·
                                <span class="comment-time">{{item1.created_at}}</span>
                              </div>
                              <div class="comment-content">
                                {{item1.content}}
                              </div>
                              <div class="comment-footer">
                                <div class="footer-button"
                                  @click="checkAuth(bindApproval(item1))">
                                  <div class="like-simple">
                                    <i class="iconfont iconzan"></i>
                                    <span class="data-number">点赞</span>
                                  </div>
                                </div>
                                <div class="footer-button"
                                  @click="checkAuth(handlerInputDialog(item1))">
                                  <i class="iconfont iconpinglun"></i>
                                  <span class="data-number">回复</span>
                                </div>
                              </div>
                              <ul class="reply-container">
                                <li></li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            </article>
            <Footer :content="content" />
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="发表评论"
      top="30vh"
      width="630px"
      :visible.sync="showInput"
      custom-class="input-item"
      append-to-body>
      <div class="comment-editor">
        <div class="editor">
          <el-input type="textarea"
            :rows="4"
            placeholder="请输入评论内容"
            maxlength="140"
            show-word-limit
            v-model="message">
          </el-input>
        </div>
        <div class="editor-function">
          <el-button :class="{'empty':message.length === 0}"
            :disabled="message.length === 0"
            @click="sendMessage">回复</el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { getPostsDetail, getPostsComments, comments, commentsLikes, commentsUnlikes } from '@/api/post';
import util from '@/utils/util';
export default {
  data() {
    return {
      flash: true,
      loading: true,
      id: this.$route.query.id || '',
      hiddenMeun: true,
      content: {
        planet: {},
        tags: [],
        user: {}
      },
      commentList: null,
      showInput: false,
      comment: {},
      message: ''
    };
  },
  mounted() {
    this.$bus.$on('snedComment', () => {
      this.getDetail(true);
    });
    this.getDetail(false);
    // document.querySelector('#app').addEventListener('click', () => {
    //   this.hiddenMeun = false
    // })
  },
  methods: {
    checkAuth(cb) {
      this.$store.dispatch('needAuth', cb);
    },
    conutDown(time = 700) {
      setTimeout(() => {
        this.flash = false;
        this.loading = false;
      }, time);
    },
    getDetail(flag) {
      if (flag) {
        const commentsSection = this.$refs.commentsSection;
        if (commentsSection) {
          setTimeout(() => {
            commentsSection.scrollIntoView(true);
          }, 100);
        }
      }
      getPostsDetail(this.id).then(res => {
        if (res.code === 200) {
          let time = 700;
          if (res.data.source === 'user') {
            res.data.user.avatar = util.defaultAvatar(res.data.user.avatar);
          } else if (res.data.source === '微博') {
            time = 1000;
            res.data.weiboAvatar = util.defaultAvatar('');
          }
          res.data.thumb_pic = util.getFirstImg(res.data.content);
          res.data.planetBg = this.$state.allPlanet.find(v => v.id === res.data.planet_id).avatar;
          this.content = res.data;
          if (this.content.url) {
            this.conutDown(time);
          } else {
            this.flash = false;
            this.loading = false;
          }
          getPostsComments({ id: this.id, page: 1 }).then(res => {
            if (res.code === 200) {
              res.data.forEach(e => {
                e.comments_count = e.second_comments_count;
                e.user.avatar = util.defaultAvatar(e.user.avatar);
                e.second_comments.forEach(v => {
                  v.user.avatar = util.defaultAvatar(v.user.avatar);
                });
              });
              this.commentList = res.data;
            }
          });
        }
      });
    },
    bindApproval(item) {
      if (item.has_liked) {
        commentsUnlikes(item.id).then(res => {
          if (res.code === 200) {
            // this.hasLiked = !this.hasLiked;
            // this.userLikedCount--;
            this.$message('取消评论点赞成功！');
          }
        });
      } else {
        commentsLikes(item.id).then(res => {
          if (res.code === 200) {
            // this.hasLiked = !this.hasLiked;
            this.$message.success('点赞评论成功！');
            this.userLikedCount++;
          }
        });
      }
    },
    handlerInputDialog(item) {
      this.comment = item;
      this.showInput = true;
    },
    sendMessage() {
      let content = this.message;
      if (content.length > 140) {
        return this.$message('请限制评论在140个字以内');
      }
      comments({
        content,
        id: this.comment.id
      }).then(res => {
        if (res.code === 200) {
          this.message = '';
          this.showInput = false;
          this.$bus.$emit('snedComment');
          this.$message.success('评论成功！');
        } else {
          this.$message(res.msg);
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    addPlanet() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否加入该星球'
        })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    sendComment() {}
  },
  computed: {
    btnName() {
      return '加入';
    }
  }
};
</script>
<style scoped src='./detail.less' lang="less" rel="stylesheet/less">
</style>
