<template>
  <section class='post-card flex-col'>
    <div class='flex'>
      <div class='post-left flex-col'>
        <div class='title' v-if='content.title'>{{ content.title }}</div>
        <div class='desc text-two'>{{ content.desc_content }}</div>
      </div>
      <div class='post-right' v-if='src'>
        <img class='image-preview' :src='src' alt='' v-if='content.type === 1 || content.type === 0'>
        <video class='video-preview' :src='src' v-else-if='content.type === 2'></video>
      </div>
    </div>
    <div class='flex-c-b post-footer'>
      <div class='flex-v'>
        <div class='planet-info flex-v'>
          <img :src='content.planet.avatar' alt='' class='avatar'>
          <span class='"name'>{{ content.planet.name }}</span>
        </div>
        <TalkApprovalShare :content.sync='content' />
      </div>
      <div class='time'>{{ content.created_at }}</div>
    </div>

  </section>
</template>

<script>
import TalkApprovalShare from '@/components/TalkApprovalShare';

export default {
  name: 'PostCard',
  props: {
    content: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    }
  },
  computed: {
    src() {
      const { media } = this.content;
      if (media.length > 0) {
        return media[0].media_link;
      } else {
        return false;
      }
    }
  },
  components: {
    TalkApprovalShare
  }
};
</script>

<style scoped lang='less'>
.post-card {
  padding: 24px 0;
  margin: 0 32px;

  .title {
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #141b29;
  }

  .post-left {
    flex: 1;


    .title {
      margin-bottom: 12px;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #141b29;
    }


    .desc {
      min-height: 50px;
      font-size: 14px;
      line-height: 180%;
      color: #141b29;
    }
  }

  .post-right {
    margin-bottom: 26px;

    .image-preview {
      object-fit: fill;
      width: 134px;
      height: 100px;
      margin-left: 13px;
    }

    .video-preview {
      width: 134px;
      height: 100px;
      margin-left: 13px;
    }
  }

  .post-footer {
    .planet-info {
      margin-right: 24px;

      .avatar {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      .name {
        font-size: 12px;
        line-height: 17px;
        color: #39393b;
      }
    }

    .time {
      font-size: 12px;
      line-height: 17px;
      color: #5c6573;
    }
  }

  & + & {
    border-top: 1px solid #eaeaea;
  }
}
</style>
