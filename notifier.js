
/**************************************** js localization 1.0 *******************************************
 *													*
 * @class notification.											*
 * handles all desktop notifications.									*
 * @constructor notification(<code>{options}<code>)<bre>merges the object of options of the notification* 
 * contains:												*
 *  <p>HTMLNotificationURL:</p> not necessary if it's used to fire webkit notification,			*
 *  <p>defaultIcon:</p> the icon that is set to the notification in case no icon sent in 		*
 *  <code>fireNotification</code> method,								*
 *  <p>checkTimeperiod:</p> the periodic time in seconds the notification seeks for items to notify for,*
 *  default is 60 seconds.										*
 *  <p>notifySeeker:</p> the function which is to search for items for the notification.		*
 *  <p>localStorageObject:</p> localStorage object name, which default <code> notifySeeker </code> 	*
 *  search 												*
 *  for to fire notifications,										*
 *  this object must have these attributes: type, title, msg, icon, link, closeTime			*
 *  </bre>												*
 *  @namespace JQuery 1.4										*
 *  													*
 *  													*
 *  													*
 *  													*
 *  													*
 *                                     Copyright Gamal Shaban 2010.                      		*
 *                                          gemy21ce@gmail.com                                  	*
 * 													*
 *  													*
 ********************************************************************************************************/

var notification=function(options){
    var notifier=null;
    notifier={
        /**
         * the default options that would be set in the constructor.
         */
        options:{
            HTMLNotificationURL:'notification.html',
            defaultIcon:'',
            checkTimeperiod:60,
            localStorageObject:'notificationObject',
            autoDelete:true,
            notifySeeker:function(){
                if(window.localStorage[this.localStorageObject]){
                    var ob=JSON.parse(window.localStorage[this.localStorageObject]);
                    notifier.fireNotificationFromObject(ob);
                    if(this.autoDelete == true){
                        delete window.localStorage[this.localStorageObject];
                    }
                }
            }
        },
        webkitNotification:null,
        HTMLNotification:null,
        notificationTypes:{
            webkit:'webkit',
            html:'html'
        },
        /**
         * fires notification.
         * @description based on notification type fires the notification and closes it,
         * @param type: object of notifier.notificationTypes string <b>'webkit'</b> or <b>'html'</b>
         * @param title : title of the notification
         * @param msg : message body.
         * @param icon : icon url, if not included or null sends, it uses <code>options.defaultIcon</code>.
         * @param link : clickable link, works only in html notifications.
         * @param closeTime : time in seconds notification wait to close.
         */
        fireNotification:function(type,title,msg,icon,link,closeTime){
            switch (type){
                case notifier.notificationTypes.webkit:{
                    notifier.webkitNotification=webkitNotifications.createNotification(
                        (icon?icon:notifier.options.defaultIcon),  // icon url - can be relative
                        (title?title:''),  // notification title
                        (msg?msg:'') // notification body text
                        );
                    notifier.webkitNotification.show();
                    if(closeTime != null && closeTime !== 0){
                        window.setTimeout("notifier.webkitNotification.cancel();", closeTime * 1000);
                    }
                    break;
                }
                //construct the request for the html notification type. 
                case notifier.notificationTypes.html:{
                    var htmlPath=notifier.options.HTMLNotificationURL
                    +'?title='+encodeURIComponent(title?title:'')
                    +'&icon='+encodeURIComponent(icon?icon:notifier.options.defaultIcon)
                    +'&msg='+encodeURIComponent(msg?msg:'')
                    +'&link='+encodeURIComponent(link?link:'')
                    +'&closeafter='+encodeURIComponent(closeTime?closeTime:'0');
                    notifier.HTMLNotification = webkitNotifications.createHTMLNotification(htmlPath);
                    notifier.HTMLNotification.show();
                    break;
                }
            }
        },
        /**
         * get argument of the notification as object with parameter: type,title,msg,icon,link,closeTime
         * @see fireNotificationFromObject (type,title,msg,icon,link,closeTime)
         */
        fireNotificationFromObject:function(notificationObject){
            return this.fireNotification(notificationObject.type, notificationObject.title, notificationObject.msg, notificationObject.icon, notificationObject.link, notificationObject.closeTime);
        },
        /**
         * call it if you want the object to auto search and fire the notification
         */
        autoFire:function(){
            window.setInterval("notifier.options.notifySeeker()", notifier.options.checkTimeperiod * 1000);
        }
    };
    notifier.options=util.extend(notifier.options,options);
    return notifier;
};


/**
 * From JQuery 1.4.4
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
util.extend=function(){
    var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};


 //instantiate an object of the class with option constructor to set the your options.
var notifier=new notification({
    checkTimeperiod:'10',
    autoDelete:true,
    localStorageObject:'notob'
});
//this will set the localstorage element which be fired in the notification.
/*window.localStorage.notob=JSON.stringify({
    type:'webkit',
    title:'title',
    msg:'msg',
    closeTime:5
});*/

// to autofire the notification. otherwise you can use the fire method to fire notifications whenever you want.
/*notifier.autoFire();*/
