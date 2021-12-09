["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/disposable/disposable.js"],"~:js","goog.provide(\"goog.Disposable\");\ngoog.require(\"goog.disposable.IDisposable\");\ngoog.require(\"goog.dispose\");\ngoog.require(\"goog.disposeAll\");\ngoog.Disposable = function() {\n  this.creationStack;\n  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {\n      this.creationStack = (new Error()).stack;\n    }\n    goog.Disposable.instances_[goog.getUid(this)] = this;\n  }\n  this.disposed_ = this.disposed_;\n  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;\n};\ngoog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};\ngoog.Disposable.MONITORING_MODE = goog.define(\"goog.Disposable.MONITORING_MODE\", 0);\ngoog.Disposable.INCLUDE_STACK_ON_CREATION = goog.define(\"goog.Disposable.INCLUDE_STACK_ON_CREATION\", true);\ngoog.Disposable.instances_ = {};\ngoog.Disposable.getUndisposedObjects = function() {\n  var ret = [];\n  for (var id in goog.Disposable.instances_) {\n    if (goog.Disposable.instances_.hasOwnProperty(id)) {\n      ret.push(goog.Disposable.instances_[Number(id)]);\n    }\n  }\n  return ret;\n};\ngoog.Disposable.clearUndisposedObjects = function() {\n  goog.Disposable.instances_ = {};\n};\ngoog.Disposable.prototype.disposed_ = false;\ngoog.Disposable.prototype.onDisposeCallbacks_;\ngoog.Disposable.prototype.isDisposed = function() {\n  return this.disposed_;\n};\ngoog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;\ngoog.Disposable.prototype.dispose = function() {\n  if (!this.disposed_) {\n    this.disposed_ = true;\n    this.disposeInternal();\n    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n      var uid = goog.getUid(this);\n      if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {\n        throw new Error(this + \" did not call the goog.Disposable base \" + \"constructor or was disposed of after a clearUndisposedObjects \" + \"call\");\n      }\n      if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {\n        throw new Error(this + \" did not empty its onDisposeCallbacks queue. This \" + \"probably means it overrode dispose() or disposeInternal() \" + \"without calling the superclass' method.\");\n      }\n      delete goog.Disposable.instances_[uid];\n    }\n  }\n};\ngoog.Disposable.prototype.registerDisposable = function(disposable) {\n  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));\n};\ngoog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {\n  if (this.disposed_) {\n    opt_scope !== undefined ? callback.call(opt_scope) : callback();\n    return;\n  }\n  if (!this.onDisposeCallbacks_) {\n    this.onDisposeCallbacks_ = [];\n  }\n  this.onDisposeCallbacks_.push(opt_scope !== undefined ? goog.bind(callback, opt_scope) : callback);\n};\ngoog.Disposable.prototype.disposeInternal = function() {\n  if (this.onDisposeCallbacks_) {\n    while (this.onDisposeCallbacks_.length) {\n      this.onDisposeCallbacks_.shift()();\n    }\n  }\n};\ngoog.Disposable.isDisposed = function(obj) {\n  if (obj && typeof obj.isDisposed == \"function\") {\n    return obj.isDisposed();\n  }\n  return false;\n};\n","~:source","/**\n * @license\n * Copyright The Closure Library Authors.\n * SPDX-License-Identifier: Apache-2.0\n */\n\n/**\n * @fileoverview Implements the disposable interface.\n */\n\ngoog.provide('goog.Disposable');\n\ngoog.require('goog.disposable.IDisposable');\ngoog.require('goog.dispose');\n/**\n * TODO(user): Remove this require.\n * @suppress {extraRequire}\n */\ngoog.require('goog.disposeAll');\n\n/**\n * Class that provides the basic implementation for disposable objects. If your\n * class holds references or resources that can't be collected by standard GC,\n * it should extend this class or implement the disposable interface (defined\n * in goog.disposable.IDisposable). See description of\n * goog.disposable.IDisposable for examples of cleanup.\n * @constructor\n * @implements {goog.disposable.IDisposable}\n */\ngoog.Disposable = function() {\n  'use strict';\n  /**\n   * If monitoring the goog.Disposable instances is enabled, stores the creation\n   * stack trace of the Disposable instance.\n   * @type {string|undefined}\n   */\n  this.creationStack;\n\n  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {\n      this.creationStack = new Error().stack;\n    }\n    goog.Disposable.instances_[goog.getUid(this)] = this;\n  }\n  // Support sealing\n  this.disposed_ = this.disposed_;\n  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;\n};\n\n\n/**\n * @enum {number} Different monitoring modes for Disposable.\n */\ngoog.Disposable.MonitoringMode = {\n  /**\n   * No monitoring.\n   */\n  OFF: 0,\n  /**\n   * Creating and disposing the goog.Disposable instances is monitored. All\n   * disposable objects need to call the `goog.Disposable` base\n   * constructor. The PERMANENT mode must be switched on before creating any\n   * goog.Disposable instances.\n   */\n  PERMANENT: 1,\n  /**\n   * INTERACTIVE mode can be switched on and off on the fly without producing\n   * errors. It also doesn't warn if the disposable objects don't call the\n   * `goog.Disposable` base constructor.\n   */\n  INTERACTIVE: 2\n};\n\n\n/**\n * @define {number} The monitoring mode of the goog.Disposable\n *     instances. Default is OFF. Switching on the monitoring is only\n *     recommended for debugging because it has a significant impact on\n *     performance and memory usage. If switched off, the monitoring code\n *     compiles down to 0 bytes.\n */\ngoog.Disposable.MONITORING_MODE =\n    goog.define('goog.Disposable.MONITORING_MODE', 0);\n\n\n/**\n * @define {boolean} Whether to attach creation stack to each created disposable\n *     instance; This is only relevant for when MonitoringMode != OFF.\n */\ngoog.Disposable.INCLUDE_STACK_ON_CREATION =\n    goog.define('goog.Disposable.INCLUDE_STACK_ON_CREATION', true);\n\n\n/**\n * Maps the unique ID of every undisposed `goog.Disposable` object to\n * the object itself.\n * @type {!Object<number, !goog.Disposable>}\n * @private\n */\ngoog.Disposable.instances_ = {};\n\n\n/**\n * @return {!Array<!goog.Disposable>} All `goog.Disposable` objects that\n *     haven't been disposed of.\n */\ngoog.Disposable.getUndisposedObjects = function() {\n  'use strict';\n  var ret = [];\n  for (var id in goog.Disposable.instances_) {\n    if (goog.Disposable.instances_.hasOwnProperty(id)) {\n      ret.push(goog.Disposable.instances_[Number(id)]);\n    }\n  }\n  return ret;\n};\n\n\n/**\n * Clears the registry of undisposed objects but doesn't dispose of them.\n */\ngoog.Disposable.clearUndisposedObjects = function() {\n  'use strict';\n  goog.Disposable.instances_ = {};\n};\n\n\n/**\n * Whether the object has been disposed of.\n * @type {boolean}\n * @private\n */\ngoog.Disposable.prototype.disposed_ = false;\n\n\n/**\n * Callbacks to invoke when this object is disposed.\n * @type {Array<!Function>}\n * @private\n */\ngoog.Disposable.prototype.onDisposeCallbacks_;\n\n\n/**\n * @return {boolean} Whether the object has been disposed of.\n * @override\n */\ngoog.Disposable.prototype.isDisposed = function() {\n  'use strict';\n  return this.disposed_;\n};\n\n\n/**\n * @return {boolean} Whether the object has been disposed of.\n * @deprecated Use {@link #isDisposed} instead.\n */\ngoog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;\n\n\n/**\n * Disposes of the object. If the object hasn't already been disposed of, calls\n * {@link #disposeInternal}. Classes that extend `goog.Disposable` should\n * override {@link #disposeInternal} in order to cleanup references, resources\n * and other disposable objects. Reentrant.\n *\n * @return {void} Nothing.\n * @override\n */\ngoog.Disposable.prototype.dispose = function() {\n  'use strict';\n  if (!this.disposed_) {\n    // Set disposed_ to true first, in case during the chain of disposal this\n    // gets disposed recursively.\n    this.disposed_ = true;\n    this.disposeInternal();\n    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n      var uid = goog.getUid(this);\n      if (goog.Disposable.MONITORING_MODE ==\n              goog.Disposable.MonitoringMode.PERMANENT &&\n          !goog.Disposable.instances_.hasOwnProperty(uid)) {\n        throw new Error(\n            this + ' did not call the goog.Disposable base ' +\n            'constructor or was disposed of after a clearUndisposedObjects ' +\n            'call');\n      }\n      if (goog.Disposable.MONITORING_MODE !=\n              goog.Disposable.MonitoringMode.OFF &&\n          this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {\n        throw new Error(\n            this + ' did not empty its onDisposeCallbacks queue. This ' +\n            'probably means it overrode dispose() or disposeInternal() ' +\n            'without calling the superclass\\' method.');\n      }\n      delete goog.Disposable.instances_[uid];\n    }\n  }\n};\n\n\n/**\n * Associates a disposable object with this object so that they will be disposed\n * together.\n * @param {goog.disposable.IDisposable} disposable that will be disposed when\n *     this object is disposed.\n */\ngoog.Disposable.prototype.registerDisposable = function(disposable) {\n  'use strict';\n  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));\n};\n\n\n/**\n * Invokes a callback function when this object is disposed. Callbacks are\n * invoked in the order in which they were added. If a callback is added to\n * an already disposed Disposable, it will be called immediately.\n * @param {function(this:T):?} callback The callback function.\n * @param {T=} opt_scope An optional scope to call the callback in.\n * @template T\n */\ngoog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {\n  'use strict';\n  if (this.disposed_) {\n    opt_scope !== undefined ? callback.call(opt_scope) : callback();\n    return;\n  }\n  if (!this.onDisposeCallbacks_) {\n    this.onDisposeCallbacks_ = [];\n  }\n\n  this.onDisposeCallbacks_.push(\n      opt_scope !== undefined ? goog.bind(callback, opt_scope) : callback);\n};\n\n\n/**\n * Performs appropriate cleanup. See description of goog.disposable.IDisposable\n * for examples. Classes that extend `goog.Disposable` should override this\n * method. Not reentrant. To avoid calling it twice, it must only be called from\n * the subclass' `disposeInternal` method. Everywhere else the public `dispose`\n * method must be used. For example:\n *\n * <pre>\n * mypackage.MyClass = function() {\n * mypackage.MyClass.base(this, 'constructor');\n *     // Constructor logic specific to MyClass.\n *     ...\n *   };\n *   goog.inherits(mypackage.MyClass, goog.Disposable);\n *\n *   mypackage.MyClass.prototype.disposeInternal = function() {\n *     // Dispose logic specific to MyClass.\n *     ...\n *     // Call superclass's disposeInternal at the end of the subclass's, like\n *     // in C++, to avoid hard-to-catch issues.\n *     mypackage.MyClass.base(this, 'disposeInternal');\n *   };\n * </pre>\n *\n * @protected\n */\ngoog.Disposable.prototype.disposeInternal = function() {\n  'use strict';\n  if (this.onDisposeCallbacks_) {\n    while (this.onDisposeCallbacks_.length) {\n      this.onDisposeCallbacks_.shift()();\n    }\n  }\n};\n\n\n/**\n * Returns True if we can verify the object is disposed.\n * Calls `isDisposed` on the argument if it supports it.  If obj\n * is not an object with an isDisposed() method, return false.\n * @param {*} obj The object to investigate.\n * @return {boolean} True if we can verify the object is disposed.\n */\ngoog.Disposable.isDisposed = function(obj) {\n  'use strict';\n  if (obj && typeof obj.isDisposed == 'function') {\n    return obj.isDisposed();\n  }\n  return false;\n};\n","~:compiled-at",1639015692316,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.disposable.disposable.js\",\n\"lineCount\":80,\n\"mappings\":\"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\",\n\"sources\":[\"goog/disposable/disposable.js\"],\n\"sourcesContent\":[\"/**\\n * @license\\n * Copyright The Closure Library Authors.\\n * SPDX-License-Identifier: Apache-2.0\\n */\\n\\n/**\\n * @fileoverview Implements the disposable interface.\\n */\\n\\ngoog.provide('goog.Disposable');\\n\\ngoog.require('goog.disposable.IDisposable');\\ngoog.require('goog.dispose');\\n/**\\n * TODO(user): Remove this require.\\n * @suppress {extraRequire}\\n */\\ngoog.require('goog.disposeAll');\\n\\n/**\\n * Class that provides the basic implementation for disposable objects. If your\\n * class holds references or resources that can't be collected by standard GC,\\n * it should extend this class or implement the disposable interface (defined\\n * in goog.disposable.IDisposable). See description of\\n * goog.disposable.IDisposable for examples of cleanup.\\n * @constructor\\n * @implements {goog.disposable.IDisposable}\\n */\\ngoog.Disposable = function() {\\n  'use strict';\\n  /**\\n   * If monitoring the goog.Disposable instances is enabled, stores the creation\\n   * stack trace of the Disposable instance.\\n   * @type {string|undefined}\\n   */\\n  this.creationStack;\\n\\n  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\\n    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {\\n      this.creationStack = new Error().stack;\\n    }\\n    goog.Disposable.instances_[goog.getUid(this)] = this;\\n  }\\n  // Support sealing\\n  this.disposed_ = this.disposed_;\\n  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;\\n};\\n\\n\\n/**\\n * @enum {number} Different monitoring modes for Disposable.\\n */\\ngoog.Disposable.MonitoringMode = {\\n  /**\\n   * No monitoring.\\n   */\\n  OFF: 0,\\n  /**\\n   * Creating and disposing the goog.Disposable instances is monitored. All\\n   * disposable objects need to call the `goog.Disposable` base\\n   * constructor. The PERMANENT mode must be switched on before creating any\\n   * goog.Disposable instances.\\n   */\\n  PERMANENT: 1,\\n  /**\\n   * INTERACTIVE mode can be switched on and off on the fly without producing\\n   * errors. It also doesn't warn if the disposable objects don't call the\\n   * `goog.Disposable` base constructor.\\n   */\\n  INTERACTIVE: 2\\n};\\n\\n\\n/**\\n * @define {number} The monitoring mode of the goog.Disposable\\n *     instances. Default is OFF. Switching on the monitoring is only\\n *     recommended for debugging because it has a significant impact on\\n *     performance and memory usage. If switched off, the monitoring code\\n *     compiles down to 0 bytes.\\n */\\ngoog.Disposable.MONITORING_MODE =\\n    goog.define('goog.Disposable.MONITORING_MODE', 0);\\n\\n\\n/**\\n * @define {boolean} Whether to attach creation stack to each created disposable\\n *     instance; This is only relevant for when MonitoringMode != OFF.\\n */\\ngoog.Disposable.INCLUDE_STACK_ON_CREATION =\\n    goog.define('goog.Disposable.INCLUDE_STACK_ON_CREATION', true);\\n\\n\\n/**\\n * Maps the unique ID of every undisposed `goog.Disposable` object to\\n * the object itself.\\n * @type {!Object<number, !goog.Disposable>}\\n * @private\\n */\\ngoog.Disposable.instances_ = {};\\n\\n\\n/**\\n * @return {!Array<!goog.Disposable>} All `goog.Disposable` objects that\\n *     haven't been disposed of.\\n */\\ngoog.Disposable.getUndisposedObjects = function() {\\n  'use strict';\\n  var ret = [];\\n  for (var id in goog.Disposable.instances_) {\\n    if (goog.Disposable.instances_.hasOwnProperty(id)) {\\n      ret.push(goog.Disposable.instances_[Number(id)]);\\n    }\\n  }\\n  return ret;\\n};\\n\\n\\n/**\\n * Clears the registry of undisposed objects but doesn't dispose of them.\\n */\\ngoog.Disposable.clearUndisposedObjects = function() {\\n  'use strict';\\n  goog.Disposable.instances_ = {};\\n};\\n\\n\\n/**\\n * Whether the object has been disposed of.\\n * @type {boolean}\\n * @private\\n */\\ngoog.Disposable.prototype.disposed_ = false;\\n\\n\\n/**\\n * Callbacks to invoke when this object is disposed.\\n * @type {Array<!Function>}\\n * @private\\n */\\ngoog.Disposable.prototype.onDisposeCallbacks_;\\n\\n\\n/**\\n * @return {boolean} Whether the object has been disposed of.\\n * @override\\n */\\ngoog.Disposable.prototype.isDisposed = function() {\\n  'use strict';\\n  return this.disposed_;\\n};\\n\\n\\n/**\\n * @return {boolean} Whether the object has been disposed of.\\n * @deprecated Use {@link #isDisposed} instead.\\n */\\ngoog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;\\n\\n\\n/**\\n * Disposes of the object. If the object hasn't already been disposed of, calls\\n * {@link #disposeInternal}. Classes that extend `goog.Disposable` should\\n * override {@link #disposeInternal} in order to cleanup references, resources\\n * and other disposable objects. Reentrant.\\n *\\n * @return {void} Nothing.\\n * @override\\n */\\ngoog.Disposable.prototype.dispose = function() {\\n  'use strict';\\n  if (!this.disposed_) {\\n    // Set disposed_ to true first, in case during the chain of disposal this\\n    // gets disposed recursively.\\n    this.disposed_ = true;\\n    this.disposeInternal();\\n    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\\n      var uid = goog.getUid(this);\\n      if (goog.Disposable.MONITORING_MODE ==\\n              goog.Disposable.MonitoringMode.PERMANENT &&\\n          !goog.Disposable.instances_.hasOwnProperty(uid)) {\\n        throw new Error(\\n            this + ' did not call the goog.Disposable base ' +\\n            'constructor or was disposed of after a clearUndisposedObjects ' +\\n            'call');\\n      }\\n      if (goog.Disposable.MONITORING_MODE !=\\n              goog.Disposable.MonitoringMode.OFF &&\\n          this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {\\n        throw new Error(\\n            this + ' did not empty its onDisposeCallbacks queue. This ' +\\n            'probably means it overrode dispose() or disposeInternal() ' +\\n            'without calling the superclass\\\\' method.');\\n      }\\n      delete goog.Disposable.instances_[uid];\\n    }\\n  }\\n};\\n\\n\\n/**\\n * Associates a disposable object with this object so that they will be disposed\\n * together.\\n * @param {goog.disposable.IDisposable} disposable that will be disposed when\\n *     this object is disposed.\\n */\\ngoog.Disposable.prototype.registerDisposable = function(disposable) {\\n  'use strict';\\n  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));\\n};\\n\\n\\n/**\\n * Invokes a callback function when this object is disposed. Callbacks are\\n * invoked in the order in which they were added. If a callback is added to\\n * an already disposed Disposable, it will be called immediately.\\n * @param {function(this:T):?} callback The callback function.\\n * @param {T=} opt_scope An optional scope to call the callback in.\\n * @template T\\n */\\ngoog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {\\n  'use strict';\\n  if (this.disposed_) {\\n    opt_scope !== undefined ? callback.call(opt_scope) : callback();\\n    return;\\n  }\\n  if (!this.onDisposeCallbacks_) {\\n    this.onDisposeCallbacks_ = [];\\n  }\\n\\n  this.onDisposeCallbacks_.push(\\n      opt_scope !== undefined ? goog.bind(callback, opt_scope) : callback);\\n};\\n\\n\\n/**\\n * Performs appropriate cleanup. See description of goog.disposable.IDisposable\\n * for examples. Classes that extend `goog.Disposable` should override this\\n * method. Not reentrant. To avoid calling it twice, it must only be called from\\n * the subclass' `disposeInternal` method. Everywhere else the public `dispose`\\n * method must be used. For example:\\n *\\n * <pre>\\n * mypackage.MyClass = function() {\\n * mypackage.MyClass.base(this, 'constructor');\\n *     // Constructor logic specific to MyClass.\\n *     ...\\n *   };\\n *   goog.inherits(mypackage.MyClass, goog.Disposable);\\n *\\n *   mypackage.MyClass.prototype.disposeInternal = function() {\\n *     // Dispose logic specific to MyClass.\\n *     ...\\n *     // Call superclass's disposeInternal at the end of the subclass's, like\\n *     // in C++, to avoid hard-to-catch issues.\\n *     mypackage.MyClass.base(this, 'disposeInternal');\\n *   };\\n * </pre>\\n *\\n * @protected\\n */\\ngoog.Disposable.prototype.disposeInternal = function() {\\n  'use strict';\\n  if (this.onDisposeCallbacks_) {\\n    while (this.onDisposeCallbacks_.length) {\\n      this.onDisposeCallbacks_.shift()();\\n    }\\n  }\\n};\\n\\n\\n/**\\n * Returns True if we can verify the object is disposed.\\n * Calls `isDisposed` on the argument if it supports it.  If obj\\n * is not an object with an isDisposed() method, return false.\\n * @param {*} obj The object to investigate.\\n * @return {boolean} True if we can verify the object is disposed.\\n */\\ngoog.Disposable.isDisposed = function(obj) {\\n  'use strict';\\n  if (obj && typeof obj.isDisposed == 'function') {\\n    return obj.isDisposed();\\n  }\\n  return false;\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"Disposable\",\"goog.Disposable\",\"creationStack\",\"MONITORING_MODE\",\"MonitoringMode\",\"OFF\",\"INCLUDE_STACK_ON_CREATION\",\"stack\",\"Error\",\"instances_\",\"getUid\",\"disposed_\",\"onDisposeCallbacks_\",\"PERMANENT\",\"INTERACTIVE\",\"define\",\"getUndisposedObjects\",\"goog.Disposable.getUndisposedObjects\",\"ret\",\"id\",\"hasOwnProperty\",\"push\",\"Number\",\"clearUndisposedObjects\",\"goog.Disposable.clearUndisposedObjects\",\"prototype\",\"isDisposed\",\"goog.Disposable.prototype.isDisposed\",\"getDisposed\",\"dispose\",\"goog.Disposable.prototype.dispose\",\"disposeInternal\",\"uid\",\"length\",\"registerDisposable\",\"goog.Disposable.prototype.registerDisposable\",\"disposable\",\"addOnDisposeCallback\",\"partial\",\"goog.Disposable.prototype.addOnDisposeCallback\",\"callback\",\"opt_scope\",\"undefined\",\"call\",\"bind\",\"goog.Disposable.prototype.disposeInternal\",\"shift\",\"goog.Disposable.isDisposed\",\"obj\"]\n}\n"]