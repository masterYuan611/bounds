/**
 *  基于vue内置组件keep-alive进行微幅修改,适配详情页面的动态缓存
 *  通过组件key来判断缓存、销毁,被缓存组件的key为$route.fullPath
 *  keep-alive源码请参考https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js
 */

const _toString = Object.prototype.toString

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

function isDef(v) {
  return v !== undefined && v !== null
}

function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory
}

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i]
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

/*
function pruneCache(keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache
  var keys = keepAliveInstance.keys
  var _vnode = keepAliveInstance._vnode
  for (var key in cache) {
    var entry = cache[key]
    if (entry) {
      var name = entry.name
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
*/

// 修改点1：通过key来判断是否销毁已缓存的组件
function pruneCache(keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache
  var keys = keepAliveInstance.keys
  var _vnode = keepAliveInstance._vnode
  for (var key in cache) {
    var entry = cache[key]
    if (entry) {
      if (key && !filter(key)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

function pruneCacheEntry(cache, key, keys, current) {
  var entry = cache[key]
  if (entry && (!current || entry.tag !== current.tag)) {
    entry.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

var patternTypes = [String, RegExp, Array]

export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  methods: {
    cacheVNode: function cacheVNode() {
      var ref = this
      var cache = ref.cache
      var keys = ref.keys
      var vnodeToCache = ref.vnodeToCache
      var keyToCache = ref.keyToCache
      if (vnodeToCache) {
        var tag = vnodeToCache.tag
        var componentInstance = vnodeToCache.componentInstance
        var componentOptions = vnodeToCache.componentOptions
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag: tag,
          componentInstance: componentInstance
        }
        keys.push(keyToCache)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        this.vnodeToCache = null
      }
    }
  },

  created: function created() {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed: function destroyed() {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted: function mounted() {
    var this$1 = this

    this.cacheVNode()
    this.$watch('include', function(val) {
      pruneCache(this$1, function(name) {
        return matches(val, name)
      })
    })
    this.$watch('exclude', function(val) {
      pruneCache(this$1, function(name) {
        return !matches(val, name)
      })
    })
  },

  updated: function updated() {
    this.cacheVNode()
  },

  render: function render() {
    var slot = this.$slots.default
    var vnode = getFirstComponentChild(slot)
    var componentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern

      // 修改点2：通过key来判断组件是否进行缓存
      /*
      var name = getComponentName(componentOptions)
      */
      var key =
        vnode.key == null
          ? componentOptions.Ctor.cid +
            (componentOptions.tag ? '::' + componentOptions.tag : '')
          : vnode.key // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      var ref = this
      var include = ref.include
      var exclude = ref.exclude
      /*
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      */
      if (
        // not included
        (include && (!key || !matches(include, key))) ||
        // excluded
        (exclude && key && matches(exclude, key))
      ) {
        return vnode
      }

      var ref$1 = this
      var cache = ref$1.cache
      var keys = ref$1.keys
      /*
      var key = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
      : vnode.key;
      */
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        // delay setting the cache until update
        this.vnodeToCache = vnode
        this.keyToCache = key
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
