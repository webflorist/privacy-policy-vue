import { openBlock, createElementBlock, createElementVNode, toDisplayString, Fragment, createTextVNode, createCommentVNode } from 'vue';

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
const _hoisted_3 = /*#__PURE__*/createTextVNode(") ");
const _hoisted_4 = ["innerHTML"];
const _hoisted_5 = ["innerHTML"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("section", null, [
    createElementVNode("h4", null, toDisplayString($props.cookie.name), 1 /* TEXT */),
    createElementVNode("dl", null, [
      createElementVNode("dt", null, toDisplayString($props.t('cookies.purpose.title')), 1 /* TEXT */),
      createElementVNode("dd", {
        innerHTML: $props.t('cookies.purpose.' + $props.cookie.purpose)
      }, null, 8 /* PROPS */, _hoisted_1),
      ($props.type === 'third_party')
        ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createElementVNode("dt", null, toDisplayString($props.t('cookies.origin')), 1 /* TEXT */),
            createElementVNode("dd", null, [
              createTextVNode(toDisplayString($props.cookie.service) + " (", 1 /* TEXT */),
              createElementVNode("a", {
                href: '#processor-' + $props.cookie.processor
              }, toDisplayString($props.processors[$props.cookie.processor].name), 9 /* TEXT, PROPS */, _hoisted_2),
              _hoisted_3
            ])
          ], 64 /* STABLE_FRAGMENT */))
        : createCommentVNode("v-if", true),
      createElementVNode("dt", null, toDisplayString($props.t('cookies.written_on.title')), 1 /* TEXT */),
      createElementVNode("dd", {
        innerHTML: $props.t('cookies.written_on.' + $props.cookie.written_on)
      }, null, 8 /* PROPS */, _hoisted_4),
      createElementVNode("dt", null, toDisplayString($props.t('cookies.duration.title')), 1 /* TEXT */),
      createElementVNode("dd", {
        innerHTML: $props.t('cookies.duration.' + $props.cookie.duration)
      }, null, 8 /* PROPS */, _hoisted_5)
    ])
  ]))
}

script.render = render;
script.__file = "src/components/CookieDetails.vue";

export { script as default };
