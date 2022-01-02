'use strict';

var vue = require('vue');

var script = {
	name: 'CookieDetails',
	props: {
		cookie: {
			type: Object,
			required: true,
		},
		processors: {
			type: Object,
			required: true,
		},
		type: {
			type: String, // first_party | third_party
			required: true,
		},
		t: {
			type: [Function],
			required: true,
		},
	},
};

const _hoisted_1 = ["innerHTML"];
const _hoisted_2 = ["href"];
const _hoisted_3 = /*#__PURE__*/vue.createTextVNode(") ");
const _hoisted_4 = ["innerHTML"];
const _hoisted_5 = ["innerHTML"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createElementBlock("section", null, [
    vue.createElementVNode("h4", null, vue.toDisplayString($props.cookie.name), 1 /* TEXT */),
    vue.createElementVNode("dl", null, [
      vue.createElementVNode("dt", null, vue.toDisplayString($props.t('cookies.purpose.title')), 1 /* TEXT */),
      vue.createElementVNode("dd", {
        innerHTML: $props.t('cookies.purpose.' + $props.cookie.purpose)
      }, null, 8 /* PROPS */, _hoisted_1),
      ($props.type === 'third_party')
        ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createElementVNode("dt", null, vue.toDisplayString($props.t('cookies.origin')), 1 /* TEXT */),
            vue.createElementVNode("dd", null, [
              vue.createTextVNode(vue.toDisplayString($props.cookie.service) + " (", 1 /* TEXT */),
              vue.createElementVNode("a", {
                href: '#processor-' + $props.cookie.processor
              }, vue.toDisplayString($props.processors[$props.cookie.processor].name), 9 /* TEXT, PROPS */, _hoisted_2),
              _hoisted_3
            ])
          ], 64 /* STABLE_FRAGMENT */))
        : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("dt", null, vue.toDisplayString($props.t('cookies.written_on.title')), 1 /* TEXT */),
      vue.createElementVNode("dd", {
        innerHTML: $props.t('cookies.written_on.' + $props.cookie.written_on)
      }, null, 8 /* PROPS */, _hoisted_4),
      vue.createElementVNode("dt", null, vue.toDisplayString($props.t('cookies.duration.title')), 1 /* TEXT */),
      vue.createElementVNode("dd", {
        innerHTML: $props.t('cookies.duration.' + $props.cookie.duration)
      }, null, 8 /* PROPS */, _hoisted_5)
    ])
  ]))
}

script.render = render;
script.__file = "src/components/CookieDetails.vue";

module.exports = script;
