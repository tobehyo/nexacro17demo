// Data.js
_pTransactionItem._start_time = null;

_pTransactionItem.on_start = function ()
{
    if (this._usewaitcursor)
    {
        this._showWaitCursor(this.context);
    }
    this._start_time = new Date();
    nexacro._appendCommContext(this.context);
    var application = nexacro.getApplication();
    if (application)
    {
        application.on_fire_oncommunication(application, 0);
    }

};

_pTransactionItem.on_load_data = function (data, cookie, last_modified)
{
    var datasets = null;
    var parameters = null;
    var errorinfo;
    var bcache = this.bcache;
    var ret = null;
    var endtime = new Date();
    var elapsedtime = nexacro.round((endtime - this._start_time) / 1000, 3);

    this._addCookieToCookieVariable(cookie);

    if (data && data._type_name == "DataCache")
    {
        bcache = false;
        errorinfo = data._loadData(this);
    }
    else
    {
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        //if (this._progress_data && this._has_firstrow_dataset)
        if (this._progress_data)
        {
            this.on_progress_data(data, true);
            errorinfo = this._progress_data._error_info;

            if (bcache)
            {
                var target_ds = null;

                datasets = new nexacro.Collection();
                for (var buff_ds in this._progress_data._datasets)
                {
                    if (this._progress_data._datasets[buff_ds]._isEnable)
                    {
                        target_ds = this._progress_data._datasets[buff_ds]._target_ds;
                        datasets.add_item(target_ds.id, new nexacro._DataSetCache(target_ds.id, target_ds.colinfos, target_ds._constVars, target_ds._rawRecords));
                    }
                }

                this._progress_data._datasets = null;

                parameters = this._progress_data._parameters;
            }
        }
        else
        {
            ret = this._deserializeData(data, 0);
            if (bcache)
            {
                parameters = ret[1];
                datasets = ret[2];
            }

            errorinfo = ret[0];
        }
    }

    if (bcache)
    {
        var d_cache = nexacro._DataCacheList[this.path];
        if (!d_cache)
        {
            nexacro._DataCacheList[this.path] = new nexacro._DataCache(parameters, datasets, last_modified, this.version);
        }
        else
        {
            d_cache.parameters = parameters;
            d_cache.datasets = datasets;
            d_cache.last_modified = last_modified ? last_modified : "";
            d_cache.version = this.version;
        }
        d_cache = null;
    }

    parameters = null;
    datasets = null;
    data = null;
    ret = null;

    var errorcode = 0;
    var errormsg = "SUCCESS";
    if (errorinfo)
    {
        errorcode = errorinfo[0];
        errormsg = errorinfo[1];
        errorinfo = null;
    }

    if (this._usewaitcursor)
    {
        this._hideWaitCursor(this.context);
    }

    nexacro._removeCommContext(this.context);

    var application = nexacro.getApplication();
    if (application)
    {
        application.on_fire_oncommunication(application, 1);
    }

    var callbackList = this.callbackList;
    var n = callbackList.length;
    if (n > 0)
    {
        var loadmanager = this.context._load_manager;
        var dataitem = loadmanager ? loadmanager.getDataItem(this.svcid) : null;
        if (dataitem)
            dataitem._is_cancel = undefined;

        dataitem = null;
        loadmanager = null;

        for (var i = 0; i < n; i++)
        {
            var item = callbackList[i];
            var target = item.target;
            if (target._is_alive != false)
            {
                item.callback.call(target, this.svcid, errorcode, errormsg, elapsedtime);
            }
            target = null;
            item = null;
        }
        callbackList.splice(0, n);
    }
    this.handle = null;
};

// Platform.js
__pLoadManager.on_load_datamodule = function (svcid, errstatus, message, elapsedtime, fireerrorcode, returncode, requesturi, locationuri, extramsg)
{
    var load_Item = this.getDataItem(svcid);
    if (load_Item)
    {
        var callback_id = load_Item._context_callback;
        var callback_func = this.context[callback_id];

        var ret = false;
        if (errstatus < 0 && fireerrorcode)
        {
            load_Item.errcode = errstatus;
            if (fireerrorcode != "comm_cancel_byuser" || fireerrorcode != "comm_stop_transaction_byesc" ||
                load_Item._is_cancel || !load_Item.handle || (load_Item.handle && !load_Item.handle._user_aborted && load_Item.handle._user_aborted !== undefined))
            {

                ret = this.context._onHttpTransactionError(this.context, true, this.context, fireerrorcode, requesturi, returncode, requesturi, locationuri, extramsg);

                if (fireerrorcode != "comm_cancel_byuser" && fireerrorcode != "comm_stop_transaction_byesc")
                    ret = false;
                if (ret) return true;
            }
        }

        if (fireerrorcode == "comm_cancel_byuser" || fireerrorcode == "comm_stop_transaction_byesc")
        {
          if (ret && load_Item.handle && !load_Item.handle._user_aborted && load_Item.handle._user_aborted !== undefined)
                return ret;
            if (load_Item._is_cancel !== undefined && !load_Item._is_cancel)
                return ret;
        }

        this.removeDataItem(svcid);
        this.removeTransactionItem(svcid);
        this.dataCnt--;

        if (callback_func && typeof (callback_func) == "function")
        {
            callback_func.call(this.context, svcid, errstatus, message, elapsedtime);
            if (errstatus === 0)
            {
              load_Item.handle = null;
            }
        }

        return ret;
    }
};