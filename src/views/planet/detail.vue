<template>
  <section class='planet flex-col'>
    <div class='planet-header' v-show='content.id'>
      <img :src='background' alt='' class='bg'>
      <img :src='avatar' alt='' class='avatar'>
      <div class='title flex-cc'>
        <span class='name'>{{ planetName }}</span><img src='@/assets/images/icon_24.png' alt='' class='vip'>
      </div>
      <div class='intro worldhidden'>{{ intro }}</div>
      <div class='data flex-c-b'>
        <!--        <div class='author flex-co-c'>-->
        <!--          <span class='label'>达人数</span>-->
        <!--          <span class='count'>1111</span>-->
        <!--        </div>-->
        <div class='fans flex-co-c'>
          <span class='label'>粉丝数</span>
          <span class='count'>{{ content.users_count }}</span>
        </div>
        <div class='posts flex-co-c'>
          <span class='label'>帖子数</span>
          <span class='count'>{{ content.posts_count }}</span>
        </div>
      </div>
      <div class='flex-c'>
        <button :class="['join',{ed:joined}]"
                @click='addPlanet'>{{ joined ? '已关注星球' : '关注星球' }}
        </button>
      </div>
    </div>
    <div class='flex'>
      <div class='left'>
        <CardList />
      </div>
      <div class='right'>
        <MasterCard />
        <Footer />
      </div>
    </div>
  </section>
</template>

<script>
import CardList from '@/components/CardList';
import MasterCard from '@/components/MasterCard';
import { getPlanetDetail, joinPlanet, quitPlanet } from '@/api/planet';
import util from '@/utils/util';

export default {
  name: 'planet',
  data() {
    return {
      id: 0,
      content: {}
    };
  },
  created() {
    this.id = this.$route.params.planetId || 0;
  },
  mounted() {
    this.getPlanetDetail();
  },
  methods: {
    getPlanetDetail() {
      getPlanetDetail(this.id).then(res => {
        if (res.code === 200) {
          this.content = res.data;
        }
      });
    },
    async addPlanet() {
      if (!util.getcookie('TOKEN')) {
        return this.$store.dispatch('needAuth');
      }
      if (this.joined) {
        this.$confirm('是否取消关注星球', '提示').then(() => {
          quitPlanet(this.id).then(res => {
            this.$store.dispatch('getUserPlanetList').then(() => {
              this.$message.success('取消关注星球成功！');
              this.getPlanetDetail();
            });
          });
        }).catch(() => {
          // on cancel
        });
      } else {
        // this.$confirm('是否加入该星球', '提示')
        //   .then(() => {
        joinPlanet(this.id).then(res => {
          this.$store.dispatch('getUserPlanetList').then(() => {
            this.$message.success('关注星球成功！');
            this.getPlanetDetail();
          });
        });
        // })
        // .catch(() => {
        //   // on cancel
        // });
      }
    }
  },
  computed: {
    avatar() {
      if (this.content && this.content.avatar) {
        return this.content.avatar;
      } else {
        // return require('@/assets/images/Frame 142.png');
        return '';
      }
    },
    background() {
      if (this.content && this.content.background) {
        return this.content.background;
      } else {
        //  return require('@/assets/images/Rectangle 39.png');
        return '';
      }
    },
    planetName() {
      if (this.content && this.content.name) {
        return this.content.name;
      } else {
        return '';
      }
    },
    intro() {
      if (this.content && this.content.intro) {
        return this.content.intro;
      } else {
        return '';
      }
    },
    joined() {
      return this.$state.allPlanet.some(e => e.id === this.content.id);
    }
  },
  components: {
    CardList,
    MasterCard
  }
};
</script>

<style scoped src='./detail.less' lang='less' rel='stylesheet/less'>
</style>
