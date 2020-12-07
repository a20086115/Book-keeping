import { VantComponent } from '../common/component';
VantComponent({
    relation: {
        name: 'tabs',
        type: 'ancestor',
        linked(target) {
          console.log(target, "_____________________linked")
            this.parent = target;
        },
        linkChanged: function (target) {
          // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
          console.log(target, "_____________________move")
        },
        unlinked() {
            this.parent = null;
        }
    },
    props: {
        dot: Boolean,
        info: null,
        title: String,
        disabled: Boolean,
        titleStyle: String,
        name: {
            type: [Number, String],
            value: '',
        }
    },
    data: {
        active: false
    },
    watch: {
        title: 'update',
        disabled: 'update',
        dot: 'update',
        info: 'update',
        titleStyle: 'update'
    },
    methods: {
        getComputedName() {
            if (this.data.name !== '') {
                return this.data.name;
            }
            return this.index;
        },
        updateRender(active, parent) {
            const { data: parentData } = parent;
            this.inited = this.inited || active;
            this.setData({
                active,
                shouldRender: this.inited || !parentData.lazyRender,
                shouldShow: active || parentData.animated
            });
        },
        update() {
            if (this.parent) {
                this.parent.updateTabs();
            }
        }
    }
});
