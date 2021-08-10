<template>
  <section class='index-detail'>
    <div class='tweet-main'>
      <article class='tweet-article'>
        <!-- 文章封面 -->
        <div class='pic'
             v-if='content.thumb_pic'>
          <img :src='content.thumb_pic'>
        </div>
        <!-- 视频 -->
        <div class='video'
             v-if='postType === 2'>
          <video :class="{'hidden':showPreview}"
                 :src='content.media[0].media_link'
                 controls='controls'
                 preload='metadata'
                 controlslist='nodownload'
                 ref='video'
                 x5-playsinline=''
                 playsinline='true'
                 webkit-playsinline='true'
                 x-webkit-airplay='true'
                 x5-video-player-type='h5'
                 x5-video-player-fullscreen=''
                 x5-video-orientation='portraint'>
          </video>
          <div class='previwe-img'
               v-show='showPreview'
               ref='previewImg'
               @click.stop='playVideo'>
            <img :src='videoPreviwe'>
            <div v-if='videoPlayed'
                 class='video-replay'></div>
            <div v-else
                 class='video-ready'></div>
          </div>
        </div>
        <!-- 标题 -->
        <div class='title'
             v-if='postType === 1 || postType === 2'>
          <h1 class='article-title'>{{ content.title }}</h1>
        </div>
        <!-- 作者信息 -->
        <div class='auther'>
          <div class='top'>
            <div class='planet'
                 @click='$router.push(`/planetdetail/${content.planet_id}`);'>来自{{ content.planet.name }}社区
            </div>
            <div class='tags'>
              <div class='tag'
                   v-for='(item,index) in content.tags'
                   :key='index'>#{{ item.name }}
              </div>
            </div>
          </div>
          <div class='bottom'>
            <div class='name'>{{ content.user.username }}</div>
            <div class='time'>{{ content.created_at }}</div>
            <div class='readed'></div>
          </div>
        </div>
        <!-- 文章内容 -->
        <div class='article-content'
             v-html='content.content'></div>
        <!-- 动态多图 -->
        <div class='media-img'
             v-if='postType === 0 && content.media.length >0'>
          <div class='media-pic'
               v-for='(item,index) in content.media'
               :key='index'>
            <el-image :src='item.media_link'
                      style='width: 260px; height: 260px'
                      fit='cover'
                      :preview-src-list='srcList'>
            </el-image>
          </div>
        </div>
        <!-- 评论 -->
        <section class='comments-section'
                 id='comments-section'
                 ref='commentsSection'
                 v-show='commentList'>
          <div class='comments-head'>
            <div class='left'>
              <div class='bottom'
                   @click='focusToPostComment'>
                <i class='iconfont iconpinglun'></i>
                <span class='data-number'>评论</span>
                <span class='data-number'>{{ content.comments_count || 0 }}</span>
              </div>
              <div class='bottom'
                   @click='bindApproval(content)'>
                <i class='iconfont iconzan'
                   :class="{'has-liked':hasLiked}"></i>
                <span class='data-number'>点赞</span>
                <span class='data-number'>{{ userLikedCount || 0 }}</span>
              </div>
            </div>
            <div class='right'>
              <div class='bottom'
                   @mouseenter='showShareCard(true)'
                   @mouseleave='showShareCard(false)'>
                <i class='iconfont icondenglu-weixin'></i>
                <span class='data-number'>分享至微信</span>
              </div>
              <div class='bottom'>
                <span class='data-number'
                      @click='copyLink'>复制链接</span>
              </div>
            </div>
          </div>
          <div class='comments-user'>
            <div class='avatar'>
              <img :src='userAvatar'
                   @click='goUrl(`/author/${content.user_id}`)'>
            </div>
            <div class='input'>
              <el-input v-model='postComment'
                        type='textarea'
                        :autosize='{minRows:1}'
                        resize='none'
                        ref='postComment'
                        placeholder='来吧！说两句，表达一下关键或看法吧~'></el-input>
            </div>
            <div class='send'>
              <el-button @click='sendMessage'>发布</el-button>
            </div>
          </div>
          <div class='comment-container'>
            <h2 class='section-title'>相关评论</h2>
            <ul class='comments-list'>
              <li class='comment-item'
                  v-for='(item,index) in commentList'
                  :key='index'>
                <div class='comment-main'>
                  <div class='comment-header'>
                    <div class='left'>
                      <div class='author-avatar' @click='goUrl(`/author/${item.user_id}`)'>
                        <img :src='item.user.avatar'>
                      </div>
                      <div class='col'>
                        <div class='author-name' @click='goUrl(`/author/${item.user_id}`)'>{{ item.user.username }}
                        </div>
                        <div class='comment-time'>{{ item.created_at }}</div>
                        <div class='comment-content'>
                          {{ item.content }}
                        </div>
                        <div class='footer-button'
                             @click='handlerInputDialog(item)'>
                          <div class='data-number'>
                            <i class='iconfont iconpinglun'
                               v-if='item.second_comments_count>0'></i>
                            <span>{{ item.second_comments_count > 0 ? item.second_comments_count : '回复' }}</span>
                          </div>
                          <div class='data-number'
                               v-if='item.canDel'>
                            <span class='del'>删除</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class='footer-button'
                         @click='bindApproval(item)'>
                      <div class='like-simple'>
                        <i class='iconfont iconzan'
                           :class="{'has-liked':item.has_liked}"></i>
                        <span class='data-number'>{{ item.user_liked_count > 0 ? item.user_liked_count : '点赞' }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- 二级评论 -->
                  <div class='comment-footer'
                       v-if='item.comments_count>0'>
                    <ul class='reply-container'>
                      <li class='reply-item'
                          v-for='(item1,index) in item.childcomment'
                          :key='index'>
                        <div class='reply-main'>
                          <div class='reply-header'>
                            <template v-if='item1.parent_id === item.id'>
                              <span class='reply-name'>{{ item1.user.username }}</span>：
                              <div class='reply-content'>
                                {{ item1.content }}
                              </div>
                            </template>
                            <template v-else>
                              <span class='reply-name'>{{ item1.user.username }}</span>&emsp;回复&emsp;<span
                              class='reply-name'>{{ item1.auther }}</span>：
                              <div class='reply-content'>
                                {{ item1.content }}
                              </div>
                            </template>
                          </div>
                          <div class='reply-footer'>
                            <div class='footer-button'
                                 @click='handlerInputDialog(item1)'>
                              <div class='like-simple'>
                                <span class='data-number'>回复</span>
                              </div>
                            </div>
                            <div class='footer-button'
                                 v-if='item1.canDel'
                                 @click='delComment(item1)'>
                              <span class='data-number'>删除</span>
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
      <article class='tweet-user'>
        <div class='avatar'
             v-if='avatar'>
          <img :src='avatar'
               @click='goUrl(`/author/${content.user_id}`)'>
        </div>
        <div class='name'
             @click='goUrl(`/author/${content.user_id}`)'>{{ username }}
        </div>
        <div class='sign'>{{ sign }}</div>
        <div class='data'>
          <div class='item'
               v-for='(item,index) in dataList'
               :key='index'>
            <span>{{ item.count }}</span>
            <label>{{ item.name }}</label>

          </div>
        </div>
        <div class='btn-box'>
          <el-button :class='{followers:content.user.has_liked}'
                     @click='folloed'>{{ content.user.has_liked ? '已关注' : '关注' }}
          </el-button>
        </div>
      </article>
    </div>
    <Share :content='content'
           ref='share' />
    <el-dialog title='写回复'
               top='30vh'
               width='630px'
               :visible.sync='showInput'
               :lock-scroll='false'
               custom-class='input-item'
               append-to-body>
      <div class='comment-editor'>
        <div class='editor'>
          <el-input type='textarea'
                    :rows='4'
                    :placeholder="'回复：'+reUsername"
                    maxlength='140'
                    show-word-limit
                    v-model='message'>
          </el-input>
        </div>
        <div class='editor-function'>
          <el-button :class="{'empty':message.length === 0}"
                     :disabled='message.length === 0'
                     @click='sendComment'>发送
          </el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import {
  getPostsDetail,
  getPostsComments,
  postsComments,
  comments,
  postLike,
  postUnlike,
  commentsLikes,
  commentsUnlikes,
  delComment
} from '@/api/post';
import { followUser } from '@/api/user';
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
    goUrl(url) {
      this.$router.push(url);
    },
    focusToPostComment() {
      this.$refs.postComment.focus();
    },
    checkAuth() {
      return new Promise((resolve, reject) => {
        this.$store.dispatch('needAuth').then(() => {
          resolve();
        });
      });
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
          if (res.data.source === '微博') {
            time = 1000;
            res.data.weiboAvatar = util.defaultAvatar('');
          }
          if (res.data.type === 0 && res.data.media.length > 0) {
            for (let i of res.data.media) {
              this.srcList.push(i.media_link);
            }
          }
          if (res.data.tags.length > 4) {
            res.data.tags.splice(4, res.data.tags.length - 4);
          }
          this.dataList[0].count = res.data.user.posts;
          this.dataList[1].count = res.data.user.followers;
          this.dataList[2].count = res.data.user.like_count;
          this.postType = res.data.type;
          res.data.planetBg = this.$state.allPlanet.find(v => v.id === res.data.planet_id).avatar;
          let year = new Date().getFullYear();
          if (res.data.created_at.includes(year)) {
            res.data.created_at = res.data.created_at.substr(5, res.data.created_at.length - 1);
          }
          res.data.content = res.data.content.replace(/<br\/?>/g, '');
          this.content = res.data;
          if (this.content.url) {
            this.conutDown(time);
          } else {
            this.flash = false;
            this.loading = false;
          }
        }
        this.getComments(flag);
      });
    },
    getComments(flag) {
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
            let year = new Date().getFullYear();
            if (e.created_at.includes(year)) {
              e.created_at = e.created_at.substr(5, e.created_at.length - 1);
            }
            e.comments_count = e.childcomment.length;
            e.user.avatar = util.defaultAvatar(e.user.avatar);
            e.canDel = e.user_id === this.$state.userInfo.id;
            let childcomment = [];
            e.childcomment.forEach(v => {
              if (v.parent_id !== e.id && e.childcomment.some(i => v.parent_id === i.id)) {
                v.auther = e.childcomment.find(i => v.parent_id === i.id).user.username;
              }
              v.canDel = v.user_id === this.$state.userInfo.id;
              if (v.parent_id === e.id || (v.parent_id !== e.id && e.childcomment.some(i => v.parent_id === i.id))) {
                childcomment.push(v);
              }
            });
            e.childcomment = childcomment;
          });
          this.commentList = commentRes.data;
        }
      });
    },
    bindApproval(item) {
      this.checkAuth().then(() => {
        // 点赞文章
        let path = null;
        if (item.id === this.content.id) {
          if (this.hasLiked) {
            path = postUnlike;
          } else {
            path = postLike;
          }
          path(item.id).then(res => {
            if (this.hasLiked) {
              this.userLikedCount--;
              this.$message('取消点赞成功！');
            } else {
              this.$message.success('点赞成功！');
              this.userLikedCount++;
            }
            this.hasLiked = !this.hasLiked;
          });
        } else {
          // 点赞评论
          if (item.has_liked) {
            path = commentsUnlikes;
          } else {
            path = commentsLikes;
          }
          path(item.id).then(res => {
            if (item.has_liked) {
              this.$message('取消点赞成功！');
              item.user_liked_count--;
            } else {
              this.$message.success('点赞成功！');
              item.user_liked_count++;
            }
            item.has_liked = !item.has_liked;
          });
        }
      });
    },
    handlerInputDialog(item) {
      this.checkAuth().then(() => {
        this.comment = item;
        this.reUsername = item.user.username;
        this.showInput = true;
      });
    },
    sendMessage() {
      this.checkAuth().then(() => {
        let content = this.postComment;
        if (!content) {
          return this.$message.warning('请输入评论');
        } else if (content.length > 140) {
          return this.$message.warning('请限制评论在140个字以内');
        }
        postsComments({
          content,
          id: this.content.id
        }).then(res => {
          if (res.code === 200) {
            this.postComment = '';
            this.$message.success('评论成功！');
            this.getComments(true);
          } else {
            this.$message(res.msg);
          }
        });
      });
    },
    sendComment() {
      if (!this.message) {
        return this.$message.warning('请输入评论');
      } else if (this.message.length > 140) {
        return this.$message.warning('请限制评论在140个字以内');
      }
      comments({
        content: this.message,
        id: this.comment.id
      }).then(res => {
        this.message = '';
        this.showInput = false;
        this.$message.success('评论成功！');
        this.getComments(true);
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
    },
    folloed() {
      this.checkAuth().then(() => {
        return new Promise((resolve, reject) => {
          if (this.content.user.has_liked === 1) {
            // this.goUrl(`/author/${this.content.user_id}`);
            resolve();
          } else {
            followUser(this.content.user_id).then(res => {
              this.content.user.has_liked = true;
              this.$message.success('关注成功！');
              this.$store.dispatch('getInfo');
              this.getDetail()
              resolve();
            });
          }
        });
      });
    },
    delComment(item) {
      delComment(item.id).then(res => {
        this.$message.success('删除评论成功！');
        this.getComments(true);
      });
    }
  },
  watch: {
    content: {
      handler(val) {
        this.hasLiked = val.IsBeLiked;
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
<style scoped src='./detail.less' lang='less' rel='stylesheet/less'>
</style>
