<template>
  <div id="address">
    <div class="address-box"
      @click="showTabBox">
      <el-input :value="regions"
        type="text"
        size="mini"
        placeholder="请选择地区"></el-input>
      <i class="el-icon-caret-bottom"></i>
    </div>
    <div class="tab-wrap">
      <ul v-show="isShowTab"
        class="tab-list">
        <li v-for="items in tab"
          :key="items.value"
          :class="items.selected?'select tab':'tab'"
          @click="bindTap(items.value)">
          <a>{{items.name}}</a>
        </li>
      </ul>
      <div v-show="isShowCommon"
        class="tab-box">
        <a v-for="items in common"
          :key="items.name"
          @click="bindCommon(items.name)"
          class="city">{{items.name}}</a>
        <a @click="bindTap('province')">更多&gt;</a>
        <!-- <span class="forEnglish"
              v-if="enAdderFlag"
              @click="changeENAdder">这是一个外文地址&gt;</span> -->
      </div>
      <div v-show="isShowProvince"
        class="tab-box province-box">
        <dl>
          <dt>A-G</dt>
          <dd>
            <a v-for="items in province.A_G"
              :key="items.name"
              @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
          <dt>H-K</dt>
          <dd>
            <a v-for="items in province.H_K"
              :key="items.name"
              @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
          <dt>L-S</dt>
          <dd>
            <a v-for="items in province.L_S"
              :key="items.name"
              @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
          <dt>T-Z</dt>
          <dd>
            <a v-for="items in province.T_Z"
              :key="items.name"
              @click="bindProvince(items.name)">{{items.name}}</a>
          </dd>
        </dl>
      </div>
      <div v-show="isShowCity"
        class="tab-box city-box">
        <a v-for="items in city"
          :key="items.name"
          @click="bindCity(items.name)">{{items.name}}</a>
      </div>
      <div v-show="isShowCounty"
        class="tab-box county-box">
        <a v-for="items in county"
          :key="items.name"
          @click="bindCounty(items.name)">{{items.name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import areaList from '@/utils/area';
export default {
  name: 'cascader',
  props: {
    regions: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tab: [
        {
          name: '常用',
          value: 'common',
          selected: true
        },
        {
          name: '省份',
          value: 'province',
          selected: false
        },
        {
          name: '城市',
          value: 'city',
          selected: false,
          disable: true
        },
        {
          name: '县区',
          value: 'county',
          selected: false,
          disable: true
        }
      ],
      common: [
        {
          name: '上海'
        },
        {
          name: '深圳市'
        },
        {
          name: '北京'
        },
        {
          name: '广州市'
        },
        {
          name: '苏州市'
        },
        {
          name: '成都市'
        },
        {
          name: '东莞市'
        },
        {
          name: '宁波市'
        },
        {
          name: '天津'
        },
        {
          name: '杭州市'
        },
        {
          name: '青岛市'
        },
        {
          name: '重庆'
        },
        {
          name: '武汉市'
        },
        {
          name: '郑州市'
        }
      ],
      province: {
        A_G: [
          {
            name: '安徽'
          },
          {
            name: '澳门'
          },
          {
            name: '北京'
          },
          {
            name: '重庆'
          },
          {
            name: '福建'
          },
          {
            name: '甘肃'
          },
          {
            name: '广东'
          },
          {
            name: '广西'
          },
          {
            name: '贵州'
          }
        ],
        H_K: [
          {
            name: '海南'
          },
          {
            name: '河北'
          },
          {
            name: '河南'
          },
          {
            name: '黑龙江'
          },
          {
            name: '湖北'
          },
          {
            name: '湖南'
          },
          {
            name: '吉林'
          },
          {
            name: '江苏'
          },
          {
            name: '江西'
          }
        ],
        L_S: [
          {
            name: '辽宁'
          },
          {
            name: '内蒙古'
          },
          {
            name: '宁夏'
          },
          {
            name: '青海'
          },
          {
            name: '山东'
          },
          {
            name: '山西'
          },
          {
            name: '陕西'
          },
          {
            name: '上海'
          },
          {
            name: '四川'
          }
        ],
        T_Z: [
          {
            name: '天津'
          },
          {
            name: '台湾'
          },
          {
            name: '西藏'
          },
          {
            name: '新疆'
          },
          {
            name: '香港'
          },
          {
            name: '云南'
          },
          {
            name: '浙江'
          }
        ]
      },
      city: [],
      county: [],
      provinceCode: '',
      cityCode: '',
      isShowTab: false,
      isShowCommon: false,
      isShowProvince: false,
      isShowCity: false,
      isShowCounty: false
    };
  },
  watch: {
    provinceCode() {
      let provinceCode = this.provinceCode.substring(0, 2);
      // eslint-disable-next-line
      this.city = area.city_list.filter((items, index) => {
        Object()
        if (items.code.substring(0, 2) === provinceCode) {
          return items;
        }
      });
    },
    cityCode() {
      // try {
      //   loadArea({ city: this.cityCode }).then(district => {
      //     this.county = district;
      //   });
      // } catch (e) {
      //   console.log(e);
      // }
    }
  },
  methods: {
    // tab条
    showTabBox() {
      this.isShowTab = !this.isShowTab;
      if (this.isShowTab) {
        this.bindTap('common');
      } else {
        this.isShowCommon = false;
        this.isShowProvince = false;
        this.isShowCity = false;
        this.isShowCounty = false;
        // this.city = [];
        // this.county = [];
      }
    },
    // 跳转tab
    bindTap(type) {
      switch (type) {
        case 'common':
          this.isShowCommon = true;
          this.isShowProvince = false;
          this.isShowCity = false;
          this.isShowCounty = false;
          break;
        case 'province':
          this.isShowCommon = false;
          this.isShowProvince = true;
          this.isShowCity = false;
          this.isShowCounty = false;
          break;
        case 'city':
          this.isShowCommon = false;
          this.isShowProvince = false;
          this.isShowCity = true;
          this.isShowCounty = false;
          break;
        case 'county':
          this.isShowCommon = false;
          this.isShowProvince = false;
          this.isShowCity = false;
          this.isShowCounty = true;
          break;
      }
      this.tabChange(type);
    },
    // tab选择css控制
    tabChange(type) {
      this.tab.forEach(e => {
        if (e.value === type) {
          e.selected = true;
        } else {
          e.selected = false;
        }
      });
    },
    // 选择常用
    bindCommon(name) {
      this.provinceCode =
        areaList.city_list
          .find(e => {
            if (name.includes(e.name)) {
              return e;
            }
          })
          .code.substring(0, 2) + `0000000000`;
      let provinceName = areaList.province.find(e => {
        if (e.code === this.provinceCode) {
          return e;
        }
      }).name;
      this.$emit('setRegions', provinceName, 'province');
      if (name === '北京市' || name === '天津市' || name === '上海市' || name === '重庆市') {
        this.textToCode(name, 'city');
        this.bindTap('county');
        this.$emit('setRegions', name, 'city');
      } else {
        this.bindCity(name);
      }
    },
    // 选择省区
    bindProvince(name) {
      this.$emit('setRegions', name, 'province');
      this.textToCode(name, 'province');
      if (name === '北京' || name === '天津' || name === '上海' || name === '重庆') {
        this.textToCode(name, 'city');
        // this.bindCity(name + "市");
        this.bindTap('county');
        this.$emit('setRegions', name, 'city');
      } else {
        this.bindTap('city');
        this.textToCode(name, 'province');
      }
    },
    // 选择市区
    bindCity(name) {
      this.textToCode(name, 'city');
      this.bindTap('county');
      this.$emit('setRegions', name, 'city');
      this.$emit('setRegions', '', 'county');
    },
    // 选择县区
    bindCounty(name) {
      name = name === '暂不选择' ? '' : name;
      if (name) {
        let cityCode =
          this.county
            .find(e => {
              if (name === e.name) {
                return e;
              }
            })
            .number.substring(0, 4) + `00000000`;
        let cityName = areaList.city_list.find(e => {
          if (e.code === cityCode) {
            return e;
          }
        }).name;
        let provinceCode =
          areaList.city
            .find(e => {
              if (cityName === e.name) {
                return e;
              }
            })
            .code.substring(0, 2) + `0000000000`;
        let provinceName = areaList.province_list.find(e => {
          if (e.code === provinceCode) {
            return e;
          }
        }).name;
        this.$emit('setRegions', provinceName, 'province');
        this.$emit('setRegions', cityName, 'city');
      }
      this.$emit('setRegions', name, 'county');
      this.showTabBox();
    },
    textToCode(name, type) {
      if (type === 'province') {
        this.provinceCode = areaList.province_list.find(items => {
          return items.name.includes(name);
        }).code;
      } else if (type === 'city') {
        this.cityCode = areaList.city_list.find(items => {
          return items.name.includes(name);
        }).code;
      }
    }
    // 这是一个外文地址
    // changeENAdder () {
    //   this.$emit("changeENAdder")
    // },
  }
};
</script>
<style lang="less" scoped>
#address {
  position: relative;
}
.address-box {
  position: relative;
  // border: 1px solid #999;
  // margin-left: 90px;
  // padding-left: 5px;
  // height: 40px;
  // line-height: 40px;
  cursor: pointer;
  i {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 4px;
    top: 6px;
    color: #999;
    // float: right;
    margin-right: 10px;
  }
  // .el-input {
  //   width: 200px;
  //   pointer-events: none;
  // }
  .el-input /deep/ .el-input__inner {
    pointer-events: none;
    // border: none;
  }
}
.tab-wrap {
  position: absolute;
  top: 32x;
  // left: 90px;
  z-index: 10;
  width: 420px;
  .tab-list {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .tab:nth-of-type(1) {
      border-left: 1px solid #dcdfe6;
    }
    .tab {
      background-color: #f4f4f4;
      border-bottom: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
      flex-grow: 1;
      cursor: pointer;
      text-align: center;
      a {
        color: #000;
      }
    }
    .select {
      background-color: #fff;
      border-bottom-color: #fff;
      a {
        color: #317ee7;
      }
    }
  }
  .tab-box {
    background-color: #fff;
    border-left: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    padding: 10px;
    a {
      display: inline-block;
      padding: 2px 10px;
      white-space: nowrap;
      color: #666;
    }
    a:hover {
      background-color: #86b4f1;
      color: #fff;
    }
    .forEnglish {
      float: right;
      padding: 0;
      padding-right: 10px;
      color: #317ee7;
      cursor: pointer;
    }
  }
  .province-box {
    padding-left: 20px;
    dt {
      float: left;
    }
    dd {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      a {
        padding: 0 10px;
        width: 56px;
      }
    }
  }
  .city-box,
  .county-box {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
