/**
 * User: zhoufei
 * Date: 13-5-23
 * Time: 上午11:30
 * Class: 事件分发类
 */
(function(window){

    /**
     * Constructor.
     * @name EventDispatcher
     * @class EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
     */
    var EventDispatcher =  function()
    {
        //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
        this._eventMap = {};
    };

    /**
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    EventDispatcher.prototype.addEventListener = function(type, listener)
    {
        var map = this._eventMap[type];
        if(map == null) map = this._eventMap[type] = [];

        if(map.indexOf(listener) == -1)
        {
            map.push(listener);
            return true;
        }
        return false;
    };

    /**
     * 删除事件侦听器。
     */
    EventDispatcher.prototype.removeEventListener = function(type, listener)
    {
        var map = this._eventMap[type];
        if(map == null) return false;

        for(var i = 0; i < map.length; i++)
        {
            var li = map[i];
            if(li == listener)
            {
                map.splice(i, 1);
                //如果只有一个监听函数，直接删除这类监听事件
                if(map.length == 0) delete this._eventMap[type];
                return true;
            }
        }
        return false;
    };

    /**
     * 删除指定类型的所有事件侦听器。
     */
    EventDispatcher.prototype.removeEventListenerByType = function(type)
    {
        var map = this._eventMap[type];
        if(map != null)
        {
            delete this._eventMap[type];
            return true;
        }
        return false;
    };

    /**
     * 删除所有事件侦听器。
     */
    EventDispatcher.prototype.removeAllEventListeners = function()
    {
        this._eventMap = {};
    };

    /**
     * 派发事件，调用事件侦听器
     *  dispatchEvent({type:app.view.building.BankView.LEVEL_UP, target:this, data:this.buildData});
     */
    EventDispatcher.prototype.dispatchEvent = function(event)
    {
        var map = this._eventMap[event.type];
        if(map == null) return false;
        if(!event.target) event.target = this;
        map = map.slice();

        for(var i = 0; i < map.length; i++)
        {
            var listener = map[i];
            if(typeof(listener) == "function")
            {
                listener.call(this, event);
            }else if(listener.handleEvent){
                listener.handleEvent.call(listener, event);
            }
        }
        return true;
    };

    /**
     * 检查是否为指定事件类型注册了任何侦听器。
     */
    EventDispatcher.prototype.hasEventListener = function(type)
    {
        var map = this._eventMap[type];
        return map != null && map.length > 0;
    };

    window.EventDispatcher = EventDispatcher;
})(window);
