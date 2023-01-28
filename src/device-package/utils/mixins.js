export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName, params])
      }
    },
    broadcast(componentName, eventName, params) {
      let children = this.$children
      // console.log('children',children);
      // children.forEach(child=>{
      //   let name = child.$options.name
      //   while (child && (!name || name !== componentName)) {
      //     children = child.$children
      //     if (parent) {
      //       name = parent.$options.name
      //     }
      //   }
      //   if (parent) {
      //     parent.$emit.apply(parent, [eventName, params])
      //   }
      // })
    },
  },
}
