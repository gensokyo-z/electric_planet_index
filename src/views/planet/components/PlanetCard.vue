<template>
  <section class="planet-card">
    <div @click="$router.push(`/planetdetail?id=${content.id}`)">
      <div class="header">
        <div class="left">
          <div class="item">
            <img :src="content.avatar"
                 alt="avatar">
          </div>
          <div class="item">
            <span class="name">{{content.name}}</span>
            <span class="desc">已有{{content.users_count}}人加入</span>
          </div>
        </div>
        <div class="right">
          <button @click.stop="addPlanet(content)"
                  class="add"
                  v-if="type!=='my'&&!content.joined">{{`+ 加入`}}</button>
          <button class="enter"
                  v-else>{{`进入`}}</button>
        </div>
      </div>
      <div class="footer">
        <div class="desc">{{content.intro}}</div>
      </div>
    </div>
  </section>
</template>
<script>
import { joinPlanet } from '@/api/planet';
import util from '@/utils/util';
export default {
  name: 'PlanetCard',
  props: {
    type: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {};
  },
  methods: {
    async addPlanet (content) {
      let needAuth = false;
      if (!util.getcookie('TOKEN')) {
        await this.$store
          .dispatch('getInfo')
          .then(res => { })
          .catch(err => {
            needAuth = true;
            return console.log(err);
          });
      }
      if (needAuth) return;
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否加入该星球'
        })
        .then(() => {
          joinPlanet(content.id).then(async res => {
            if (res.code === 200) {
              await this.$store.dispatch('getUserPlanetList');
              this.goUrl(`/planetdetail?id=${content.id}`);
            }
          });
        })
        .catch(() => { });
    },
    goUrl (url) {
      this.$router.push(url);
    }
  }
};
</script>
<style lang="less" scoped>
.planet-card {
  margin: 0 32px 20px 32px;
  padding: 32px;
  width: 686px;
  height: 252px;
  background: #ffffff;
  border-radius: 12px;
  box-sizing: border-box;
}
.header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    .item {
      display: flex;
      flex-direction: column;
    }
    img {
      margin-right: 24px;
      width: 88px;
      height: 88px;
      border-radius: 50%;
    }
    .name {
      margin-bottom: 10px;
      font-size: 32px;
      color: rgba(0, 0, 0, 0.9);
    }
    .desc {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .right {
    .add,
    .enter {
      width: 150px;
      height: 56px;
      border-radius: 28px;
      font-size: 28px;
      color: rgba(0, 0, 0, 0.9);
    }
    .add {
      background: #ffdd27;
    }
    .enter {
      position: relative;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      &::after {
        position: absolute;
        top: 50%;
        transform: translateY(-50%) rotateZ(-45deg);
        width: 15px;
        height: 15px;
        content: '';
        border-right: 2px solid #979797;
        border-bottom: 2px solid #979797;
      }
    }
  }
}
.footer {
  .desc {
    font-size: 24px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }
}
</style>
