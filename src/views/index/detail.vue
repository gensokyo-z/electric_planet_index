<template>
  <section class="index-detail">
    <div class="layout">
      <Header />
      <div class="layout-main">
        <div class="tweet-container">
          <div class="tweet-main">
            <article class="tweet-article">
              <!-- 文章封面 -->
              <div class="pic"
                v-if="content.thumb_pic && postType === 1">
                <img :src="content.thumb_pic">
              </div>
              <!-- 视频 -->
              <div class="video"
                v-if="postType === 2">
                <video :class="{'hidden':showPreview}"
                  :src="content.media[0].media_link"
                  controls="controls"
                  preload='metadata'
                  controlslist="nodownload"
                  ref="video"
                  x5-playsinline=""
                  playsinline="true"
                  webkit-playsinline="true"
                  x-webkit-airplay="true"
                  x5-video-player-type="h5"
                  x5-video-player-fullscreen=""
                  x5-video-orientation="portraint">
                </video>
                <div class="previwe-img"
                  v-show="showPreview"
                  ref="previewImg"
                  @click.stop="playVideo">
                  <img :src="videoPreviwe">
                  <div v-if="videoPlayed"
                    class="video-replay"></div>
                  <div v-else
                    class="video-ready"></div>
                </div>
              </div>
              <!-- 标题 -->
              <div class="title"
                v-if="postType === 1 || postType === 2">
                <h1 class="article-title">{{content.title}}</h1>
              </div>
              <!-- 作者信息 -->
              <div class="auther">
                <div class="top">
                  <div class="planet">来自{{content.planet.name}}社区</div>
                  <div class="tags">
                    <div class="tag"
                      v-for="(item,index) in content.tags"
                      :key="index">#{{item.name}}</div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="name">{{content.user.username}}</div>
                  <div class="time">{{content.created_at}}</div>
                  <div class="readed"></div>
                </div>
              </div>
              <!-- 文章内容 -->
              <div class="article-content"
                v-html="content.content"></div>
              <!-- 动态多图 -->
              <div class="media-img"
                v-if="postType === 0 && content.media.length >0">
                <div class="media-pic"
                  v-for="(item,index) in content.media"
                  :key="index">
                  <el-image :src="item.media_link"
                    style="width: 260px; height: 260px"
                    fit="cover"
                    :preview-src-list="srcList">
                  </el-image>
                </div>
              </div>
              <!-- 评论 -->
              <section class="comments-section"
                id="comments-section"
                ref="commentsSection"
                v-show="commentList">
                <div class="comments-head">
                  <div class="left">
                    <div class="bottom"
                      @click="checkAuth(handlerInputDialog(content))">
                      <i class="iconfont iconpinglun"></i>
                      <span class="data-number">评论</span>
                      <span class="data-number">{{content.comments_count ||0}}</span>
                    </div>
                    <div class="bottom"
                      @click="checkAuth(bindApproval(content))">
                      <i class="iconfont iconzan"
                        :class="{'has-liked':hasLiked}"></i>
                      <span class="data-number">点赞</span>
                      <span class="data-number">{{userLikedCount|| 0}}</span>
                    </div>
                  </div>
                  <div class="right">
                    <div class="bottom"
                      @mouseenter="showShareCard(true)"
                      @mouseleave="showShareCard(false)">
                      <i class="iconfont icondenglu-weixin"></i>
                      <span class="data-number">分享至微信</span>
                    </div>
                    <div class="bottom">
                      <span class="data-number"
                        @click="copyLink">复制链接</span>
                    </div>
                  </div>
                </div>
                <div class="comments-user">
                  <div class="avatar">
                    <img :src="userAvatar">
                  </div>
                  <div class="input">
                    <el-input v-model="postComment"
                      type="textarea"
                      :autosize="{minRows:1}"
                      resize="none"
                      placeholder="来吧！说两句，表达一下关键或看法吧~"></el-input>
                  </div>
                  <div class="send">
                    <el-button @click="sendMessage">发布</el-button>
                  </div>
                </div>
                <div class="comment-container">
                  <h2 class="section-title">相关评论</h2>
                  <ul class="comments-list">
                    <li class="comment-item"
                      v-for="(item,index) in commentList"
                      :key="index">
                      <div class="comment-main">
                        <div class="comment-header">
                          <div class="left">
                            <div class="author-avatar">
                              <img :src="item.user.avatar">
                            </div>
                            <div class="col">
                              <div class="author-name">{{item.user.username}}</div>
                              <div class="comment-time">{{item.created_at}}</div>
                              <div class="comment-content">
                                {{item.content}}
                              </div>
                              <div class="footer-button"
                                @click="checkAuth(handlerInputDialog(item))">
                                <div class="data-number">
                                  <i class="iconfont iconpinglun"
                                    v-if="item.second_comments_count>0"></i>
                                  <span>{{item.second_comments_count>0?item.second_comments_count:'回复'}}</span>
                                </div>
                                <div class="data-number"
                                  v-if="item.canDel">
                                  <span class="del">删除</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="footer-button"
                            @click="checkAuth(bindApproval(item))">
                            <div class="like-simple">
                              <i class="iconfont iconzan"
                                :class="{'has-liked':item.has_liked}"></i>
                              <span class="data-number">{{item.user_liked_count>0?item.user_liked_count:'点赞'}}</span>
                            </div>
                          </div>
                        </div>
                        <!-- 二级评论 -->
                        <div class="comment-footer"
                          v-if="item.comments_count>0">
                          <ul class="reply-container">
                            <li class="reply-item"
                              v-for="(item1,index) in item.childcomment"
                              :key="index">
                              <div class="reply-main">
                                <div class="reply-header">
                                  <template v-if="item1.parent_id === item.id">
                                    <span class="reply-name">{{item1.user.username}}</span>：<div class="reply-content">
                                      {{item1.content}}
                                    </div>
                                  </template>
                                  <template v-else>
                                    <span class="reply-name">{{item1.user.username}}</span>&emsp;回复&emsp;<span class="reply-name">{{item1.auther}}</span>：<div class="reply-content">
                                      {{item1.content}}
                                    </div>
                                  </template>
                                </div>
                                <div class="reply-footer">
                                  <div class="footer-button"
                                    @click="checkAuth(handlerInputDialog(item1))">
                                    <div class="like-simple">
                                      <span class="data-number">回复</span>
                                    </div>
                                  </div>
                                  <div class="footer-button"
                                     v-if="item1.canDel"
                                    @click="checkAuth(handlerInputDialog(item1))">
                                    <span class="data-number">删除</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            </article>
            <!-- 侧边栏-作者信息 -->
            <article class="tweet-user">
              <div class="avatar"
                v-if="avatar">
                <img :src="avatar">
              </div>
              <div class="name">{{username}}</div>
              <div class="sign">{{sign}}</div>
              <div class="data">
                <div class="item"
                  v-for="(item,index) in dataList"
                  :key="index">
                  <span>{{item.count}}</span>
                  <label>{{item.name}}</label>

                </div>
              </div>
              <div class="btn-box">
                <el-button>关注</el-button>
              </div>
            </article>
            <!-- <Footer :content="content" /> -->
          </div>
        </div>
      </div>
      <Share :content="content"
        ref="share" />
    </div>

    <el-dialog title="写回复"
      top="30vh"
      width="630px"
      :visible.sync="showInput"
      :lock-scroll="false"
      custom-class="input-item"
      append-to-body>
      <div class="comment-editor">
        <div class="editor">
          <el-input type="textarea"
            :rows="4"
            :placeholder="'回复：'+reUsername"
            maxlength="140"
            show-word-limit
            v-model="message">
          </el-input>
        </div>
        <div class="editor-function">
          <el-button :class="{'empty':message.length === 0}"
            :disabled="message.length === 0"
            @click="sendComment">发送</el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { getPostsDetail, getPostsComments, postsComments, comments, postLike, postUnlike, commentsLikes, commentsUnlikes } from '@/api/post';
import util from '@/utils/util';
export default {
  data() {
    return {
      postType: '',
      flash: true,
      loading: true,
      id: this.$route.query.id || '',
      hiddenMeun: true,
      content: {
        planet: {},
        tags: [],
        user: {}
      },
      dataList: [
        { name: '发布内容', count: 0 },
        { name: '粉丝', count: 0 },
        { name: '获赞', count: 0 }
      ],
      commentList: null,
      showInput: false,
      showPreview: true,
      videoPlayed: false,
      videoPreviwe: '',
      comment: {},
      postComment: '',
      message: '',
      srcList: [],
      hasLiked: false,
      userLikedCount: 0,
      reUsername: ''
    };
  },
  mounted() {
    this.$bus.$on('sendComment', () => {
      this.getDetail(true);
    });
    let flag = !!this.$route.query.sendComment;
    this.getDetail(flag);
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
      getPostsDetail(this.id).then(res => {
        if (res.code === 200) {
          let time = 700;
          if (res.data.source === 'user') {
            res.data.user.avatar = util.defaultAvatar(res.data.user.avatar);
          } else if (res.data.source === '微博') {
            time = 1000;
            res.data.weiboAvatar = util.defaultAvatar('');
          }
          if (res.data.type === 0 && res.data.media.length > 0) {
            for (let i of res.data.media) {
              this.srcList.push(i.media_link);
            }
          }
          this.dataList[2].conut = res.data.user_liked_count;
          this.dataList[1].conut = res.data.comments_count;
          this.dataList[0].conut = res.data.forwards_count;
          this.postType = res.data.type;
          res.data.planetBg = this.$state.allPlanet.find(v => v.id === res.data.planet_id).avatar;
          this.content = res.data;
          if (this.content.url) {
            this.conutDown(time);
          } else {
            this.flash = false;
            this.loading = false;
          }
          getPostsComments({ id: this.id, page: 1 }).then(commentRes => {
            if (flag) {
              const commentsSection = this.$refs.commentsSection;
              if (commentsSection) {
                setTimeout(() => {
                  commentsSection.scrollIntoView(true);
                }, 100);
              }
            }
            if (commentRes.code === 200) {
              commentRes.data.forEach(e => {
                e.comments_count = e.childcomment.length;
                e.user.avatar = util.defaultAvatar(e.user.avatar);
                e.canDel = e.user_id === this.$state.userInfo.id;
                e.childcomment.forEach(v => {
                  if (v.parent_id !== e.id) {
                    v.auther = e.childcomment.find(i => v.parent_id === i.id).user.username;
                  }
                  v.canDel = v.user_id === this.$state.userInfo.id;
                });
              });
              this.commentList = commentRes.data;
            }
          });
        }
      });
    },
    bindApproval(item) {
      let path1 = null;
      let path2 = null;
      if (item.id === this.content.id) {
        path1 = postLike;
        path2 = postUnlike;
        item.hasLiked = this.hasLiked;
      } else {
        path1 = commentsUnlikes;
        path2 = commentsLikes;
        item.hasLiked = item.has_liked;
      }
      if (item.hasLiked) {
        path1(item.id).then(res => {
          if (res.code === 200) {
            item.has_liked = !this.hasLiked;
            this.hasLiked = !this.hasLiked;
            this.userLikedCount--;
            this.$message('取消点赞成功！');
          }
        });
      } else {
        path2(item.id).then(res => {
          if (res.code === 200) {
            item.has_liked = !this.hasLiked;
            this.hasLiked = !this.hasLiked;
            this.$message.success('点赞成功！');
            this.userLikedCount++;
          }
        });
      }
    },
    handlerInputDialog(item) {
      this.comment = item;
      this.reUsername = item.user.username;
      this.showInput = true;
    },
    sendMessage() {
      let content = this.postComment;
      if (content.length > 140) {
        return this.$message('请限制评论在140个字以内');
      }
      postsComments({
        content,
        id: this.content.id
      }).then(res => {
        if (res.code === 200) {
          this.postComment = '';
          this.$message.success('评论成功！');
          this.getDetail(true);
        } else {
          this.$message(res.msg);
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    sendComment() {
      comments({
        content: this.message,
        id: this.comment.id
      }).then(res => {
        this.message = '';
        this.showInput = false;
        this.$message.success('评论成功！');
        this.getDetail(true);
      });
    },
    copyLink() {
      this.$copyText(window.location.href).then(
        () => {
          this.$message.success('复制成功!内容已经拷贝至剪贴板.');
        },
        () => {
          this.$message.error('复制失败');
        }
      );
    },
    showShareCard(flag) {
      this.$refs.share.openShowShare(flag);
    },
    getVideoposter() {
      let video = this.$refs.video;
      video.setAttribute('crossOrigin', 'Anonymous');
      video.currentTime = 0.001;
      video.onloadeddata = e => {
        console.log('videoPreviwe');
        this.videoPreviwe = util.getVideoPre(video);
      };
      video.onended = e => {
        this.videoPreviwe = util.getVideoPre(video);
        this.videoPlayed = true;
        this.showPreview = true;
      };
    },
    playVideo() {
      this.showPreview = false;
      this.$refs.video.play();
    }
  },
  watch: {
    content: {
      handler(val) {
        this.hasLiked = val.has_liked;
        this.userLikedCount = val.user_liked_count;
      },
      immediate: true
    },
    'content.media': {
      handler(val) {
        if (val && val.length > 0 && val[0].media_type === 'video') {
          this.$nextTick(this.getVideoposter);
        }
      },
      immediate: true
    }
  },
  computed: {
    userAvatar() {
      return this.$state.userInfo.avatar ? this.$state.userInfo.avatar : util.defaultAvatar();
    },
    avatar() {
      if (this.content.user && this.content.user.avatar) {
        return this.content.user.avatar;
      } else {
        return '';
      }
    },
    username() {
      if (this.content.user && this.content.user.username) {
        return this.content.user.username;
      } else {
        return '';
      }
    },
    sign() {
      if (this.content.user && this.content.user.username) {
        return this.content.user.username;
      } else {
        return '';
      }
    }
  },
  components: {
    Share: () => import('@/components/ShareImg/index')
  }
};
</script>
<style scoped>
.article-content >>> table {
  border-collapse: collapse;
}
.article-content >>> table td {
  text-align: center;
  padding: 0 10px;
  border: 1px solid;
}
</style>
<style scoped src='./detail.less' lang="less" rel="stylesheet/less">
</style>
